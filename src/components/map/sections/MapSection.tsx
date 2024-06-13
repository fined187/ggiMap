import { Form } from '@/models/Form'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '@/store/atom/postUser'
import { NaverMap } from '@/models/Map'
import useMap, { INITIAL_CENTER, INITIAL_ZOOM, MAP_KEY } from './hooks/useMap'
import Map from './GGIMap'
import BoxGuard from '@/components/shared/BoxGuard'
import SearchBox from '../sideMenu/searchBox'
import ListBox from '../sideMenu/searchListBox/listBox/ListBox'
import Flex from '@/components/shared/Flex'
import TopBar from '../top'
import TopAddress from '../top/TopAddress'
import BottomAddress from '../top/BottomAddress'
import Markers from './markers/Markers'
import { mapAtom, mapItemOriginAtom } from '@/store/atom/map'
import { MapCountsResponse, MapItem } from '@/models/MapItem'
import Clusterings from './markers/Clusterings'
import Overlay from './Overlay'
import useSWR from 'swr'
import AddressContainer from '../top/AddressContainer'
import { useSearchAddr } from './hooks/useSearchAddr'

interface MapProps {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
  topJuso: jusoProps
  setTopJuso: Dispatch<SetStateAction<jusoProps>>
  bottomJuso: jusoProps
  setBottomJuso: Dispatch<SetStateAction<jusoProps>>
  getGungu: string
  setGetGungu: Dispatch<SetStateAction<string>>
  setMapOptions: (map: NaverMap) => void
}

type PnuCount = {
  pnu: string
  type: number
  count: number
}

type jusoProps = {
  sido: string
  gungu: string
  dong: string
}

type pnuCounts = {
  updatedCounts: PnuCount[]
}

export default function MapSection({
  formData,
  setFormData,
  topJuso,
  setTopJuso,
  bottomJuso,
  setBottomJuso,
  getGungu,
  setGetGungu,
  setMapOptions,
}: MapProps) {
  console.log('2번')
  const { data: map } = useSWR(MAP_KEY)
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemOriginAtom)
  const [pnuCounts, setPnuCounts] = useState<pnuCounts>({ updatedCounts: [] })
  const [originPnuCounts, setOriginPnuCounts] = useState<pnuCounts>({
    updatedCounts: [],
  })
  const [includeWinYn, setIncludeWinYn] = useState<boolean>(false)
  const user = useRecoilValue(userAtom)
  const [zoom, setZoom] = useState<number>(16)
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [openOverlay, setOpenOverlay] = useState(false)
  const [clickedItem, setClickedItem] = useState<MapItem | null>(null)
  const markerClickedRef = useRef(false)
  const [isOpen, setIsOpen] = useState(true)
  const [style, setStyle] = useState({
    position: 'absolute',
    width: '300px',
    height: '326px',
    zIndex: 999,
  })
  const [positionSet, setPositionSet] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })
  const [duplicatedItems, setDuplicatedItems] = useState<MapItem[]>([])
  const [clickedMapType, setClickedMapType] = useState({
    basic: true,
    terrain: false,
    satellite: false,
    cadastral: false,
    interest: false,
    roadView: false,
    current: false,
    distance: false,
    area: false,
  })
  const [center, setCenter] = useState({
    lat: user.lat,
    lng: user.lng,
  })

  const [openCursor, setOpenCursor] = useState(false)
  const [range, setRange] = useState(0)
  const [halfDimensions, setHalfDimensions] = useState({
    width: 0,
    height: 0,
  })
  const searchCoordinateToAddress = useCallback(
    async (lat: number, lng: number) => {
      if (window.naver?.maps?.Service?.reverseGeocode !== undefined) {
        try {
          const result: any = await new Promise((resolve, reject) => {
            window.naver.maps.Service.reverseGeocode(
              {
                location: new window.naver.maps.LatLng(lat, lng),
              },
              (status: any, response: any) => {
                if (status !== window.naver.maps.Service.Status.OK) {
                  reject('주소를 찾을 수 없습니다.')
                } else {
                  resolve(response.result.items[0].addrdetail)
                }
              },
            )
          })
          // 주소 설정
          setTopJuso({
            sido: result.sido,
            gungu:
              result.sigugun.split(' ')[0] === ''
                ? '세종시'
                : result.sigugun.split(' ')[0],
            dong: result.dongmyun,
          })
          // 군구 설정
          if (
            result.sigugun.split(' ')[0].match(/시$/) &&
            !result.sigugun.split(' ')[1]
          ) {
            setGetGungu(result.sigugun.split(' ')[0])
          } else if (
            result.sigugun.split(' ')[1] &&
            result.sigugun.split(' ')[1].match(/구$/)
          ) {
            setGetGungu(result.sigugun.split(' ')[1])
          }
        } catch (error) {
          alert(error)
        }
      }
    },
    [setTopJuso, setGetGungu],
  )
  const initialCenter = useMemo(() => {
    return user.lat && user.lng
      ? { lat: user.lat, lng: user.lng }
      : INITIAL_CENTER
  }, [user.lat, user.lng])

  const { initializeMap } = useMap()

  const onLoadMap = (map: NaverMap) => {
    initializeMap(map)
  }

  const handleSyncMap = useCallback(() => {
    setFormData((prev) => {
      return {
        ...prev,
        interests: clickedMapType.interest,
      }
    })
  }, [clickedMapType.interest, setFormData])

  const handleGetPnuCounts = useCallback(() => {
    const countsMap: {
      [pnu: string]: number
    } = {}
    mapItems.forEach((item) => {
      countsMap[item.pnu] = (countsMap[item.pnu] || 0) + 1
    })
    const maxCounts: {
      [pnu: string]: number
    } = {}
    Object.keys(countsMap).forEach((pnu) => {
      const count = countsMap[pnu]
      if (!maxCounts[pnu] || count > maxCounts[pnu]) {
        maxCounts[pnu] = count
      }
    })
    const updatedCounts = Object.keys(maxCounts).map((pnu) => ({
      pnu,
      type: mapItems.find((item) => item.pnu === pnu)?.type!,
      count: maxCounts[pnu] as number,
    }))
    setPnuCounts({ updatedCounts })
  }, [mapItems])

  const handleGetOriginMapPnuCounts = useCallback(() => {
    const countsMap: {
      [pnu: string]: number
    } = {}
    mapOrigin.forEach((item) => {
      countsMap[item.pnu] = (countsMap[item.pnu] || 0) + 1
    })
    const maxCounts: {
      [pnu: string]: number
    } = {}
    Object.keys(countsMap).forEach((pnu) => {
      const count = countsMap[pnu]
      if (!maxCounts[pnu] || count > maxCounts[pnu]) {
        maxCounts[pnu] = count
      }
    })
    const updatedCounts = Object.keys(maxCounts).map((pnu) => ({
      pnu,
      type: mapOrigin.find((item) => item.pnu === pnu)?.type!,
      count: maxCounts[pnu] as number,
    }))
    setOriginPnuCounts({ updatedCounts })
  }, [mapOrigin])

  const handleDuplicatedItems = useCallback(() => {
    if (mapItems) {
      // type === 1, 2, 3이면서 winYn !== 'Y'인 아이템들과 pnu가 같은 item.winYn === 'Y' 아이템들을 걸러내기
      const duplicatedItems = mapItems.filter(
        (item) =>
          mapItems.findIndex(
            (item2) => item2.pnu === item.pnu && item2.winYn !== item.winYn,
          ) !== -1,
      )
      const duplicatedKwItems = mapItems.filter(
        (item) =>
          item.type === 4 &&
          mapItems.some(
            (item2) =>
              (item2.type === 1 || item2.type === 2 || item2.type === 3) &&
              item2.pnu === item.pnu,
          ),
      )

      if (formData.ekm || formData.egm || formData.egg) {
        if (duplicatedItems.length > 0) {
          setDuplicatedItems(duplicatedItems)
          // winYn이 'Y'인 아이템의 x, y 좌표 리스트 만들기
          const duplicatedYItems = duplicatedItems
            .filter((item) => item.winYn === 'Y')
            .map((item) => ({
              pnu: item.pnu,
            }))
          const filteredItems = mapItems.filter((item) => {
            const isDuplicatedYItem = duplicatedYItems.some(
              (dupItem) => item.pnu === dupItem.pnu,
            )
            if (isDuplicatedYItem) {
              // winYn === 'Y' 인 아이템과 item.type === 4인 아이템이 좌표가 같을 경우
              const hasType4 = mapItems.some(
                (otherItem) =>
                  otherItem.pnu === item.pnu && otherItem.type === 4,
              )
              if (item.winYn !== 'Y' && hasType4) {
                return false // type === 4인 아이템 제거
              }
              // winYn === 'Y' 인 아이템과 item.type === 1 || 2 || 3 이면서 winYn !== 'Y' 아이템이 좌표가 같은 경우
              const hasType1Or2Or3NonY = mapItems.some(
                (otherItem) =>
                  otherItem.pnu === item.pnu &&
                  (otherItem.type === 1 ||
                    otherItem.type === 2 ||
                    otherItem.type === 3) &&
                  otherItem.winYn !== 'Y',
              )
              if (hasType1Or2Or3NonY && item.winYn === 'Y') {
                return false // winYn === 'Y'인 아이템 제거
              }
            }
            return true // 유지
          })
          setMapItems(filteredItems)
        }
      }
      if (formData.kw) {
        if (duplicatedKwItems.length > 0) {
          const filteredItems = mapItems.filter((item) => {
            const isDuplicatedKwItem = duplicatedKwItems.some(
              (dupItem) =>
                item.pnu === dupItem.pnu && item.type === dupItem.type,
            )
            if (isDuplicatedKwItem) {
              // type === 4인 아이템 제거
              return false
            }
            return true
          })
          setMapItems(filteredItems)
        }
      }
    }
  }, [mapItems, setMapItems, setDuplicatedItems, formData])

  useEffect(() => {
    handleSyncMap()
  }, [clickedMapType])

  useEffect(() => {
    if (mapItems) {
      setPnuCounts({ updatedCounts: [] })
      handleGetPnuCounts()
      handleGetOriginMapPnuCounts()
    }
  }, [mapItems, mapOrigin])

  useEffect(() => {
    if (mapItems) {
      handleDuplicatedItems()
    }
  }, [formData.ekm, formData.kw, mapItems])

  useEffect(() => {
    if (map) {
      const mapCenter = map.getCenter()
      const center: { lat: number; lng: number } = {
        lat: mapCenter.lat(),
        lng: mapCenter.lng(),
      }
      searchCoordinateToAddress(center.lat, center.lng)
    }
  }, [map && map.center])

  useEffect(() => {
    searchCoordinateToAddress(user.lat, user.lng)
  }, [user.lat, user.lng, user.address])
  return (
    <>
      <Map
        onLoad={onLoadMap}
        initialCenter={
          initialCenter && 'lat' in initialCenter
            ? [initialCenter.lat, initialCenter.lng]
            : undefined
        }
        zoom={INITIAL_ZOOM}
        formData={formData}
        setFormData={setFormData}
        setCenter={setCenter}
        clickedMapType={clickedMapType}
        setZoom={setZoom}
        setMapCount={setMapCount}
        markerClickedRef={markerClickedRef}
        setOpenOverlay={setOpenOverlay}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setClickedMapType={setClickedMapType}
        center={center}
        setHalfDimensions={setHalfDimensions}
        setMapOptions={setMapOptions}
      />
      <BoxGuard isOpen={isOpen} setIsOpen={setIsOpen}>
        <SearchBox
          formData={formData}
          setFormData={setFormData}
          center={center}
          setCenter={setCenter}
        />
        <ListBox formData={formData} isOpen={isOpen} setIsOpen={setIsOpen} />
      </BoxGuard>
      <Flex direction="column">
        <TopBar openCursor={openCursor}>
          <AddressContainer
            topJuso={topJuso}
            setTopJuso={setTopJuso}
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
            range={range}
            setRange={setRange}
            setBottomJuso={setBottomJuso}
          />
        </TopBar>
        {openCursor ? (
          <BottomAddress
            center={center}
            setCenter={setCenter}
            zoom={zoom}
            setZoom={setZoom}
            range={range}
            setRange={setRange}
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
            topJuso={topJuso}
            setTopJuso={setTopJuso}
            bottomJuso={bottomJuso}
            setBottomJuso={setBottomJuso}
          />
        ) : null}
      </Flex>
      <Markers
        pnuCounts={pnuCounts}
        originPnuCounts={originPnuCounts}
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        markerClickedRef={markerClickedRef}
        duplicatedItems={duplicatedItems}
        includeWinYn={includeWinYn}
      />
      <Clusterings item={mapCount} />
      {openOverlay && (
        <Overlay
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          openOverlay={openOverlay}
          setOpenOverlay={setOpenOverlay}
          markerClickedRef={markerClickedRef}
          style={style}
          setIncludeWinYn={setIncludeWinYn}
          positionSet={positionSet}
          setPositionSet={setPositionSet}
          halfDimensions={halfDimensions}
          setHalfDimensions={setHalfDimensions}
        />
      )}
    </>
  )
}

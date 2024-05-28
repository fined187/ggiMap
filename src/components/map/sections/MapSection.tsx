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

interface MapProps {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
}

type PnuCount = {
  pnu: string
  type: number
  count: number
}

type pnuCounts = {
  updatedCounts: PnuCount[]
}

export default function MapSection({ formData, setFormData }: MapProps) {
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemOriginAtom)
  const [pnuCounts, setPnuCounts] = useState<pnuCounts>({ updatedCounts: [] })
  const [originPnuCounts, setOriginPnuCounts] = useState<pnuCounts>({
    updatedCounts: [],
  })
  const user = useRecoilValue(userAtom)
  const [zoom, setZoom] = useState<number>(16)
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [openOverlay, setOpenOverlay] = useState(false)
  const [clickedItem, setClickedItem] = useState<MapItem | null>(null)
  const markerClickedRef = useRef(false)
  const [isOpen, setIsOpen] = useState(true)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [style, setStyle] = useState({
    position: 'absolute',
    width: '300px',
    height: '326px',
    zIndex: 999,
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
  const [topJuso, setTopJuso] = useState({
    sido: '',
    gungu: '',
    dong: '',
  })
  const [bottomJuso, setBottomJuso] = useState({
    sido: '',
    gungu: '',
    dong: '',
  })
  const [openCursor, setOpenCursor] = useState(false)
  const [range, setRange] = useState(0)

  const initialCenter = useMemo(() => {
    if (user.lat && user.lng) {
      return {
        lat: user.lat,
        lng: user.lng,
      }
    } else {
      INITIAL_CENTER
    }
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
  }, [clickedMapType, setFormData])

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
      // type === 1, 2, 3이면서 winYn !== 'Y'인 아이템들과 좌표가 같은 item.winYn === 'Y' 아이템들을 걸러내기
      const duplicatedItems = mapItems.filter(
        (item) =>
          mapItems.findIndex(
            (item2) =>
              item2.x === item.x &&
              item2.y === item.y &&
              item2.winYn !== item.winYn,
          ) !== -1,
      )
      if (duplicatedItems.length > 0) {
        setDuplicatedItems(duplicatedItems)
        // winYn이 'Y'인 아이템의 x, y 좌표 리스트 만들기
        const duplicatedYItems = duplicatedItems
          .filter((item) => item.winYn === 'Y')
          .map((item) => ({
            x: item.x,
            y: item.y,
          }))
        const filteredItems = mapItems.filter((item) => {
          const isDuplicatedYItem = duplicatedYItems.some(
            (dupItem) => item.x === dupItem.x && item.y === dupItem.y,
          )
          if (isDuplicatedYItem) {
            // winYn === 'Y' 인 아이템과 item.type === 4인 아이템이 좌표가 같을 경우
            const hasType4 = mapItems.some(
              (otherItem) =>
                otherItem.x === item.x &&
                otherItem.y === item.y &&
                otherItem.type === 4,
            )
            if (item.winYn !== 'Y' && hasType4) {
              return false // type === 4인 아이템 제거
            }
            // winYn === 'Y' 인 아이템과 item.type === 1 || 2 || 3 이면서 winYn !== 'Y' 아이템이 좌표가 같은 경우
            const hasType1Or2Or3NonY = mapItems.some(
              (otherItem) =>
                otherItem.x === item.x &&
                otherItem.y === item.y &&
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
      return duplicatedItems
    }
  }, [mapItems, setMapItems])

  useEffect(() => {
    handleSyncMap()
  }, [clickedMapType])

  useEffect(() => {
    if (mapItems) {
      setPnuCounts({ updatedCounts: [] })
      handleGetPnuCounts()
      handleGetOriginMapPnuCounts()
      handleDuplicatedItems()
    }
  }, [mapItems, mapOrigin])
  return (
    <>
      <Map
        onLoad={onLoadMap}
        initialCenter={[initialCenter?.lat!, initialCenter?.lng!]}
        zoom={INITIAL_ZOOM}
        formData={formData}
        setFormData={setFormData}
        setCenter={setCenter}
        clickedMapType={clickedMapType}
        setZoom={setZoom}
        mapCount={mapCount}
        setMapCount={setMapCount}
        markerClickedRef={markerClickedRef}
        setOpenOverlay={setOpenOverlay}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setClickedMapType={setClickedMapType}
        center={center}
      />
      <BoxGuard isOpen={isOpen} setIsOpen={setIsOpen}>
        <SearchBox
          formData={formData}
          setFormData={setFormData}
          center={center}
          setCenter={setCenter}
        />
        <ListBox
          formData={formData}
          setFormData={setFormData}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </BoxGuard>
      <Flex direction="column">
        <TopBar openCursor={openCursor}>
          <TopAddress
            SidoAddr={true}
            GunguAddr={false}
            DongAddr={false}
            isEnd={false}
            center={center}
            setCenter={setCenter}
            topJuso={topJuso}
            setTopJuso={setTopJuso}
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
            range={range}
            setRange={setRange}
            bottomJuso={bottomJuso}
            setBottomJuso={setBottomJuso}
          />
          <TopAddress
            SidoAddr={false}
            GunguAddr={true}
            DongAddr={false}
            isEnd={false}
            center={center}
            setCenter={setCenter}
            topJuso={topJuso}
            setTopJuso={setTopJuso}
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
            range={range}
            setRange={setRange}
            bottomJuso={bottomJuso}
            setBottomJuso={setBottomJuso}
          />
          <TopAddress
            SidoAddr={false}
            GunguAddr={false}
            DongAddr={true}
            isEnd={true}
            center={center}
            setCenter={setCenter}
            topJuso={topJuso}
            setTopJuso={setTopJuso}
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
            range={range}
            setRange={setRange}
            bottomJuso={bottomJuso}
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
        offset={offset}
        setOffset={setOffset}
        duplicatedItems={duplicatedItems}
      />
      <Clusterings formData={formData} item={mapCount} />
      {openOverlay && (
        <Overlay
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          openOverlay={openOverlay}
          setOpenOverlay={setOpenOverlay}
          markerClickedRef={markerClickedRef}
          style={style}
        />
      )}
    </>
  )
}

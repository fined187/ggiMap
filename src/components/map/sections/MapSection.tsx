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
import { mapAtom } from '@/store/atom/map'
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
  const [pnuCounts, setPnuCounts] = useState<pnuCounts>({ updatedCounts: [] })
  const user = useRecoilValue(userAtom)
  const [zoom, setZoom] = useState<number>(16)
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [openOverlay, setOpenOverlay] = useState(false)
  const [clickedItem, setClickedItem] = useState<MapItem | null>(null)
  const markerClickedRef = useRef(false)
  const [isOpen, setIsOpen] = useState(true)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const { data: map } = useSWR<NaverMap>(MAP_KEY)
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

  const handleDuplicateLatLngMarkerCheck = useCallback(() => {
    if (mapItems) {
      const duplicatedLatLngItems = mapItems.filter(
        // mapItems 배열에서 x, y값이 같은 아이템을 찾아서 duplicatedLatLngItems 배열에 저장
        (item, index) =>
          mapItems.findIndex(
            (item2) =>
              item2.x === item.x &&
              item2.y === item.y &&
              item2.winYn !== item.winYn,
          ) !== -1,
      )
      if (duplicatedLatLngItems.length > 0) {
        // duplicatedLatLngItems 배열에 아이템이 있으면 duplicatedLatLngYItems 배열에 winYn이 Y인 아이템만 저장
        setDuplicatedItems(duplicatedLatLngItems)
        const duplicatedLatLngYItems = duplicatedLatLngItems
          .filter((item) => item.winYn === 'Y')
          .map((item) => ({
            x: item.x,
            y: item.y,
          }))
        setMapItems(
          (
            prev, // duplicatedLatLngYItems 배열에 있는 아이템을 mapItems 배열에서 제거
          ) =>
            prev.filter(
              (item) =>
                !(
                  duplicatedLatLngYItems.some(
                    (dupItem) => item.x === dupItem.x && item.y === dupItem.y,
                  ) && item.winYn === 'Y'
                ),
            ),
        )
      }

      return duplicatedLatLngItems
    }
  }, [mapItems])

  useEffect(() => {
    handleSyncMap()
  }, [clickedMapType])

  useEffect(() => {
    if (mapItems) {
      setPnuCounts({ updatedCounts: [] })
      handleGetPnuCounts()
      handleDuplicateLatLngMarkerCheck()
    }
  }, [mapItems])
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

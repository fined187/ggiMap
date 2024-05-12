import { Form } from '@/models/Form'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '@/store/atom/postUser'
import { Coordinates, NaverMap } from '@/models/Map'
import useMap, { INITIAL_CENTER, INITIAL_ZOOM, MAP_KEY } from './hooks/useMap'
import Map from './GGIMap'
import MapType from './mapType/MapType'
import MapFunction from './MapFunc/MapFunction'
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
import useSWR from 'swr'
import Clusterings from './markers/Clusterings'
import Overlay from './Overlay'

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

  const handleSyncMap = () => {
    setFormData((prev) => {
      return {
        ...prev,
        interests: clickedMapType.interest,
      }
    })
  }

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

  useEffect(() => {
    handleSyncMap()
  }, [clickedMapType])

  useEffect(() => {
    if (mapItems) {
      setPnuCounts({ updatedCounts: [] })
      handleGetPnuCounts()
    }
  }, [mapItems])

  const handleGetOffset = useCallback((x: number, y: number) => {}, [])
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
      />
      <BoxGuard>
        <SearchBox
          formData={formData}
          setFormData={setFormData}
          center={center}
          setCenter={setCenter}
        />
        <ListBox formData={formData} setFormData={setFormData} />
      </BoxGuard>
      <Flex direction="column">
        <TopBar>
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
            setOpenCursor={setOpenCursor}
            topJuso={topJuso}
            setTopJuso={setTopJuso}
            bottomJuso={bottomJuso}
            setBottomJuso={setBottomJuso}
          />
        ) : null}
      </Flex>
      <MapType
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      />
      <MapFunction
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
        center={center}
        setCenter={setCenter}
      />
      <Markers
        pnuCounts={pnuCounts}
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
      />
      <Clusterings formData={formData} item={mapCount} />
      {openOverlay && (
        <Overlay clickedItem={clickedItem} setClickedItem={setClickedItem} />
      )}
    </>
  )
}

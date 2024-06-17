import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { NaverMap } from '@/models/Map'
import useMap, { INITIAL_CENTER, INITIAL_ZOOM } from './hooks/useMap'
import Map from './GGIMap'
import BoxGuard from '@/components/shared/BoxGuard'
import SearchBox from '../sideMenu/searchBox'
import ListBox from '../sideMenu/searchListBox/listBox/ListBox'
import Flex from '@/components/shared/Flex'
import TopBar from '../top'
import BottomAddress from '../top/BottomAddress'
import Markers from './markers/Markers'
import Clusterings from './markers/Clusterings'
import Overlay from './Overlay'
import AddressContainer from '../top/AddressContainer'
import useMapUtils from './hooks/useMapUtils'
import { authInfo } from '@/store/atom/auth'

interface MapProps {
  setGetGungu: Dispatch<SetStateAction<string>>
  token: string
  handleParameters: (
    params1?: string,
    params2?: string,
    params3?: string,
    map?: NaverMap,
  ) => void
  idCode?: string
  type?: string
}

export default function MapSection({
  setGetGungu,
  token,
  idCode,
  type,
  handleParameters,
}: MapProps) {
  const auth = useRecoilValue(authInfo)
  const [openCursor, setOpenCursor] = useState<boolean>(false)
  const markerClickedRef = useRef<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [halfDimensions, setHalfDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [range, setRange] = useState<number>(0)
  const {
    pnuCounts,
    originPnuCounts,
    duplicatedItems,
    includeWinYn,
    center,
    setCenter,
    zoom,
    setZoom,
    mapCount,
    setMapCount,
    openOverlay,
    setOpenOverlay,
    clickedItem,
    setClickedItem,
    isOpen,
    setIsOpen,
    clickedMapType,
    setClickedMapType,
    handleFilterMarkers,
  } = useMapUtils(
    token,
    type ?? '',
    idCode ?? '',
    setGetGungu,
    handleParameters,
  )
  const initialCenter = useMemo(() => {
    return auth.lat && auth.lng
      ? { lat: auth.lat, lng: auth.lng }
      : INITIAL_CENTER
  }, [auth.lat, auth.lng])

  const { initializeMap } = useMap()

  const onLoadMap = (map: NaverMap) => {
    initializeMap(map)
  }

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
        page={page}
        setPage={setPage}
      />
      <BoxGuard isOpen={isOpen} setIsOpen={setIsOpen}>
        <SearchBox center={center} setCenter={setCenter} />
        <ListBox
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          page={page}
          setPage={setPage}
        />
      </BoxGuard>
      <Flex direction="column">
        <TopBar openCursor={openCursor}>
          <AddressContainer
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
            range={range}
            setRange={setRange}
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
        handleFilterMarkers={handleFilterMarkers}
      />
      <Clusterings item={mapCount} />
      {openOverlay && (
        <Overlay
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          halfDimensions={halfDimensions}
        />
      )}
    </>
  )
}

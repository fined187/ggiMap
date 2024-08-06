import { useRef, useState } from 'react'
import { NaverMap } from '@/models/Map'
import useMap, { INITIAL_ZOOM } from './hooks/useMap'
import Map from './GGIMap'
import BoxGuard from '@/components/shared/BoxGuard'
import SearchBox from '../sideMenu/searchBox'
import ListBox from '../sideMenu/searchListBox/listBox/ListBox'
import Flex from '@/components/shared/Flex'
import TopBar from '../top'
import BottomAddress from '../top/BottomAddress'
import Markers from './markers/Markers'
import Clusterings from './markers/Clusterings'
import Overlay from './overlay'
import AddressContainer from '../top/AddressContainer'
import useMapUtils from './hooks/useMapUtils'

const isHalfWindow = () => window.innerWidth < 768

export default function MapSection() {
  const [openCursor, setOpenCursor] = useState<boolean>(false)
  const markerClickedRef = useRef<boolean>(false)
  const [halfDimensions, setHalfDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [range, setRange] = useState<number>(0)
  const dragStateRef = useRef(false)
  const {
    mapCount,
    setMapCount,
    openOverlay,
    setOpenOverlay,
    isOpen,
    setIsOpen,
    clickedMapType,
    setClickedMapType,
  } = useMapUtils()

  const { initializeMap, initMap } = useMap()

  const onLoadMap = (map: NaverMap) => {
    initializeMap(map)
    initMap(map)
  }

  return (
    <>
      <Map
        onLoad={onLoadMap}
        zoom={INITIAL_ZOOM}
        clickedMapType={clickedMapType}
        setMapCount={setMapCount}
        markerClickedRef={markerClickedRef}
        setOpenOverlay={setOpenOverlay}
        setClickedMapType={setClickedMapType}
        setHalfDimensions={setHalfDimensions}
        dragStateRef={dragStateRef}
        openCursor={openCursor}
        setOpenCursor={setOpenCursor}
      />
      <BoxGuard isOpen={isOpen}>
        <SearchBox setOpenOverlay={setOpenOverlay} />
        <ListBox
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dragStateRef={dragStateRef}
          setOpenOverlay={setOpenOverlay}
        />
      </BoxGuard>
      <Flex
        direction="column"
        style={{
          display: isHalfWindow() ? 'none' : 'flex',
        }}
      >
        <TopBar openCursor={openCursor}>
          <AddressContainer
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
            range={range}
            setRange={setRange}
            setOpenOverlay={setOpenOverlay}
          />
        </TopBar>
        {openCursor && (
          <BottomAddress
            range={range}
            setRange={setRange}
            setOpenCursor={setOpenCursor}
          />
        )}
      </Flex>
      <Markers
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        markerClickedRef={markerClickedRef}
      />
      <Clusterings item={mapCount} />
      {openOverlay && (
        <Overlay halfDimensions={halfDimensions} openOverlay={openOverlay} />
      )}
    </>
  )
}

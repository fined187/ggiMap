import { MapItem } from '@/models/MapItem'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import MarkerRenderer from './MarkerRenderer'
import { NaverMap } from '@/models/Map'

interface MarkerProps {
  item: MapItem
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  index: number
}

const Marker = ({
  item,
  openOverlay,
  setOpenOverlay,
  markerClickedRef,
  index,
}: MarkerProps) => {
  return (
    <MarkerRenderer
      item={item}
      index={index}
      openOverlay={openOverlay}
      setOpenOverlay={setOpenOverlay}
      markerClickedRef={markerClickedRef}
    />
  )
}

export default Marker

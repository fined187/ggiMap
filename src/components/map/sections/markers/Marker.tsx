import { MapItem } from '@/models/MapItem'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import MarkerRenderer from './MarkerRenderer'

type PnuProps = {
  pnu: string
  count: number
  type: number
  includeYn: boolean
}

interface MarkerProps {
  item: MapItem
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
  originPnuCounts: {
    updatedCounts: PnuProps[]
  }
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  index: number
  handleFilterMarkers: () => MapItem[] | undefined
}

const Marker = ({
  item,
  pnuCounts,
  originPnuCounts,
  openOverlay,
  setOpenOverlay,
  markerClickedRef,
  index,
  handleFilterMarkers,
}: MarkerProps) => {
  return (
    <MarkerRenderer
      item={item}
      index={index}
      pnuCounts={pnuCounts}
      originPnuCounts={originPnuCounts}
      openOverlay={openOverlay}
      setOpenOverlay={setOpenOverlay}
      markerClickedRef={markerClickedRef}
      handleFilterMarkers={handleFilterMarkers}
    />
  )
}

export default Marker

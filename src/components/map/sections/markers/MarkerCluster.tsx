import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import Markers from './Markers'

interface MarkerClusterProps {
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
}

export default function MarkerCluster({
  markerClickedRef,
  openOverlay,
  setOpenOverlay,
}: MarkerClusterProps) {
  return (
    <>
      <Markers
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        markerClickedRef={markerClickedRef}
      />
    </>
  )
}

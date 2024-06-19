import { MapItem } from '@/models/MapItem'
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import Markers from './Markers'

type PnuProps = {
  pnu: string
  count: number
  type: number
  includeYn: boolean
}

interface MarkerClusterProps {
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
  originPnuCounts: {
    updatedCounts: PnuProps[]
  }
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  handleFilterMarkers: () => MapItem[] | undefined
}

export default function MarkerCluster({
  handleFilterMarkers,
  markerClickedRef,
  openOverlay,
  setOpenOverlay,
  originPnuCounts,
  pnuCounts,
}: MarkerClusterProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
  const clustererRef = useRef<any>(null)
  return (
    <>
      <Markers
        pnuCounts={pnuCounts}
        originPnuCounts={originPnuCounts}
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        markerClickedRef={markerClickedRef}
        handleFilterMarkers={handleFilterMarkers}
      />
    </>
  )
}

import { NaverMap } from '@/models/Map'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { useRecoilState } from 'recoil'
import { mapItemsAtom } from '@/store/atom/map'
import Marker from './Marker'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { MapItem } from '@/models/MapItem'

type PnuProps = {
  pnu: string
  count: number
  type: number
}

interface MarkersProps {
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
  originPnuCounts: {
    updatedCounts: PnuProps[]
  }
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  markerClickedRef: MutableRefObject<boolean>
  handleFilterMarkers: () => MapItem[] | undefined
}

export default function Markers({
  pnuCounts,
  openOverlay,
  setOpenOverlay,
  clickedItem,
  setClickedItem,
  markerClickedRef,
  originPnuCounts,
  handleFilterMarkers,
}: MarkersProps) {
  const [mapItems, setMapItems] = useRecoilState(mapItemsAtom)
  if (handleFilterMarkers() === undefined) {
    return null
  }
  return (
    <>
      {handleFilterMarkers()
        ? handleFilterMarkers()?.map((item, index) => {
            return (
              <Marker
                key={item.id}
                index={index}
                item={item}
                setMapItems={setMapItems}
                mapItems={mapItems}
                pnuCounts={pnuCounts}
                openOverlay={openOverlay}
                setOpenOverlay={setOpenOverlay}
                clickedItem={clickedItem}
                setClickedItem={setClickedItem}
                markerClickedRef={markerClickedRef}
                originPnuCounts={originPnuCounts}
                handleFilterMarkers={handleFilterMarkers}
              />
            )
          })
        : null}
    </>
  )
}

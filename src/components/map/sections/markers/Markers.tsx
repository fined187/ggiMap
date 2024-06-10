import { NaverMap } from '@/models/Map'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { useRecoilState } from 'recoil'
import { mapAtom } from '@/store/atom/map'
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
  clickedItem: any
  setClickedItem: any
  markerClickedRef: MutableRefObject<boolean>
  duplicatedItems: MapItem[]
  includeWinYn: boolean
}

export default function Markers({
  pnuCounts,
  openOverlay,
  setOpenOverlay,
  clickedItem,
  setClickedItem,
  markerClickedRef,
  duplicatedItems,
  originPnuCounts,
  includeWinYn,
}: MarkersProps) {
  const { data: map } = useSWR<NaverMap>(MAP_KEY)
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  return (
    <>
      {mapItems
        ? mapItems?.map((item, index) => {
            return (
              <Marker
                key={item.id}
                index={index}
                item={item}
                map={map as NaverMap}
                setMapItems={setMapItems}
                mapItems={mapItems}
                pnuCounts={pnuCounts}
                openOverlay={openOverlay}
                setOpenOverlay={setOpenOverlay}
                clickedItem={clickedItem}
                setClickedItem={setClickedItem}
                markerClickedRef={markerClickedRef}
                originPnuCounts={originPnuCounts}
              />
            )
          })
        : null}
    </>
  )
}

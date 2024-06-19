import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { MapItem } from '@/models/MapItem'
import Marker from './Marker'
import { useRecoilState } from 'recoil'
import { clickedItemAtom } from '@/store/atom/map'

type PnuProps = {
  pnu: string
  count: number
  type: number
  includeYn: boolean
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
  markerClickedRef: MutableRefObject<boolean>
  handleFilterMarkers: () => MapItem[] | undefined
}

export default function Markers({
  pnuCounts,
  openOverlay,
  setOpenOverlay,
  markerClickedRef,
  originPnuCounts,
  handleFilterMarkers,
}: MarkersProps) {
  return (
    <>
      {handleFilterMarkers()
        ? handleFilterMarkers()?.map((item, index) => {
            return (
              <Marker
                key={item.id}
                item={item}
                pnuCounts={pnuCounts}
                openOverlay={openOverlay}
                setOpenOverlay={setOpenOverlay}
                markerClickedRef={markerClickedRef}
                index={index}
                originPnuCounts={originPnuCounts}
                handleFilterMarkers={handleFilterMarkers}
              />
            )
          })
        : null}
    </>
  )
}

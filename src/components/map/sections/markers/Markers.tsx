import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import Marker from './Marker'
import { useRecoilState } from 'recoil'
import { mapItemsAtom } from '@/store/atom/map'

type PnuProps = {
  pnu: string
  count: number
  type: number
  includeYn: boolean
}

interface MarkersProps {
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
}

export default function Markers({
  openOverlay,
  setOpenOverlay,
  markerClickedRef,
}: MarkersProps) {
  const [mapItems, setMapItems] = useRecoilState(mapItemsAtom)
  return (
    <>
      {mapItems
        ? mapItems?.map((item, index) => {
            return (
              <Marker
                key={index}
                item={item}
                openOverlay={openOverlay}
                setOpenOverlay={setOpenOverlay}
                markerClickedRef={markerClickedRef}
                index={index}
              />
            )
          })
        : null}
    </>
  )
}

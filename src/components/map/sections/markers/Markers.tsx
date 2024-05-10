import { NaverMap } from '@/models/Map'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { useRecoilState } from 'recoil'
import { mapAtom } from '@/store/atom/map'
import Marker from './Marker'

type PnuProps = {
  pnu: string
  count: number
  type: number
}

interface MarkersProps {
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
}

export default function Markers({ pnuCounts }: MarkersProps) {
  const { data: map } = useSWR<NaverMap>(MAP_KEY)
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  return (
    <>
      {mapItems
        ? mapItems?.map((item) => {
            return (
              <Marker
                key={item.id}
                item={item}
                map={map as NaverMap}
                setMapItems={setMapItems}
                mapItems={mapItems}
                pnuCounts={pnuCounts}
              />
            )
          })
        : null}
    </>
  )
}

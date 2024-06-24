import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react'
import Marker from './Marker'
import { useRecoilState } from 'recoil'
import {
  isOnlySelectedAtom,
  mapItemsAtom,
  selectedItemAtom,
} from '@/store/atom/map'
import { MapItem } from '@/models/MapItem'

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
  const [mapItems] = useRecoilState(mapItemsAtom)
  const [selectedItem] = useRecoilState(selectedItemAtom)
  const [isOnlySelected] = useRecoilState(isOnlySelectedAtom)
  const handleOnlySelected = useCallback(() => {
    if (isOnlySelected) {
      const filteredItems = mapItems?.filter((item) =>
        item.ids.includes(selectedItem?.mapItem.ids[0] as string),
      )
      return filteredItems as unknown as Array<MapItem>
    } else {
      return mapItems
    }
  }, [isOnlySelected, mapItems, selectedItem])
  return (
    <>
      <Marker
        item={selectedItem?.mapItem as MapItem}
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        markerClickedRef={markerClickedRef}
        index={0}
      />
      {!isOnlySelected &&
        mapItems.map((item, index) => {
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
        })}
    </>
  )
}

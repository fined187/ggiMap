import { MapItem, MapItems } from '@/models/MapItem'
import { atom } from 'recoil'
import { v4 } from 'uuid'

type Props = {
  position: [number, number]
  type: number
  winYn: string
}

export const mapAtom = atom<MapItem[]>({
  key: `mapItems/${v4()}`,
  default: [],
})

export const mapItemOriginAtom = atom<MapItem[]>({
  key: `mapItemOrigin/${v4()}`,
  default: [],
})

export const mapListAtom = atom<MapItems[] | null>({
  key: `mapList/${v4()}`,
  default: null,
})

export const markerPositionAtom = atom<Props>({
  key: `markerPosition/${v4()}`,
  default: {
    position: [0, 0],
    type: 1,
    winYn: '',
  },
})

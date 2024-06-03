import { MapItem } from '@/models/MapItem'
import { atom } from 'recoil'
import { v4 } from 'uuid'

export const mapAtom = atom<MapItem[]>({
  key: `mapItems/${v4()}`,
  default: [],
})

export const loadingAtom = atom<boolean>({
  key: `loading/${v4()}`,
  default: false,
})

export const mapItemOriginAtom = atom<MapItem[]>({
  key: `mapItemOrigin/${v4()}`,
  default: [],
})

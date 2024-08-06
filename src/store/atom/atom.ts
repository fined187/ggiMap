import { atom } from 'recoil'
import { v4 } from 'uuid'

export const isPyeongState = atom({
  key: `isPyeongState/${v4()}`,
  default: false,
})

export const isCurrentStateAtom = atom({
  key: `isCurrentState/${v4()}`,
  default: false,
})

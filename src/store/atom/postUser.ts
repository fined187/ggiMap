import { atom } from 'recoil'
import { v4 } from 'uuid'

export const userAtom = atom({
  key: `auth/user/${v4()}`,
  default: {
    role: [''],
    aesUserId: '',
    address: '',
    lng: 127.105399,
    lat: 37.3595704,
  },
})

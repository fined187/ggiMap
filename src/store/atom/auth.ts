import { atom } from 'recoil'
import { v4 } from 'uuid'

export const authInfo = atom({
  key: `auth/${v4()}`,
  default: {
    isLogin: false,
    isAuth: false,
    token: '',
    Api_Key: 'iyv0Lk8v.GMiSXcZDDSRLquqAm7M9YHVwTF4aY8zr',
    role: [''],
    address: '',
    idCode: '',
    type: '',
    lng: 127.105399,
    lat: 37.3595704,
  },
})

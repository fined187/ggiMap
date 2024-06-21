export interface Auth {
  isLogin: boolean
  isAuth: boolean
  token: string
  Api_Key: string
  role: string[]
  address: string
  idCode: string
  type: string
  lng: number
  lat: number
  detailLng: number
  detailLat: number
}

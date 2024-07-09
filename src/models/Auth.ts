import { MapItem, PageInfo } from './MapItem'

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

interface MapItems {
  pnu: string
  x: number
  y: number
  count: number
  winExist: boolean
  types: number[]
  ids: string[]
  interest: string
  usage: string
  winYn: string
  amount?: number
  ratio: number
  buildingArea: string
  landArea: string
  share: string
}

interface Contents {
  type: number
  id: string
  idCode: string
  caseNo: string
  appraisalAmt: number
  minAmt: number
  winAmt: number
  ratio: number
  buildingArea: string
  landArea: string
  path: string
  status: string
  startDate: string
  dividendDate: string
  claim: number
  interest: string
  x: number
  y: number
  checkInfo: string
}

interface Paging {
  isFirst: boolean
  pageNumber: number
  isLast: boolean
  totalPages: number
  isEmpty: boolean
  pageSize: number
  totalElements: number
}

export interface TokenResponse {
  success: boolean
  code: number
  message: string
  data: {
    userId: string
    authorities: string[]
    mapItemCount?: number
    mapItems?: MapItem[]
    contents?: {
      contents: Contents[]
      paging: Paging
    }
  }
}

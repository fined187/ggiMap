export interface MapItem {
  pnu: string
  x: number
  y: number
  types: number[]
  ids: string[]
  interest: string
  usage: string
  winYn: string
  amount: string
  buildingArea: string
  landArea: string
  share: string
  ratio: number
  count: number
  winExist: boolean
}

export interface ListData {
  ids: string
  km: boolean
  kw: boolean
  gm: boolean
  gg: boolean
  x1: number
  y1: number
  x2: number
  y2: number
  ekm: boolean
  egm: boolean
  egg: boolean
  fromAppraisalAmount: number
  toAppraisalAmount: number
  fromMinimumAmount: number
  toMinimumAmount: number
  interests: boolean
  awardedMonths: number
  selectedId: string | null
  selectedType: number | null
}

export interface MapCounts {
  ids: string
  km: boolean
  kw: boolean
  gm: boolean
  gg: boolean
  x1: number
  y1: number
  x2: number
  y2: number
  level: number
}

export interface MapCountsResponse {
  count: number
  sd: string
  sgg: string
  umd: string
  x: number
  y: number
}

export interface MapItems {
  type: number
  id: string
  idCode: string
  goodsId?: string
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
  checkInfo?: string
  manageNo?: string
}

export interface PageInfo {
  isFirst: boolean
  isLast: boolean
  pageNumber: number
  totalPages: number
  isEmpty: boolean
  pageSize: number
  totalElements: number
}

export interface MapListResponse {
  contents: MapItems[]
  paging: PageInfo
}

export interface SearchListResponse {
  contents: MapItems[]
  pageInfo: PageInfo
}

export interface GetItemResponse {
  success: boolean
  code: number
  message: string
  data: MapItems
}

export interface MapItemsResponse {
  count: number
  mapItems: MapItem[]
}

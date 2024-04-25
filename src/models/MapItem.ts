export interface MapItem {
  pnu: string
  x: number
  y: number
  type: number
  id: string
  interest: string
  usage: string
  winYn: string
  amount: string
  buildingArea: string
  landArea: string
  share: string
  ratio: string
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
  userId: string
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

export interface mapItem {
  ids: string
  fromAppraisalAmount: number
  toAppraisalAmount: number
  fromMinimumAmount: number
  toMinimumAmount: number
  interests: boolean
  x1: number
  y1: number
  x2: number
  y2: number
  awardedMonths: number
  userId: string
  km: boolean
  kw: boolean
  gm: boolean
  gg: boolean
  ekm: boolean
  egm: boolean
  egg: boolean
}

export interface mapCounts {
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

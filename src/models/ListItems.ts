export interface Items {
  totalCount: number
  kmCount: number
  kmItems: KmItems[]
  kwCount: number
  kwItems: KwItems[]
  gmgCount: number
  gmgItems: GmgItems[]
}

export interface KmItems {
  idCode: string
  caseNo: string
  date: string
  appraisalAmt: number
  minAmt: number
  winAmt: number
  buildingArea: string
  landArea: string
  path: string
  interest: string
  x: number
  y: number
  claim?: string
  type?: number
  sale?: string
  period?: string
  manageNo?: string
}

export interface KwItems {
  idCode: string
  caseNo: string
  date: string
  claim: string
  interest: string
  x: number
  y: number
  appraisalAmt?: number
  minAmt?: number
  winAmt?: number
  buildingArea?: string
  landArea?: string
  path?: string
  type?: number
  sale?: string
  period?: string
  manageNo?: string
}

export interface GmgItems {
  goodsId: string
  caseNo?: string
  type: number
  sale: string
  period: string
  date: string
  appraisalAmt: number
  minAmt: number
  winAmt: number
  buildingArea: string
  landArea: string
  path: string
  interest: string
  x: number
  y: number
  claim?: string
  manageNo: string
}

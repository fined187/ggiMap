export type InterestInfo = {
  category: string
  starRating: string
  memo: string
}

export interface interest {
  infoId: string
  caseNo: string
  mulSeq: string
  oldInfoId: string
  infoNo: string
  interestInfo: InterestInfo
  count: number
  categories: string[]
  smsNotificationYn: string
  isWait: boolean
  manageNo?: string
  goodsId?: string
}

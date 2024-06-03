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

export interface InterestFormData {
  infoId: string
  caseNo?: string
  manageNo?: string
  mulSeq: string
  oldInfoId: string
  infoNo?: string
  isNewCategory: boolean
  interestInfo: {
    category: string
    memo: string
    starRating: string
  }
  title: string
  importance: string
  categories: string[]
  smsNotificationYn: string
  isWait: boolean
}

export interface InterestPostResponse {
  success: boolean
  data: interest
}

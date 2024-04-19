export interface DistributeType {
  sharedName: string[]
  sharedPercent: number[]
}

export interface IpchalType {
  sagunNum: string
  mulgunNum: string
  ipchalDate: string
  addr: string
  bidder: string
  bidderNum: number
  CorpYn: string
  distribute: DistributeType
  biddingPrice: number
  depositPrice: number
  bidWay: string
  bidName: string
  bidPhone1: string
  bidPhone2: string
  bidPhone3: string
  bidIdNum1?: string
  bidIdNum2?: string
  bidAddr: string
  bidAddrDetail: string
  bidCorpNum1?: string
  bidCorpNum2?: string
  bidCorpNum3?: string
  bidCorpRegiNum1?: string
  bidCorpRegiNum2?: string
}

export interface BiddingInfoType {
  bidderName: string[]
  bidderPhone1: string[]
  bidderPhone2: string[]
  bidderPhone3: string[]
  bidderIdNum1: string[]
  bidderIdNum2: string[]
  bidderAddr: string[]
  bidderAddrDetail: string[]
  bidderCorpNum1: string[]
  bidderCorpNum2: string[]
  bidderCorpNum3: string[]
  bidderCorpRegiNum1: string[]
  bidderCorpRegiNum2: string[]
  bidderCorpYn: string[]
  bidderJob: string[]
}

export interface AgentInfoType {
  agentName: string
  agentRel: string
  agentPhone1: string
  agentPhone2: string
  agentPhone3: string
  agentIdNum1: string
  agentIdNum2: string
  agentAddr: string
  agentAddrDetail?: string
  agentJob: string
}

export interface BidderList {
  peopleSeq: number
  bidderType: string
  name: string
  phoneNo: string
  address: string
  job: string
  companyNo: string
  corporationNo: string
  share: string
  mandateYn: string
}

export interface GetAgentInfoType {
  name: string
  relationship: string
  phoneNo: string
  address: string
  job: string
}

export interface GetBiddingInfoType {
  mstSeq: number
  state: number
  mulNo: string
  caseYear: string
  caseDetail: string
  startYear: string
  startMonth: string
  startDay: string
  reqCourtName: string
  biddingDate: string
  bidPrice: number
  bidDeposit: number
  depositType: string
  agentYn: string
  biddingCount: number
  number: number
  bidders: BidderList[]
  agent: GetAgentInfoType
}

export interface TotalResultType {
  mstSeq: number
  state: number
  mulNo: string
  caseYear: string
  caseDetail: string
  startYear: string
  startMonth: string
  startDay: string
  reqCourtName: string
  biddingDate: string
  bidPrice: number
  bidDeposit: number
  depositType: string
  agentYn: string
  agent: {
    name: string
    relationship: string
    phoneNo: string
    address: string
    job: string
  }
  courtFullName: string
  usage: string
  etcAddress: string
  roadAddress: string
  bidderCount: number
  bidders: BidderList[]
}

export interface SearchResultType {
  infoId: string
  caseNo: string
  mulSeq: string
  caseNoString: string
  subCaseNoString: string
  biddingDate: string
  usage: string
  reqCourtName: string
  mulNo: string
  address: string
  etcAddress: string
  roadAddress: string
  oldAddress: string
  landArea: string
  landPyungArea: string
  buildingArea: string
  buildingPyungArea: string
  pyungHyung: string
  failedBidsCount: string
  checkInfo: string
  biddingTime: string
  bidderCount: string
  nextLowestAmt: number
  carInfo: string
  appraisalAmount: number
  minimumAmount: number
}

export interface BiddingInfosType {
  biddingTime: string
  appraisalAmount: number
  minimumAmount: number
  bidDeposit: number
}
export interface SearchCheckType {
  infoId: string
  caseNo: string
  mulSeq: string
  biddingDate: string
  courtFullName: string
  reqCourtName: string
  mulNo: string
  caseYear: string
  caseDetail: string
  startYear: string
  startMonth: string
  startDay: string
  usage: string
  address: string
  etcAddress: string
  roadAddress: string
  oldAddress: string
  checkInfo: string
  carInfo: string
  biddingInfos: BiddingInfosType[]
}

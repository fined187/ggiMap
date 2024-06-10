import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import AgentListFormPDF from './AgentListFormPDF'
import IpcahlTextPDF from './IpchalTextPDF'
import CoIpchalFormPDF from './CoIpchalFormPDF'
import CoIpchalListPDF from './CoIpchalListPDF'
import { TotalResultType } from '@/models/IpchalType'
import { biddingInfoState } from '@/store/atom/bidForm'

interface CoIpchalProps {
  totalResult: TotalResultType
  handleDepositPrice: (length: number) => string | undefined
  handlePrice: (length: number) => string | undefined
}

export default function CoIpchalPDF({
  totalResult,
  handleDepositPrice,
  handlePrice,
}: CoIpchalProps) {
  const [biddingInfo, setBiddingInfo] = useRecoilState(biddingInfoState)
  const [loading, setLoading] = useState<boolean>(false)
  const [maxHeight, setMaxHeight] = useState<number>(3900)

  const mandatesList = totalResult?.bidders.filter(
    (item) => item.mandateYn === 'Y',
  )

  const totalPage = Math.ceil((mandatesList?.length ?? 0) / 3)
  const listPerPage = 3
  let currentPage = 1
  let currentList: any = []

  const handleReturnList = () => {
    let startIndex = (currentPage - 1) * listPerPage
    let endIndex = startIndex + listPerPage
    for (let i = 0; i < totalPage; i++) {
      currentList.push(mandatesList?.slice(startIndex, endIndex)) //  0 ~ 3, 3 ~ 6, 6 ~ 9
      startIndex = endIndex
      endIndex = endIndex + listPerPage
      currentPage++
    }
    return currentList.filter((item: any) => item.length > 0)
  }

  useEffect(() => {
    const handleMaxHeight = () => {
      if (
        totalResult &&
        totalResult.agentYn === 'Y' &&
        mandatesList.length <= 3 &&
        totalResult.bidders.length <= 10
      ) {
        setMaxHeight(6500)
      } else if (
        totalResult &&
        totalResult.agentYn === 'Y' &&
        mandatesList.length > 3 &&
        totalResult.bidders.length <= 10
      ) {
        setMaxHeight(Math.ceil(mandatesList.length / 3) * 1300 + 5200)
      } else if (
        totalResult &&
        totalResult.agentYn === 'Y' &&
        mandatesList.length <= 3 &&
        totalResult.bidders.length > 10
      ) {
        setMaxHeight(Math.ceil(totalResult.bidders.length / 10) * 1300 + 5200)
      } else if (
        totalResult &&
        totalResult.agentYn === 'Y' &&
        mandatesList.length > 3 &&
        totalResult.bidders.length > 10
      ) {
        setMaxHeight(
          Math.ceil(totalResult.bidders.length / 10) * 1300 +
            Math.ceil(mandatesList.length / 3) * 1300 +
            3900,
        )
      } else {
        setMaxHeight(5200)
      }
    }
    handleMaxHeight()
  }, [
    totalResult && totalResult.bidders.length,
    totalResult && totalResult.agentYn,
  ])

  const listTotalPage = Math.ceil((totalResult?.bidders.length ?? 0) / 10)
  const ipchalPerPage = 10
  let listCurrentPage = 1
  let listCurrentList: any = []

  const handleCoIpchalReturnList = () => {
    let startIndex = (listCurrentPage - 1) * ipchalPerPage
    let endIndex = startIndex + ipchalPerPage
    for (let i = 0; i < listTotalPage; i++) {
      listCurrentList.push(totalResult?.bidders.slice(startIndex, endIndex))
      startIndex = endIndex
      endIndex = endIndex + ipchalPerPage
      listCurrentPage++
    }
    return listCurrentList.filter((item: any) => item.length > 0)
  }

  return (
    <>
      <div className="w-[100%] relative h-[1300px] bg-white scrollbar-hide top-[65px]">
        <div className="border border-black relative text-[1.5rem] md:w-[800px] w-[85%] h-[650px] m-auto bg-white">
          {/* 첫 번째 박스 */}
          <div className="flex flex-col border-black border-b-[1px] h-[15%] w-[100%] justify-center items-center relative">
            <div className="absolute top-[0px] left-[0px] w-[100%] pl-[5px]">
              <span className="text-left text-[11pt] leading-[-1px] font-['batang']">
                (앞면)
              </span>
            </div>
            <div className="justify-center items-center text-center absolute top-[20%] w-[100%]">
              <span className="text-[1.7rem] tracking-[20pt] leading-[23px] font-bold font-['batang']">
                기일입찰표
              </span>
            </div>
            <div className="flex justify-between w-[100%] absolute bottom-[0px]">
              <div>
                <span className="pl-[3px] text-[12pt] leading-[-1px]  font-['batang']">
                  {totalResult && totalResult.reqCourtName + ' 집행관 귀하'}
                </span>
              </div>
              <div>
                <span className="text-[12pt] leading-[-1px]  font-['batang'] pr-[3px]">
                  입찰기일 :{' '}
                  {totalResult && totalResult?.biddingDate?.substring(0, 4)}년{' '}
                  {totalResult?.biddingDate?.substring(4, 6)}월{' '}
                  {totalResult?.biddingDate?.substring(6, 8)}일
                </span>
              </div>
            </div>
          </div>
          {/* 두 번째 박스 */}
          <div className="flex flex-row justify-between items-center border-black border-b-[1px] text-center h-[7%]">
            <div className="border-black border-r-[1px] w-[10%] h-[100%] text-center justify-center items-center">
              <span className="text-[12pt]  font-['batang']">사건번호</span>
            </div>
            <div className="flex justify-center items-center border-black border-r-[1px] w-[40%] text-center h-[100%]">
              <span className="text-[13pt]  font-['batang']">
                {totalResult &&
                  totalResult.caseYear +
                    ' 타경 ' +
                    totalResult.caseDetail +
                    '호'}
              </span>
            </div>
            <div className="border-black border-r-[1px] w-[10%] h-[100%] text-center justify-center items-center">
              <span className="text-[12pt]  font-['batang']">물건번호</span>
            </div>
            <div className="flex flex-col justify-center items-center text-center w-[40%]">
              <span className={`text-[12pt]  font-['batang']`}>
                {totalResult && totalResult?.mulNo ? totalResult?.mulNo : '1'}
              </span>
              <span className={`text-[9pt]  font-['batang']`}>
                ※ 물건번호가 여러개 있는 경우에는 꼭 기재
              </span>
            </div>
          </div>
          {/* 세 번째 박스 */}
          <div className="flex flex-row justify-between items-stretch border-black border-b-[1px] relative w-[100%] h-[50%]">
            <div className="flex justify-center items-center leading-[300%] border-black border-r-[1px] w-[5%]">
              <span className="text-[13pt]  font-['batang']">
                입<br />찰<br />자
              </span>
            </div>
            <div className="w-[97%] h-[100%]">
              <div className="flex flex-row items-stretch border-black border-b-[1px] w-[100%] h-[50%]">
                <div className="flex justify-center items-center border-black border-r-[1px] w-[10%]">
                  <span className="text-[13pt]  font-['batang']">본인</span>
                </div>
                <div className="flex flex-col w-[90%] h-[100%]">
                  <div className="flex flex-row items-stretc h-[30%]">
                    <div className="flex justify-center items-center border-black border-b-[1px] border-r-[1px] w-[20%]">
                      <span className="text-[13pt]  font-['batang']">
                        성&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;명
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row h-[30%]">
                    <div className="flex justify-center items-center text-center border-black border-b-[1px] border-r-[1px] w-[20%]">
                      <span className="text-[13pt]  font-['batang']">
                        주민(사업자)
                        <br />
                        등록번호
                      </span>
                    </div>
                    <div className="flex justify-center items-center w-[80%]">
                      <span className="text-[13pt]  font-['batang'] text-black-500">
                        별첨 목록과 같음
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row h-[40%]">
                    <div className="flex w-[20%] border-black border-r-[1px] h-[100%] justify-center items-center text-center leading-[-1px]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        주&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;소
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between items-stretch w-[100%] h-[50%]">
                <div className="flex justify-center items-center w-[10%] border-black border-r-[1px]">
                  <span className="text-[13pt]  font-['batang']">대리인</span>
                </div>
                <div className="w-[90%] h-[100%]">
                  <div className="flex flex-row items-stretch border-black border-b-[1px] w-[100%] h-[35%]">
                    <div className="flex justify-center items-center table__text w-[20%] border-black border-r-[1px]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        성&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;명
                      </span>
                    </div>
                    <div className="flex justify-center items-center w-[30%] border-black border-r-[1px]">
                      <div className="flex w-[60%] justify-end">
                        <span className="text-[13pt]  font-['batang'] text-center">
                          {biddingInfo.bidder === 'agent' &&
                          biddingInfo.agentName
                            ? biddingInfo.agentName
                            : ''}
                        </span>
                      </div>
                      <div className="flex w-[40%] justify-end mr-1">
                        <span className="text-[13pt]  font-['batang'] text-center">
                          (인)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center w-[20%] border-black border-r-[1px]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        본인과의
                        <br />
                        관&nbsp;&nbsp;&nbsp;&nbsp;계
                      </span>
                    </div>
                    <div className="flex justify-center items-center text-center w-[30%]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        {biddingInfo.bidder === 'agent' && biddingInfo.agentRel
                          ? biddingInfo.agentRel
                          : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-stretch border-black border-b-[1px] h-[35%]">
                    <div className="flex justify-center items-center w-[20%] border-black border-r-[1px]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        주민등록번호
                      </span>
                    </div>
                    <div className="flex justify-center items-center text-center w-[30%] border-black border-r-[1px]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        {biddingInfo.bidder === 'agent'
                          ? biddingInfo.agentIdNum.substring(0, 6) +
                            '-' +
                            biddingInfo.agentIdNum.substring(6, 14)
                          : ''}
                      </span>
                    </div>
                    <div className="flex justify-center items-center text-center w-[20%] border-black border-r-[1px]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        전화번호
                      </span>
                    </div>
                    <div className="flex justify-center items-center text-center w-[30%]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        {totalResult && totalResult?.agent !== null
                          ? totalResult?.agent?.phoneNo.length === 10
                            ? totalResult?.agent?.phoneNo.substring(0, 2) +
                              '-' +
                              totalResult?.agent?.phoneNo.substring(2, 6) +
                              '-' +
                              totalResult?.agent?.phoneNo.substring(6, 10)
                            : totalResult?.agent?.phoneNo.substring(0, 3) +
                              '-' +
                              totalResult?.agent?.phoneNo.substring(3, 7) +
                              '-' +
                              totalResult?.agent?.phoneNo.substring(7, 11)
                          : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-stretch h-[30%]">
                    <div className="flex justify-center items-center text-center border-black border-r-[1px] w-[20%]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        주&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;소
                      </span>
                    </div>
                    <div className="flex justify-center items-center text-center w-[80%]">
                      <span className="text-[13pt]  font-['batang'] text-center">
                        {totalResult && totalResult?.agent !== null
                          ? totalResult?.agent?.address
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 네 번째 박스 */}
          <div className="flex flex-row justify-between items-stretch w-[100%] border-black border-b-[1px] h-[15%]">
            <div className="w-[5%] border-black border-r-[1px] h-[100%] justify-center items-center text-center">
              <span className="text-[12pt]  font-['batang']">
                입찰
                <br />
                가격
              </span>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] border-black border-r-[1px] leading-[70%] border-b-[1px] text-center w-[100%]">
                <span className="text-[11pt]  font-['batang']">천억</span>
              </div>
              <div className="flex justify-center items-center w-[100%] h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 1) === '0'
                    ? ''
                    : totalResult &&
                      handlePrice &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(0, 1)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">백억</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 2) === '00'
                    ? ''
                    : totalResult &&
                      handlePrice &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(1, 2)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] border-black border-r-[1px] tracking-wide border-b-[1px]  leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">십억</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 3) === '000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(2, 3)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">억</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px] ">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 4) === '0000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(3, 4)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">천만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 5) === '00000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(4, 5)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">백만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 6) === '000000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(5, 6)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">십만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 7) === '0000000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(6, 7)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 8) === '00000000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(7, 8)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">천</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 9) === '000000000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(8, 9)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">백</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 10) === '0000000000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(9, 10)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">십</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 11) === '00000000000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(10, 11)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] leading-[70%] text-center">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">일</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  handlePrice(
                    totalResult?.bidPrice?.toString().length,
                  )?.substring(0, 12) === '000000000000'
                    ? ''
                    : totalResult &&
                      handlePrice(
                        totalResult?.bidPrice?.toString().length,
                      )?.substring(11, 12)}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[100%] w-[100%] border-black border-r-[2px] text-center justify-center items-center">
                <div className="h-[50%]">
                  <span className="text-[12pt]  font-['batang']">
                    <br />
                  </span>
                </div>
                <div className="">
                  <span className="text-[12pt]  font-['batang']">&nbsp;원</span>
                </div>
              </div>
            </div>
            <div className="w-[5%] border-black border-r-[1px] h-[100%] justify-center items-center text-center">
              <span className="text-[12pt]  font-['batang']">
                보증
                <br />
                금액
              </span>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">천억</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                  totalResult?.bidDeposit?.toString().length === 12
                    ? totalResult?.bidDeposit?.toString()?.substring(0, 1)
                    : ''}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">백억</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 2) === '00'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(1, 2))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">십억</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 3) === '000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(2, 3))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">억</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 4) === '0000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(3, 4))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">천만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 5) === '00000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(4, 5))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">백만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 6) === '000000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(5, 6))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">십만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 7) === '0000000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(6, 7))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">만</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 8) === '00000000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(7, 8))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">천</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 9) === '000000000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(8, 9))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">백</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 10) === '0000000000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(9, 10))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">십</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 11) === '00000000000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(10, 11))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[45%] w-[100%] border-black border-r-[1px] border-b-[1px] text-center leading-[70%]">
                <span className="text-[11pt]  font-['batang']">
                  <br />
                </span>
                <span className="text-[11pt]  font-['batang']">일</span>
              </div>
              <div className="flex justify-center items-center h-[55%] border-black border-[2px]">
                <span className="text-[11pt]  font-['batang']">
                  {totalResult &&
                    (handleDepositPrice(
                      totalResult?.bidDeposit?.toString().length,
                    )?.substring(0, 12) === '000000000000'
                      ? ''
                      : totalResult &&
                        handleDepositPrice(
                          totalResult?.bidDeposit?.toString().length,
                        )?.substring(11, 12))}
                </span>
              </div>
            </div>
            <div className="w-[3.46%] h-[100%]">
              <div className="h-[100%] w-[100%] border-black text-center justify-center items-center">
                <div className="h-[50%]">
                  <span className="text-[12pt]  font-['batang']">
                    <br />
                  </span>
                </div>
                <div className="">
                  <span className="text-[12pt]  font-['batang']">&nbsp;원</span>
                </div>
              </div>
            </div>
          </div>
          {/* 다섯 번째 박스 */}
          <div className="flex flex-row justify-between items-stretch w-[100%] h-[13%]">
            <div className="flex flex-row w-[49.9%] border-black border-r-[2px] h-[100%]">
              <div className="flex items-center justify-start w-[30%] h-[100%] ml-[10px]">
                <span className="text-[13pt] text-left  font-['batang']">
                  보증의
                  <br />
                  제공방법
                </span>
              </div>
              <div className="flex flex-col justify-center w-[70%] h-[100%]">
                <div className="flex flex-row w-[100%]">
                  <input
                    type="checkbox"
                    checked={biddingInfo.bidWay === 'M' ? true : false}
                    className="w-[15px] h-[15px] border-black border-[2px] mr-1 mt-2 indeterminate:bg-white"
                    readOnly
                  />
                  <span className="text-[13pt]  font-['batang'] mt-1">
                    현금·자기앞수표
                  </span>
                </div>
                <div className="flex flex-row w-[100%]">
                  <input
                    type="checkbox"
                    checked={biddingInfo.bidWay === 'W' ? true : false}
                    className="w-[15px] h-[15px] border-black border-[2px] mr-1 mt-2 indeterminate:bg-white"
                    readOnly
                  />
                  <span className="text-[13pt]  font-['batang'] mt-1">
                    보증서
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-around items-stretch w-[50%] h-[100%]">
              <div className="flex justify-start">
                <span className="text-[13pt] text-left  font-['batang'] ml-[10px]">
                  보증을 반환 받았습니다.
                </span>
              </div>
              <div className="flex justify-end">
                <div className="flex justify-between w-[70%] items-center">
                  <span className="text-[13pt]  font-['batang'] text-center">
                    입찰자{' '}
                  </span>
                  <span className="text-[13pt]  font-['batang'] text-center">
                    {totalResult && totalResult.agent !== null
                      ? totalResult && totalResult?.agent?.name
                      : totalResult && totalResult.bidders[0].name}
                  </span>
                  <span className="text-[13pt]  font-['batang'] mr-[10px]">
                    (인)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <IpcahlTextPDF />
      </div>
      <CoIpchalFormPDF totalResult={totalResult} />
      {totalResult && totalResult?.bidders.length > 10 ? (
        handleCoIpchalReturnList().map((item: any, index: number) => (
          <CoIpchalListPDF totalResult={totalResult} item={item} key={index} />
        ))
      ) : (
        <CoIpchalListPDF totalResult={totalResult} />
      )}
      {totalResult &&
        totalResult.agentYn === 'Y' &&
        (totalResult && totalResult.bidders.length > 3 ? (
          handleReturnList().map((item: any, index: number) => (
            <AgentListFormPDF
              totalResult={totalResult}
              bidders={item}
              key={index}
            />
          ))
        ) : (
          <AgentListFormPDF totalResult={totalResult} />
        ))}
    </>
  )
}

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import AgentListForm from '@/components/bidForm/coIpchalContent/AgentListForm'
import CoIpchalResult from '@/components/bidForm/coIpchalContent/CoIpchalResult'
import { biddingInfoState, stepState } from '@/store/atom/bidForm'
import { TotalResultType } from '@/models/IpchalType'
import LoadingResult from '@/components/bidForm/LoadingResult'
import SingleIpchalResult from '@/components/bidForm/singleIpchalContent/SingleIpchalResult'
import Button from '@/components/bidForm/shared/Button'

export default function IpchalResult() {
  const [biddingInfo, setBiddingInfo] = useRecoilState(biddingInfoState)
  const [stateNum, setStateNum] = useRecoilState(stepState)

  const [totalResult, setTotalResult] = useState<TotalResultType>()
  const [loading, setLoading] = useState<boolean>(false)
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
    setLoading(true)
    const handleGetResult = async () => {
      try {
        const response = await axios.get(
          `/ggi/api/bid-form/${biddingInfo.mstSeq}`,
        )
        if (response.data.success === true) {
          setBiddingInfo({
            ...biddingInfo,
            reqCourtName: response.data.data.reqCourtName,
            bidIdNum1: biddingInfo.bidIdNum.map((item) =>
              item !== '' ? item?.substring(0, 6) : '',
            ),
            bidIdNum2: biddingInfo.bidIdNum.map((item) =>
              item !== '' ? item?.substring(6, 13) : '',
            ),
          })
          setTotalResult(response.data.data)
        } else if (response.data.success === false) {
          const confirm =
            window &&
            window.confirm(
              '입찰표 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
            )
          if (confirm) {
            window && window.close()
          } else {
            window && window.close()
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    handleGetResult()
  }, [])

  return (
    <>
      {loading && (
        <div className="flex flex-col bg-white h-screen w-[100%] relative justify-center items-center">
          <LoadingResult />
        </div>
      )}
      {!loading && totalResult && totalResult.bidders.length === 1 && (
        <SingleIpchalResult totalResult={totalResult} />
      )}
      {!loading && totalResult && totalResult.bidders.length > 1 && (
        <CoIpchalResult />
      )}
      {!loading &&
        totalResult &&
        totalResult.agentYn === 'Y' &&
        (totalResult && totalResult.bidders.length > 3 ? (
          handleReturnList().map((item: any, index: number) => (
            <AgentListForm
              totalResult={totalResult}
              bidders={item}
              key={index}
            />
          ))
        ) : (
          <AgentListForm totalResult={totalResult} />
        ))}
      {/* 버튼 */}
      <div className="flex justify-center items-center w-[100%] h-[100%] bg-white">
        <Button
          nextText="확인했습니다"
          handleNextStep={() => setStateNum(stateNum + 1)}
          handlePrevStep={() => setStateNum(stateNum - 1)}
          bottom="10px"
        />
      </div>
    </>
  )
}

import Spinner from '@/components/bidForm/Spinner'
import Button from '@/components/bidForm/shared/Button'
import { biddingInfoState, stepState } from '@/store/atom/bidForm'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

export default function GetIpchalInfo({ mstSeq }: { mstSeq: string | null }) {
  const [stateNum, setStateNum] = useRecoilState(stepState)
  const [biddingInfo, setBiddingInfo] = useRecoilState(biddingInfoState)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, getData] = useState<any>([])
  const router = useRouter()
  const { idcode } = router.query
  const [info, setInfo] = useState({
    infoId: '',
    caseNo: '',
    mulSeq: '',
  })

  useEffect(() => {
    const handleGetInfo = async () => {
      if (mstSeq) {
        try {
          const response = await axios.get(`/ggi/api/bid-form/${mstSeq}/checks`)
          if (response.data.success) {
            setInfo({
              infoId: response.data.data.infoId,
              caseNo: response.data.data.caseNo,
              mulSeq: response.data.data.mulSeq,
            })
            getData(response.data.data)
          } else if (response.data.success === false) {
            alert('사건 정보가 잘못되었습니다. 다시 시도해주세요.')
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        handleGetCaseCheck(
          biddingInfo.infoId,
          biddingInfo.caseNo,
          biddingInfo.mulSeq,
        )
      }
    }
    handleGetInfo()
  }, [])
  useEffect(() => {
    const handleGetInfo = async () => {
      if (
        biddingInfo.mstSeq > 0 &&
        biddingInfo.infoId != '' &&
        biddingInfo.caseNo != '' &&
        biddingInfo.mulSeq != ''
      ) {
        try {
          const response = await axios.get(
            `/ggi/api/bid-form/${biddingInfo.mstSeq}/checks`,
          )
          if (response.data.success) {
            setInfo({
              infoId: response.data.data.infoId,
              caseNo: response.data.data.caseNo,
              mulSeq: response.data.data.mulSeq,
            })
            getData(response.data.data)
          } else if (response.data.success === false) {
            alert('사건 정보가 잘못되었습니다. 다시 시도해주세요.')
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    handleGetInfo()
  }, [])

  const handleReset = () => {
    setBiddingInfo((prev) => {
      const temp1 = ['']
      const temp2 = ['']
      const temp3 = ['']
      const temp4 = ['']
      const temp5 = ['']
      const temp6 = ['']
      const temp7 = ['']
      const temp8 = ['']
      const temp9 = ['']
      const temp10 = ['']
      const temp11 = ['']
      const temp12 = ['']
      const temp13 = ['']
      const temp14 = ['']
      const temp15 = ['']
      const temp16 = ['']
      const temp17 = ['']
      const temp18 = ['']
      const temp19 = ['']
      const temp20 = ['']
      const temp21 = ['']
      return {
        ...prev,
        mstSeq: 0,
        state: 0,
        bidder: '',
        bidderNum: 0,
        biddingPrice: 0,
        depositPrice: 0,
        bidWay: '',
        bidCorpYn: temp1,
        bidName: temp2,
        bidPhone1: temp3,
        bidPhone2: temp4,
        bidPhone3: temp5,
        bidPhone: temp6,
        bidIdNum1: temp7,
        bidIdNum2: temp8,
        bidIdNum: temp9,
        bidAddr: temp10,
        bidAddrDetail: temp11,
        bidCorpNum1: temp12,
        bidCorpNum2: temp13,
        bidCorpNum3: temp14,
        bidCorpNum: temp15,
        bidCorpRegiNum1: temp16,
        bidCorpRegiNum2: temp17,
        bidCorpRegiNum: temp18,
        bidJob: temp19,
        agentYn: '',
        agentName: '',
        agentPhone1: '',
        agentPhone2: '',
        agentPhone3: '',
        agentPhone: '',
        agentIdNum1: '',
        agentIdNum2: '',
        agentIdNum: '',
        agentAddr: '',
        agentAddrDetail: '',
        agentJob: '',
        agentRel: '',
        pdfFile: new Blob(),
        bidders: [],
        imageFile: '',
        isModalOpen: false,
        shareWay: 'S',
        numerator: temp20,
        denominator: temp21,
        mandates: [
          {
            peopleSeq: 0,
            name: '',
            mandateYn: '',
          },
        ],
        pdfPassword: '',
        fileName: '',
      }
    })
  }

  const handleConfirm = async () => {
    setLoading(true)
    if (biddingInfo.mstSeq !== 0) {
      if (
        info.infoId === biddingInfo.infoId &&
        info.caseNo === biddingInfo.caseNo &&
        info.mulSeq === biddingInfo.mulSeq
      ) {
        setStateNum(stateNum + 2)
      } else {
        if (
          window &&
          window.confirm(
            '사건번호가 달라지면 입찰 정보가 초기화됩니다. 진행하시겠습니까?',
          )
        ) {
          handleReset()
          try {
            const response = await axios.post(
              `/ggi/api/bid-form/inits`,
              {
                infoId: biddingInfo.infoId,
                caseNo: biddingInfo.caseNo,
                mulSeq: biddingInfo.mulSeq,
                biddingDate: biddingInfo.biddingDate,
                biddingTime: biddingInfo.biddingInfos[0].biddingTime,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
            if (response.data.success) {
              setBiddingInfo((prev) => {
                return {
                  ...prev,
                  mstSeq: response.data.data.mstSeq,
                  state: response.data.data.state,
                  selectedTime: biddingInfo.biddingInfos[0].biddingTime,
                }
              })
              if (biddingInfo.biddingInfos.length > 1) {
                setTimeout(() => {
                  setStateNum(stateNum + 1)
                  setLoading(false)
                }, 1000)
              } else {
                setTimeout(() => {
                  setStateNum(stateNum + 2)
                  setLoading(false)
                }, 1000)
              }
            }
          } catch (error) {
            console.log(error)
            setLoading(false)
          }
        } else {
          setLoading(false)
          return null
        }
      }
    } else {
      try {
        const response = await axios.post(
          `/ggi/api/bid-form/inits`,
          {
            infoId: biddingInfo.infoId,
            caseNo: biddingInfo.caseNo,
            mulSeq: biddingInfo.mulSeq,
            biddingDate: biddingInfo.biddingDate,
            biddingTime: biddingInfo.biddingInfos[0].biddingTime,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        if (response.data.success) {
          setBiddingInfo((prev) => {
            return {
              ...prev,
              mstSeq: response.data.data.mstSeq,
              state: response.data.data.state,
              selectedTime: biddingInfo.biddingInfos[0].biddingTime,
            }
          })
          if (biddingInfo.biddingInfos.length > 1) {
            setTimeout(() => {
              setStateNum(stateNum + 1)
              setLoading(false)
            }, 1000)
          } else {
            setTimeout(() => {
              setStateNum(stateNum + 2)
              setLoading(false)
            }, 1000)
          }
        } else if (response.data.success === false) {
          alert('오류가 발생했습니다. 다시 시도해주세요.')
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
  }

  const handlePrevStep = () => {
    if (idcode) {
      setStateNum(0)
    } else {
      setStateNum(stateNum - 1)
      setBiddingInfo({
        ...biddingInfo,
        searchResultState: 2,
      })
    }
  }

  const handleNextStep = async () => {
    setLoading(true)
    if (biddingInfo.mstSeq === 0) {
      await handleConfirm()
    } else {
      if (biddingInfo.biddingInfos.length > 1) {
        setTimeout(() => {
          setStateNum(stateNum + 1)
          setLoading(false)
        }, 1000)
      } else {
        handleConfirm()
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }
  }

  const handleHeight = () => {
    let height = window.innerHeight
    if (document && document.getElementById('box')) {
      const boxElement = document.getElementById('box')
      if (boxElement) {
        boxElement.style.height = height + 'px'
      }
    }
  }

  const handleGetCaseCheck = async (
    infoId: string,
    caseNo: string,
    mulSeq: string,
  ) => {
    setLoading(true)
    try {
      const response = await axios.post(
        `/ggi/api/bid-form/cases/checks`,
        {
          infoId: infoId,
          caseNo: caseNo,
          mulSeq: mulSeq,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      if (response.status === 200) {
        getData(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    handleHeight()
    window.addEventListener('resize', handleHeight)
    return () => {
      window.removeEventListener('resize', handleHeight)
    }
  }, [])

  return (
    <>
      <div id="box" className="flex w-[100%] justify-center bg-white relative">
        {loading && <Spinner />}
        <div className="flex flex-col w-[100%] bg-mybg items-center text-center md:py-[0px] py-[15px] relative">
          <div className="flex flex-col md:gap-[14px] gap-[6px] pt-[50px]">
            <span className="md:text-[32.5px] text-[20px] leading-[135%] tracking-[-1%] font-bold font-['suit'] not-italic">
              상세 내역을 확인해주세요
            </span>
            <span className="md:text-[18px] text-[16px] leading-[135%] tracking-[-1%] font-normal font-['suit'] not-italic text-sutTitle">
              선택한 경매 사건이 맞는지 체크합니다
            </span>
          </div>
          <div
            className={`flex flex-col md:w-[500px] h-[500px] w-[90%] overflow-y-auto md:gap-[7.5px] gap-[5px] bg-mybg `}
          >
            <div className="flex flex-col relative h-[80px] items-start justify-start bg-white mt-[30px] pt-[16px] pb-[16px] pl-[35px] pr-[35px] gap-[2.5px]">
              <span
                className="font-['suit'] font-medium md:text-[17px] text-[15px] leading-[130%] tracking-[0%]"
                style={{
                  color: '#545492',
                }}
              >
                법원
              </span>
              <span
                className="text-black md:text-[20px] text-[16px] font-normal font-['suit'] leading-[135%] tracking-[-1%]"
                style={{
                  color: '#181826',
                }}
              >
                {biddingInfo.courtFullName}
              </span>
            </div>
            <div className="flex justify-between bg-white pt-[16px] pb-[16px] pl-[35px] pr-[35px] h-[80px]">
              <div className="flex flex-col relative justify-start items-start w-[80%] gap-[2.5px]">
                <span
                  className="text-sutTitle font-['suit'] font-medium md:text-[17px] text-[15px] leading-[130%] tracking-[0%]"
                  style={{
                    color: '#545492',
                  }}
                >
                  사건번호
                </span>
                <span
                  className="text-black md:text-[20px] text-[16px] font-normal font-['suit'] leading-[135%] tracking-[-1%]"
                  style={{
                    color: '#181826',
                  }}
                >
                  {biddingInfo.sagunNum + '호'}
                </span>
              </div>
              <div className="flex flex-col relative justify-start items-start w-[20%] gap-[2.5px]">
                <span
                  className="text-sutTitle font-['suit'] font-medium md:text-[17px] text-[15px] leading-[130%] tracking-[0%]"
                  style={{
                    color: '#545492',
                  }}
                >
                  물건번호
                </span>
                <span
                  className="text-black md:text-[20px] text-[16px] font-normal font-['suit'] leading-[135%] tracking-[-1%]"
                  style={{
                    color: '#181826',
                  }}
                >
                  {biddingInfo.mulNo}
                </span>
              </div>
            </div>
            <div className="flex justify-between bg-white h-[80px] p-[20px] pt-[16px] pb-[16px] pl-[35px] pr-[35px]">
              <div className="flex flex-col relative justify-start items-start w-[80%] gap-[2.5px]">
                <span
                  className="text-sutTitle font-['suit'] font-medium md:text-[17px] text-[15px] leading-[130%] tracking-[0%]"
                  style={{
                    color: '#545492',
                  }}
                >
                  입찰기일
                </span>
                <span
                  className="text-black md:text-[20px] text-[16px] font-normal font-['suit'] leading-[135%] tracking-[-1%]"
                  style={{
                    color: '#181826',
                  }}
                >
                  {biddingInfo.ipchalDate}
                </span>
              </div>
              <div className="flex flex-col relative justify-center items-start w-[20%] gap-[2.5px]">
                <span className="text-sutTitle font-['suit'] md:text-[0.9rem] text-[0.8rem] font-bold">
                  {' '}
                </span>
                <span
                  className="text-black md:text-[20px] text-[16px] font-normal font-['suit'] leading-[135%] tracking-[-1%]"
                  style={{
                    color: '#181826',
                  }}
                >
                  {data.dayDay}
                </span>
              </div>
            </div>
            {biddingInfo.usage === ('차량' || '중기') ? (
              <div className="flex flex-col relative h-[80px] items-start justify-start bg-white p-[20px] pt-[16px] pb-[16px] pl-[35px] pr-[35px] gap-[2.5px]">
                <span
                  className="text-sutTitle font-['suit'] font-medium md:text-[17px] text-[15px] leading-[130%] tracking-[0%]"
                  style={{
                    color: '#545492',
                  }}
                >
                  차량정보
                </span>
                <span
                  className="text-black md:text-[20px] text-[16px] font-normal font-['suit'] leading-[135%] tracking-[-1%] text-left"
                  style={{
                    color: '#181826',
                  }}
                >
                  {data.carInfo}
                </span>
              </div>
            ) : null}
            <div className="flex flex-col relative items-start justify-center bg-white pt-[16px] pb-[16px] pl-[35px] pr-[35px] gap-[2.5px]">
              <span
                className="text-sutTitle font-['suit'] font-medium md:text-[17px] text-[15px] leading-[130%] tracking-[0%]"
                style={{
                  color: '#545492',
                }}
              >
                물건지 주소
              </span>
              <span
                className="text-black md:text-[20px] text-[16px] font-normal font-['suit'] leading-[135%] tracking-[-1%] text-left"
                style={{
                  color: '#181826',
                }}
              >
                {biddingInfo.sagunAddr +
                  (biddingInfo.etcAddress !== ''
                    ? '[일괄]' + biddingInfo.etcAddress
                    : '')}
              </span>
              <span className="text-myBlue md:text-[18px] text-[16px] text-left font-normal leading-[135%] tracking-[-1%] font-['suit'] ">
                {biddingInfo.roadAddress}
              </span>
            </div>
          </div>
        </div>
        <Button
          nextText="다음으로"
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
        />
      </div>
    </>
  )
}

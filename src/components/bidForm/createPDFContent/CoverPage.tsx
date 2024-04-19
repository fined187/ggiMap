import { TotalResultType } from '@/models/IpchalType'
import { biddingInfoState, stepState } from '@/store/atom/bidForm'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

interface SingleProps {
  totalResult: TotalResultType
}

export default function CoverPage({ totalResult }: SingleProps) {
  const [biddingInfo, setBiddingInfo] = useRecoilState(biddingInfoState)
  const [stateNum, setStateNum] = useRecoilState(stepState)
  const [list, setList] = useState<any>({
    topBox: [''],
    middleBox: [''],
    bottomBox: [''],
  })
  const handlePreparingMsg = () => {
    if (
      biddingInfo.bidName.length === 1 &&
      biddingInfo.agentName === '' &&
      biddingInfo.bidCorpYn[0] === 'I'
    ) {
      //  개인 입찰자 1인
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.bidName.map((item: string) => item),
        middleBox: ['신분증', '도장'],
        bottomBox: ['매수신청 보증금'],
      }))
    } else if (
      biddingInfo.bidName.length === 1 &&
      biddingInfo.agentName === '' &&
      biddingInfo.bidCorpYn[0] === 'C'
    ) {
      // 법인 입찰자 1인
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.bidName.map((item: string) => item),
        middleBox: ['대표이사 신분증', '대표이사 도장'],
        bottomBox: ['매수신청 보증금', '법인등기부'],
      }))
    } else if (
      biddingInfo.bidName.length > 1 &&
      biddingInfo.agentName === '' &&
      !biddingInfo.bidCorpYn.includes('C')
    ) {
      //  2인 이상 공동입찰자
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.bidName.map((item: string) => item),
        middleBox: ['신분증', '도장'],
        bottomBox: [
          '매수신청 보증금',
          '불참자의 인감이 날인된 위임장',
          '불참자 인감증명서',
        ],
      }))
    } else if (
      biddingInfo.bidName.length > 1 &&
      biddingInfo.agentName === '' &&
      !biddingInfo.bidCorpYn.includes('I')
    ) {
      // 2인 이상 법인 공동입찰자
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.bidName.map((item: string) => item),
        middleBox: ['대표이사 신분증', '대표이사 도장'],
        bottomBox: [
          '매수신청 보증금',
          '법인등기부',
          '불참법인 인감이 날인된 위임장',
          '불참법인 인감증명서',
        ],
      }))
    } else if (
      biddingInfo.bidName.length > 1 &&
      biddingInfo.agentName === '' &&
      biddingInfo.bidCorpYn.includes('I') &&
      biddingInfo.bidCorpYn.includes('C')
    ) {
      //  2인 이상 개인, 법인 공동입찰자
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.bidName.map((item: string) => item),
        middleBox: ['신분증', '도장', '대표이사 신분증', '대표이사 도장'],
        bottomBox: [
          '매수신청 보증금',
          '법인등기부',
          '불참자의 인감이 날인된 위임장',
          '불참법인 인감이 날인된 위임장',
          '불참법인 등기부',
          '불참자 인감증명서',
          '불참법인 인감증명서',
        ],
      }))
    } else if (
      biddingInfo.bidName.length === 1 &&
      biddingInfo.agentName !== '' &&
      biddingInfo.bidCorpYn[0] === 'I'
    ) {
      //  대리인 + 개인입찰자 1인
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.agentName,
        middleBox: ['대리인 도장', '대리인 신분증'],
        bottomBox: [
          '매수신청 보증금',
          '본인의 인감이 날인된 위임장',
          '본인의 인감증명서',
        ],
      }))
    } else if (
      biddingInfo.bidName.length === 1 &&
      biddingInfo.agentName !== '' &&
      biddingInfo.bidCorpYn[0] === 'C'
    ) {
      //  대리인 + 법인입찰자 1인
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.agentName,
        middleBox: ['대리인 도장', '대리인 신분증'],
        bottomBox: [
          '매수신청 보증금',
          '법인의 인감이 날인된 위임장',
          '법인 등기부',
          '법인의 인감증명서',
        ],
      }))
    } else if (
      biddingInfo.bidName.length > 1 &&
      biddingInfo.agentName !== '' &&
      !biddingInfo.bidCorpYn.includes('C')
    ) {
      //  대리인 + 2인 이상 공동입찰자(개인)
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.agentName,
        middleBox: ['대리인 도장', '대리인 신분증'],
        bottomBox: [
          '매수신청 보증금',
          '본인의 인감이 날인된 위임장',
          '본인의 인감증명서',
        ],
      }))
    } else if (
      biddingInfo.bidName.length > 1 &&
      biddingInfo.agentName !== '' &&
      !biddingInfo.bidCorpYn.includes('I')
    ) {
      //  대리인 + 2인 이상 공동입찰자(법인)
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.agentName,
        middleBox: ['대리인 도장', '대리인 신분증'],
        bottomBox: [
          '매수신청 보증금',
          '법인의 인감이 날인된 위임장',
          '법인 등기부',
          '법인의 인감증명서',
        ],
      }))
    } else if (
      biddingInfo.bidName.length > 1 &&
      biddingInfo.agentName !== '' &&
      biddingInfo.bidCorpYn.includes('I') &&
      biddingInfo.bidCorpYn.includes('C')
    ) {
      //  대리인 + 2인 이상 공동입찰자(개인, 법인)
      setList((prev: any) => ({
        ...prev,
        topBox: biddingInfo.agentName,
        middleBox: ['대리인 도장', '대리인 신분증'],
        bottomBox: [
          '매수신청 보증금',
          '본인의 인감이 날인된 위임장',
          '법인 등기부',
          '법인의 인감이 날인된 위임장',
          '본인의 인감증명서',
          '법인의 인감증명서',
        ],
      }))
    }
  }

  useEffect(() => {
    handlePreparingMsg()
  }, [])

  return (
    <div className="flex flex-col bg-white h-[1300px] md:w-[800px] w-[700px] mx-auto justify-center items-center relative top-[0px]">
      <div className="flex absolute top-[150px] text-center">
        <span className="font-['nanum'] text-[20pt] font-bold">
          {totalResult &&
            totalResult?.courtFullName +
              ' ' +
              totalResult?.caseYear +
              ' - ' +
              totalResult?.caseDetail +
              '[' +
              (totalResult?.mulNo === '' ? '1' : totalResult?.mulNo) +
              ']' +
              ' ' +
              totalResult?.usage}
          <br />
          기일입찰표
        </span>
      </div>
      <div className="flex flex-col absolute top-[500px] w-[350px] justify-start">
        <span className="text-left font-semibold text-[18pt]">
          입찰기일 :{' '}
          {totalResult && totalResult?.biddingDate?.length === 8
            ? totalResult?.biddingDate?.substring(0, 4) +
              '년 ' +
              totalResult?.biddingDate?.substring(4, 6) +
              '월' +
              totalResult?.biddingDate?.substring(6, 8) +
              '일'
            : totalResult?.biddingDate}
        </span>
        <span className="text-left font-semibold text-[18pt]">
          입찰법원 : {totalResult && totalResult?.reqCourtName}
        </span>
      </div>
      <div className="flex flex-col w-[95%] h-[400px] gap-[10px] absolute top-[700px]">
        <span className="font-['suit'] font-bold text-[27.5px] text-left leading-[135%] tracking-[-1%]">
          준비서류
        </span>
        <div className="flex justify-between w-[100%] h-[300px] items-center border border-black rounded-xl p-[20px] ">
          <div className="flex flex-row w-[40%] h-[100%] border-r border-r-black">
            <div className="flex w-[20%] items-start justify-start">
              <span className="font-['suit'] font-bold leading-[135%] tracking-[-1%] text-[20px]">
                기본
              </span>
            </div>
            <div className="flex flex-col items-start justify-start gap-[5px]">
              {list?.middleBox?.map((item: string, index: number) => (
                <span
                  key={index}
                  className="font-semibold text-[20px] font-['suit'] leading-[135%] tracking-[-1%]"
                >
                  {index + 1 + '. ' + item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-row w-[60%] h-[100%] ml-[20px]">
            <div className="flex w-[15%] items-start justify-start">
              <span className="font-['suit'] font-bold leading-[135%] tracking-[-1%] text-[20px]">
                추가
              </span>
            </div>
            <div className="flex flex-col w-[85%] gap-[5px]">
              {list.bottomBox.map((item: string, index: number) => (
                <li
                  key={index}
                  style={{
                    listStyle: 'none',
                    justifyContent: 'space-between',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'start',
                  }}
                >
                  <span className="md:text-[20px] leading-[135%] tracking-[-1%] text-[16px] font-['suit'] text-black font-semibold text-left">
                    {index + 1 + '. ' + item}
                  </span>
                  <span className="md:text-[20px] leading-[135%] tracking-[-1%] text-[16px] font-['suit'] text-black font-semibold text-left">
                    {index === 0
                      ? biddingInfo.depositPrice.toLocaleString('ko-KR') + '원'
                      : '1부'}
                  </span>
                </li>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[100%] h-[150px] justify-center items-start border border-black rounded-xl p-[15px]">
          <span className="font-semibold text-[12pt] ">
            - 입찰표는 대법원 표준서식에 따라 만들어졌으나 전산착오 및 오타
            등으로 부정확하게 출력될 수 있으므로 제출 전 사건번호, 물건번호,
            입찰기일, 입찰보증금 등은 반드시 확인하시기 바랍니다.
          </span>
          <span className="font-semibold text-[12pt] ">
            - 표지는 제출 시 제거하여 주시기 바랍니다.
          </span>
        </div>
      </div>
      <div className="flex absolute top-[1175px]">
        <svg
          width="90"
          height="80"
          viewBox="0 0 120 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect width="110" height="100" fill="url(#pattern0)" />
          <defs>
            <pattern
              id="pattern0"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                xlinkHref="#image0_159_755"
                transform="matrix(0.00226425 0 0 0.00247919 -0.346845 -0.326316)"
              />
            </pattern>
            <image
              id="image0_159_755"
              width="765"
              height="675"
              xlinkHref="data:image/png;base64,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"
            />
          </defs>
        </svg>
      </div>
    </div>
  )
}

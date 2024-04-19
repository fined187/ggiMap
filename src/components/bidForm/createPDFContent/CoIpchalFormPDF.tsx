import { TotalResultType } from '@/models/IpchalType'

interface CoIpchalFormProps {
  totalResult?: TotalResultType
}

export default function CoIpchalFormPDF({ totalResult }: CoIpchalFormProps) {
  return (
    <div
      className="flex flex-col bg-white w-[800px] m-auto relative scrollbar-hide"
      style={{
        height: '1300px',
      }}
    >
      <div
        className="flex flex-col bg-white h-[100%] w-[100%] m-auto relative justify-center items-center"
        style={{
          marginTop: '60px',
        }}
      >
        <div className="flex flex-col w-[100%] h-[100%] justify-center items-center">
          <div className="text-[18pt] py-[60px] leading-[23px] font-['batang'] absolute top-0">
            공 동 입 찰 신 고 서
          </div>
          <div className="flex justify-end text-right w-[100%] absolute top-[200px] mr-2">
            <span className="text-[13pt]  font-['batang']">
              {totalResult && totalResult?.reqCourtName + ' 집행관 귀하'}
            </span>
          </div>
          <div className="flex flex-col gap-[10px] justify-start w-[100%] ml-2 absolute top-[350px]">
            <div className="flex flex-row w-[100%] gap-[150px] ">
              <span className="text-[13pt] font-bold  font-['batang']">
                사건번호
              </span>
              <div className="flex flex-row gap-3">
                <span className="text-[13pt] text-black-500  font-['batang']">
                  {totalResult && totalResult?.caseYear}
                </span>
                <span className="text-[13pt] text-black  font-['batang']">
                  {' 타경 '}
                </span>
                <span className="text-[13pt] text-black-500  font-['batang']">
                  {totalResult && totalResult?.caseDetail}
                </span>
                <span className="text-[13pt]  font-['batang'] text-black">
                  {'호'}
                </span>
              </div>
            </div>
            <div className="flex flex-row w-[100%] gap-[150px] ">
              <span className="text-[13pt] font-bold font-['batang']">
                물건번호
              </span>
              <span className="text-[13pt] text-black-500  font-['batang']">
                {totalResult && totalResult?.mulNo === ''
                  ? '1'
                  : totalResult?.mulNo}
              </span>
            </div>
            <div className="flex flex-row w-[100%] gap-[135px] ">
              <span className="text-[13pt] font-bold font-['batang']">
                공동입찰자
              </span>
              <span className="text-[13pt] text-black font-['batang']">
                별지목록과 같음
              </span>
            </div>
            <div className="flex mt-10">
              <span className="text-[13pt]  font-['batang']">
                위 사건에 관하여 공동입찰을 신고합니다.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-[30px] justify-center items-center w-[100%] absolute top-[600px]">
            <span className="text-[13pt]  font-['batang']">
              {totalResult &&
                totalResult?.biddingDate.substring(0, 4) +
                  ' 년 ' +
                  totalResult?.biddingDate.substring(4, 6) +
                  ' 월 ' +
                  totalResult?.biddingDate.substring(6, 8) +
                  ' 일'}
            </span>
            <div className="flex flex-row justify-center items-center gap-[10px] w-[100%]">
              <span className="text-[13pt]  font-['batang']">신청인</span>
              <span className="text-[13pt]  font-['batang'] text-black-500">
                {totalResult && totalResult?.bidders[0]?.name}
              </span>
              <span className="text-[13pt]  font-['batang']">외</span>
              <span className="text-[13pt]  font-['batang'] text-black-500">
                {totalResult && totalResult?.bidders.length - 1}
              </span>
              <span className="text-[13pt]  font-['batang']">
                {' 인(별지목록 기재와 같음)'}
              </span>
            </div>
          </div>
          <div className="flex absolute top-[800px]">
            <div>
              <span className="text-[13pt]  font-['batang']">
                ※ 1. 공동입찰을 하는 때에는{' '}
                <span className="text-[13pt] underline underline-offset-1">
                  입찰표에 각자의 지분을 분명하게 표시하여야 합니다.
                </span>
                <br />
                &nbsp;&nbsp; 2. 별지 공동입찰자 목록과 사이에{' '}
                <span className="text-[13pt] underline underline-offset-1">
                  공동입찰자 전원이 간인하십시오.
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

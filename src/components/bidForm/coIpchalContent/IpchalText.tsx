export default function IpchalText() {
  return (
    <div className="flex flex-col w-[100%] absolute md:top-[750px] top-[720px] leading-5 justify-center items-center">
      <div className="flex flex-col md:w-[800px] w-[90%] text-left items-start justify-start gap-2">
        <span className="md:text-[15pt] text-[14px] font-extrabold font-batang ">
          주의사항
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          1. 입찰표는 물건마다 별도의 용지를 사용하십시오, 다만, 일괄입찰시에는
          1매의 용지를 사용하십시오.
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          2. 한 사건에서 입찰물건이 여러개 있고 그 물건들이 개별적으로 입찰에
          부쳐진 경우에는 사건번호외에 물건번호를 기재하십시오.
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          3. 입찰자가 법인인 경우에는 본인의 성명란에 법인의 명칭과 대표자의
          지위 및 성명을, 주민등록란에는 입찰자가 개인인 경우에는
          주민등록번호를, 법인인 경우에는 사업자등록번호를 기재하고, 대표자의
          자격을 증명하는 서면(법인의 등기부 등, 초본)을 제출하여야 합니다.
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          4. 주소는 주민등록상의 주소를, 법인은 등기부상의 본점소재지를
          기재하시고, 신분확인상 필요하오니 주민등록증을 꼭 지참하십시오.
        </span>
        <span className="md:text-[12pt] text-[12px] font-batang font-extrabold underline">
          5. 입찰가격은 수정할 수 없으므로, 수정을 요하는 때에는 새 용지를
          사용하십시오.
        </span>
        <p className="md:text-[12pt] text-[11px] text-left font-batang">
          6. 대리인이 입찰하는 때에는 입찰자란에 본인과 대리인의 인적사항 및
          본인과의 관계 등을 모두 기재하는 외에 본인의{' '}
          <span className="md:text-[12pt] text-[11px] underline underline-offset-1">
            위임장(입찰표 뒷면을 사용)
          </span>
          과 인감증명을 제출하십시오.
        </p>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          7. 위임장, 인감증명 및 자격증명서는 이 입찰표에 첨부하십시오.
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          8. 일단 제출된 입찰표는 취소, 변경이나 교환이 불가능합니다.
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          9. 공동으로 입찰하는 경우에는 공동입찰신고서를 입찰표와 함께 제출하되,
          입찰표의 본인란에는 &quot;별첨 공동입찰자목록 기재와 같음&quot; 이라고
          기재한 다음, 입찰표와 공동입찰신고서 사이에는 공동입찰자 전원이 간인
          하십시오.
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          10. 입찰자 본인 또는 대리인 누구나 보증을 반환 받을 수 있습니다.
        </span>
        <span className="md:text-[12pt] text-[11px] text-left font-batang">
          11. 보증의 제공방법(현금·자기앞수표 또는 보증서)중 하나를 선택하여
          표를 기재하십시오.
        </span>
      </div>
    </div>
  )
}

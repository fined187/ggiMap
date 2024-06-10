/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
import Spinner from '@/components/bidForm/Spinner'
import useAgent from '@/components/bidForm/hooks/useAgent'
import AgentFormProps from '@/components/bidForm/shared/AgentFormProps'
import { AgentInfoType } from '@/models/IpchalType'
import { biddingInfoState, stepState } from '@/store/atom/bidForm'
import { useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'

export default function AgentForm() {
  const [biddingForm, setBiddingForm] = useRecoilState(biddingInfoState)
  const [stateNum, setStateNum] = useRecoilState(stepState)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [agentInfo, setAgentInfo] = useState<AgentInfoType>({
    agentName: '',
    agentRel: '',
    agentPhone1: '',
    agentPhone2: '',
    agentPhone3: '',
    agentIdNum1: '',
    agentIdNum2: '',
    agentAddr: '',
    agentAddrDetail: '',
    agentJob: '',
  })
  const [errControl, setErrControl] = useState(false)

  if (typeof window === 'undefined') return null
  window.document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  })

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    setValue,
    formState: { errors },
  } = useForm<AgentInfoType>()

  const { data, isLoading } = useAgent(
    biddingForm.mstSeq,
    biddingForm.agentIdNum,
  )

  const handleAgentUpdate = async () => {
    try {
      const response = await axios.put(
        `/ggi/api/bid-form/${biddingForm.mstSeq}/agents`,
        {
          name: biddingForm.agentName,
          relationship: biddingForm.agentRel,
          phoneNo: biddingForm.agentPhone,
          address: biddingForm.agentAddr,
          job: biddingForm.agentJob ?? '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      if (response.data.success) {
        setStateNum(6)
      } else {
        setErrControl(true)
        alert('입력정보를 다시 확인해주세요')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleNextStep = async () => {
    if (
      biddingForm.agentName !== '' ||
      biddingForm.agentRel !== '' ||
      biddingForm.agentPhone !== '' ||
      biddingForm.agentIdNum !== '' ||
      biddingForm.agentAddr !== '' ||
      biddingForm.agentAddrDetail !== '' ||
      biddingForm.agentJob !== ''
    ) {
      await handleAgentUpdate()
    }
  }
  const onSubmit: SubmitHandler<AgentInfoType> = async () => {
    // if (
    //   handleVerifyIdNum(biddingForm.agentIdNum1 + biddingForm.agentIdNum2) ===
    //   false
    // ) {
    //   alert('주민등록번호를 다시 확인해주세요')
    //   return
    // }
    // if (
    //   handleVerifyPhone(
    //     biddingForm.agentPhone1 +
    //       biddingForm.agentPhone2 +
    //       biddingForm.agentPhone3,
    //   ) === false
    // ) {
    //   alert('전화번호를 확인해주세요')
    //   return
    // }
    if (isOpen === false) {
      try {
        await handleNextStep()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setValue(name, value, { shouldValidate: true })
  }

  const handlePrevBtn = () => {
    setStateNum(4)
  }

  return (
    <div className="flex w-screen h-screen bg-mybg justify-center items-center relative">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4 w-[100%] h-[100%] bg-mybg items-center text-center relative">
          <div className="flex flex-col md:gap-[14px] gap-[5px] justify-center items-center pt-[50px]">
            <span className="md:text-[32.5px] text-[20px] leading-[135%] tracking-[-1%] font-bold font-['suit'] not-italic">
              대리인 정보를 입력해주세요
            </span>
            <div className="md:hidden flex w-[100%]">
              <span className="md:text-[18px] text-[16px] leading-[135%] tracking-[-1%] font-normal font-['suit'] not-italic text-sutTitle">
                법인의 대리인인 경우 입찰자와의 관계에
                <br />
                '직원'등으로 적습니다
              </span>
            </div>
            <div className="hidden md:flex w-[100%]">
              <span className="md:text-[18px] text-[16px] leading-[135%] tracking-[-1%] font-normal font-['suit'] not-italic text-sutTitle">
                법인의 대리인인 경우 입찰자와의 관계에 '직원'등으로 적습니다
              </span>
            </div>
          </div>
          {/* 입력정보 */}
          <AgentFormProps
            register={register}
            errors={errors}
            agentInfo={agentInfo}
            handleInputChange={handleInputChange}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            setFocus={setFocus}
            setValue={setValue}
            setError={setError}
            setAgentInfo={setAgentInfo}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            handlePrevBtn={handlePrevBtn}
          />
        </div>
      )}
    </div>
  )
}

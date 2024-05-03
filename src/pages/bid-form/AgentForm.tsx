/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  handleVerifyIdNum,
  handleVerifyPhone,
} from '@/components/bidForm/util/Validation'
import AgentFormProps from '@/components/bidForm/shared/AgentFormProps'
import { AgentInfoType } from '@/models/IpchalType'
import { biddingInfoState, stepState } from '@/store/atom/bidForm'
import { useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
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

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AgentInfoType>({
    defaultValues: {
      agentName: '',
      agentRel: '',
      agentPhone1: '',
      agentPhone2: '',
      agentPhone3: '',
      agentIdNum1: '',
      agentIdNum2: '',
      agentAddr: '',
      agentJob: '',
    },
    mode: 'onChange',
  })

  if (typeof window === 'undefined') return null
  window.document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  })

  const handleAgentSave = async () => {
    try {
      const response = await axios.post(
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
        setBiddingForm((prev: any) => {
          return {
            ...prev,
            agentAddr: agentInfo.agentAddr + biddingForm.agentAddrDetail ?? '',
          }
        })
        setStateNum(stateNum + 1)
      } else if (response.data.success === false) {
        alert('입력정보를 다시 확인해주세요.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit: SubmitHandler<any> = async () => {
    if (
      handleVerifyIdNum(agentInfo.agentIdNum1 + agentInfo.agentIdNum2) === false
    ) {
      alert('주민등록번호를 확인해주세요')
      return
    }
    if (
      handleVerifyPhone(
        biddingForm.agentPhone1 +
          biddingForm.agentPhone2 +
          biddingForm.agentPhone3,
      ) === false
    ) {
      alert('전화번호를 확인해주세요')
      return
    }
    if (isOpen === false) {
      try {
        await handleAgentSave()
      } catch (error) {
        console.log(error)
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

  useEffect(() => {
    handleHeight()
    window.addEventListener('resize', handleHeight)
    return () => {
      window.removeEventListener('resize', handleHeight)
    }
  }, [])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setValue(name, value, { shouldValidate: true })
  }

  const handlePrevBtn = () => {
    setStateNum(stateNum - 1)
  }

  return (
    <div id="box" className="flex w-screen bg-mybg justify-center relative">
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
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          errors={errors}
          register={register}
          setValue={setValue}
          setFocus={setFocus}
          setError={setError}
          handleInputChange={handleInputChange}
          agentInfo={agentInfo}
          setAgentInfo={setAgentInfo}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          handlePrevBtn={handlePrevBtn}
        />
      </div>
    </div>
  )
}

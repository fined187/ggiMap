import SearchAddress from '@/components/bidForm/SearchAddress'
import Spinner from '@/components/bidForm/Spinner'
import { BiddingInfoType } from '@/models/IpchalType'
import { biddingInfoState, stepState } from '@/store/atom/bidForm'
import { useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { LiaEyeSlashSolid, LiaEyeSolid } from 'react-icons/lia'
import { useRecoilState, useSetRecoilState } from 'recoil'

type BiddersProps = {
  address: string
  bidderType: string
  companyNo: string
  corporationNo: string
  job: string
  name: string
  peopleSeq: number
  phoneNo: string
  share: any
}
interface BidderListProps {
  agentYn: string | null
  bidderCount: number
  mstSeq: number
  number: number
  state: number
  bidders: BiddersProps[]
}

export default function BidderForm() {
  const [stateNum, setStateNum] = useRecoilState(stepState) //  입찰표 작성 단계 set함수
  const [stepNum, setStepNum] = useState<number>(1) //  입찰자 정보 단계
  const [biddingForm, setBiddingForm] = useRecoilState(biddingInfoState) //  입찰표 작성 정보
  const [bidderList, setBidderList] = useState<BidderListProps>() //  입찰자 정보 리스트
  const [loading, setLoading] = useState<boolean>(false) //  로딩 상태
  const { isOpen, onClose, onOpen } = useDisclosure() //  주소검색 모달 상태
  const [passwordActive, setPasswordActive] = useState(false)
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<BiddingInfoType>({
    defaultValues: {
      bidderName: [''],
      bidderPhone1: [''],
      bidderPhone2: [''],
      bidderPhone3: [''],
      bidderIdNum1: [''],
      bidderIdNum2: [''],
      bidderAddr: [''],
      bidderAddrDetail: [''],
      bidderCorpNum1: [''],
      bidderCorpNum2: [''],
      bidderCorpNum3: [''],
      bidderCorpRegiNum1: [''],
      bidderCorpRegiNum2: [''],
      bidderJob: [''],
    },
    mode: 'onChange',
  })
  useEffect(() => {
    const handleGetBidders = async () => {
      try {
        const response = await axios.get(
          `/ggi/api/bid-form/${biddingForm.mstSeq}/bidders`,
        )
        if (response.status === 200) {
          setBidderList(response.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    handleGetBidders()
  }, [stepNum])

  useEffect(() => {
    const handleGetBidderForm = async () => {
      try {
        const response = await axios.get(
          `/ggi/api/bid-form/${biddingForm.mstSeq}/bidders`,
        )
        if (response.status === 200) {
          setBidderList(response.data.data.bidders)
        }
      } catch (error) {
        console.log(error)
      }
    }
    handleGetBidderForm()
  }, [])

  if (typeof window === 'undefined') return null
  window.document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  })

  const handlePhoneFocusMove = (target: HTMLInputElement) => {
    if (target.value.length === 3 && target.id === 'bidderPhone1') {
      setFocus('bidderPhone2')
    } else if (target.value.length === 4 && target.id === 'bidderPhone2') {
      setFocus('bidderPhone3')
    }
  }

  const handleCorpNumFocusMove = (target: HTMLInputElement) => {
    if (target.value.length === 3 && target.id === 'bidderCorpNum1') {
      setFocus('bidderCorpNum2')
    } else if (target.value.length === 2 && target.id === 'bidderCorpNum2') {
      setFocus('bidderCorpNum3')
    }
  }

  const handleCorpRegiNumFocusMove = (target: HTMLInputElement) => {
    if (target.value.length === 6 && target.id === 'bidderCorpRegiNum1') {
      setFocus('bidderCorpRegiNum2')
    }
  }

  const handleIdNumFocusMove = (target: HTMLInputElement) => {
    if (target.value.length === 6 && target.id === 'bidderIdNum1') {
      setFocus('bidderIdNum2')
    }
  }

  //  수정 사항 반영
  const handleUpdate = async () => {
    try {
      if (biddingForm?.bidCorpYn[stepNum - 1] === 'I') {
        const response = await axios.put(
          `/ggi/api/bid-form/${biddingForm.mstSeq}/bidders/${stepNum}`,
          {
            address: biddingForm?.bidAddr[stepNum - 1],
            bidderType: biddingForm?.bidCorpYn[stepNum - 1],
            job: biddingForm.bidJob[stepNum - 1] ?? '',
            name: biddingForm?.bidName[stepNum - 1],
            phoneNo: biddingForm?.bidPhone[stepNum - 1],
          },
        )
        if (response.status === 200) {
          return
        }
      } else if (biddingForm?.bidCorpYn[stepNum - 1] === 'C') {
        const response = await axios.put(
          `/ggi/api/bid-form/${biddingForm.mstSeq}/bidders/${stepNum}`,
          {
            address: biddingForm?.bidAddr[stepNum - 1],
            bidderType: biddingForm?.bidCorpYn[stepNum - 1],
            companyNo: biddingForm?.bidCorpNum[stepNum - 1],
            corporationNo: biddingForm?.bidCorpRegiNum[stepNum - 1],
            job: biddingForm.bidJob[stepNum - 1] ?? '',
            name: biddingForm?.bidName[stepNum - 1],
            phoneNo: biddingForm?.bidPhone[stepNum - 1],
          },
        )
        if (response.status === 200) {
          return
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 입찰자 정보 저장
  const handleBidderFormSave = async () => {
    handleUpdateIdNum(stepNum - 1)
    setLoading(true)
    try {
      if (biddingForm.bidCorpYn[stepNum - 1] === 'I') {
        const response = await axios.post(
          `/ggi/api/bid-form/${biddingForm.mstSeq}/bidders`,
          {
            bidderType: biddingForm.bidCorpYn[stepNum - 1],
            name: biddingForm.bidName[stepNum - 1],
            phoneNo: biddingForm.bidPhone[stepNum - 1],
            address: biddingForm.bidAddr[stepNum - 1],
            job: biddingForm.bidJob[stepNum - 1] ?? '',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        if (response.status === 200) {
          setLoading(false)
          return
        }
      } else {
        const response = await axios.post(
          `/ggi/api/bid-form/${biddingForm.mstSeq}/bidders`,
          {
            bidderType: biddingForm.bidCorpYn[stepNum - 1],
            name: biddingForm.bidName[stepNum - 1],
            phoneNo: biddingForm.bidPhone[stepNum - 1],
            address: biddingForm.bidAddr[stepNum - 1],
            job: biddingForm.bidJob[stepNum - 1] ?? '',
            companyNo: biddingForm.bidCorpNum[stepNum - 1],
            corporationNo: biddingForm.bidCorpRegiNum[stepNum - 1],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        if (response.status === 200) {
          setLoading(false)
          return
        }
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  //  다음 스텝 넘어가기
  const handleNextStepNew = async (num: number) => {
    if (biddingForm.bidderNum === 1) {
      await handleBidderFormSave()
      setStateNum(stateNum + 2)
    } else if (biddingForm.bidderNum > 1) {
      if (stepNum === biddingForm.bidderNum && biddingForm.agentYn === 'N') {
        await handleBidderFormSave()
        setStateNum(stateNum + 1)
      } else if (
        stepNum === biddingForm.bidderNum &&
        biddingForm.agentYn === 'Y'
      ) {
        await handleBidderFormSave()
        setStateNum(19)
      } else if (biddingForm.bidName[stepNum] === '') {
        await handleBidderFormSave()
        setStepNum(num + 1)
      } else {
        if (
          bidderList &&
          bidderList?.bidders?.length > 0 &&
          bidderList?.bidders[stepNum - 1]?.peopleSeq === stepNum
        ) {
          await handleUpdate()
          setStepNum(num + 1)
          reset()
        } else {
          await handleBidderFormSave()
          setStepNum(num + 1)
          reset()
        }
      }
    }
  }

  //  입찰자 정보 가져오기(컴포넌트 마운트시)

  const handleUpdateIdNum = (index: number) => {
    setBiddingForm((prev: any) => {
      const newBidIdNum = [...prev.bidIdNum]
      const newBidderType = [...prev.bidCorpYn]
      if (newBidderType[index] === 'I') {
        const isIdNum = newBidIdNum[index]?.length === 13
        if (!isIdNum) {
          newBidIdNum.splice(index, 1, '')
        }
      } else if (
        newBidderType[index] === 'C' &&
        newBidIdNum[index]?.length !== ''
      ) {
        newBidIdNum.splice(index, 1, '')
      }
      return { ...prev, bidIdNum: newBidIdNum }
    })
  }

  //  전화번호 검증
  const handleVerifyPhone = (phone: string) => {
    // const phoneRegex = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/g
    const telRegex = /^(070|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/
    const smartPhoneRegex = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/g
    const telCheck = telRegex.test(phone)
    const smartPhoneCheck = smartPhoneRegex.test(phone)
    if (telCheck || smartPhoneCheck) {
      return true
    } else {
      return false
    }
  }

  //  민증 검증
  const handleVerifyIdNum = (idNum: string) => {
    if (idNum.length > 0 && idNum.length < 14) {
      const idNumArr = idNum.split('')
      const idNumArr1 =
        idNumArr.length > 0 && idNumArr.map((item) => parseInt(item))
      const idNumArr2 =
        idNumArr1 &&
        idNumArr1.map((item, index) => {
          if (index === 0) {
            return item * 2
          } else if (index === 1) {
            return item * 3
          } else if (index === 2) {
            return item * 4
          } else if (index === 3) {
            return item * 5
          } else if (index === 4) {
            return item * 6
          } else if (index === 5) {
            return item * 7
          } else if (index === 6) {
            return item * 8
          } else if (index === 7) {
            return item * 9
          } else if (index === 8) {
            return item * 2
          } else if (index === 9) {
            return item * 3
          } else if (index === 10) {
            return item * 4
          } else if (index === 11) {
            return item * 5
          } else if (index === 12) {
            return item * 1
          }
        })
      const idNumArr3 =
        idNumArr2 && idNumArr2.reduce((acc: any, cur: any) => acc + cur)
      const idNumArr4 = idNumArr3 && (idNumArr3 - idNumArr2[12]!) % 11
      const idNumArr5 = idNumArr4 && 11 - idNumArr4
      const idNumArr6 = idNumArr5 && idNumArr5 % 10
      if (idNumArr6 === (idNumArr1 && idNumArr1[12])) {
        return true
      } else {
        return false
      }
    }
  }

  //  사업자 등록 번호 검증
  const handleVerifyCorpNum = (number: string) => {
    if (number.length !== 10) {
      return false
    }

    const regsplitNum = number
      .replace(/-/gi, '')
      .split('')
      .map(function (item) {
        return parseInt(item, 10)
      })

    if (regsplitNum.length === 10) {
      const regkey = [1, 3, 7, 1, 3, 7, 1, 3, 5]
      let regNumSum = 0
      for (var i = 0; i < regkey.length; i++) {
        regNumSum += regkey[i] * regsplitNum[i]
      }
      regNumSum += parseInt(((regkey[8] * regsplitNum[8]) / 10).toString(), 10)
      const regCheck =
        Math.floor(regsplitNum[9]) === (10 - (regNumSum % 10)) % 10

      return regCheck
    }
  }

  //  법인등록번호 검증
  const handleVerifyCorpReiNum = (num: string) => {
    const rawValue = num
      .replace(/[^\d]/g, '')
      .split('')
      .map((r) => Number(r))
    const checkSum = rawValue.pop()
    const sum =
      [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
        .map((n, i) => n * rawValue[i])
        .reduce((sum, n) => {
          sum += n
          return sum
        }, 0) % 10
    return sum === (10 - (checkSum ? checkSum : 0)) % 10
  }

  const onSubmit: SubmitHandler<any> = async (stepNum: number) => {
    if (
      biddingForm.bidCorpYn[stepNum - 1] === 'I' &&
      handleVerifyIdNum(
        biddingForm.bidIdNum1[stepNum - 1] + biddingForm.bidIdNum2[stepNum - 1],
      ) === false
    ) {
      alert('주민등록번호를 확인해주세요')
      return
    }
    if (
      biddingForm.bidCorpYn[stepNum - 1] === 'C' &&
      (await handleVerifyCorpNum(
        biddingForm.bidCorpNum1[stepNum - 1] +
          biddingForm.bidCorpNum2[stepNum - 1] +
          biddingForm.bidCorpNum3[stepNum - 1],
      )) === false
    ) {
      alert('사업자등록번호를 확인해주세요')
      return
    }
    if (
      biddingForm.bidCorpYn[stepNum - 1] === 'C' &&
      handleVerifyCorpReiNum(
        biddingForm.bidCorpRegiNum1[stepNum - 1] +
          biddingForm.bidCorpRegiNum2[stepNum - 1],
      ) === false
    ) {
      alert('법인등록번호를 확인해주세요')
      return
    }
    if (
      handleVerifyPhone(
        biddingForm.bidPhone1[stepNum - 1] +
          biddingForm.bidPhone2[stepNum - 1] +
          biddingForm.bidPhone3[stepNum - 1],
      ) === false
    ) {
      alert('전화번호를 확인해주세요')
      return
    }
    if (isOpen === false) {
      try {
        await handleNextStepNew(stepNum)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setValue(name, value, { shouldValidate: true })
  }
  return (
    <div
      className={`flex w-[100%] h-[100vh] bg-mybg justify-center relative overflow-y-auto`}
    >
      {loading && <Spinner />}
      <div className="flex flex-col gap-4 w-[100%] h-[100%] bg-mybg items-center text-center relative">
        <div className="flex flex-col justify-center items-center md:w-[550px] w-[100%]">
          <div className="flex flex-col flex-wrap justify-center items-center pt-[50px] md:gap-[14px] gap-[5px]">
            <span className="md:text-[32.5px] text-[20px] font-bold font-['suit'] not-italic leading-[135%] tracking-[-1%]">
              {stepNum === 1 ? '입찰자(본인)' : '본인 외 '} 정보를 입력해주세요
            </span>
            {biddingForm.bidderNum > 1 && (
              <span className="md:text-[20px] text-[15px] font-light font-['suit'] not-italic leading-[140%] tracking-[-1%] text-sutTitle">
                {`(${stepNum} / ${biddingForm.bidderNum})`}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-row md:w-[550px] w-[90%] justify-center items-center gap-[25px]">
          <div className="flex flex-row gap-[5px]">
            <input
              name="bidderType"
              checked={biddingForm.bidCorpYn[stepNum - 1] === 'I'}
              className="cursor-pointer w-[20px] h-[20px] mt-1 accent-myBlue"
              type="radio"
              onChange={() => {
                setBiddingForm((prev: any) => {
                  const temp = prev.bidCorpYn
                  temp[stepNum - 1] = 'I'
                  return { ...prev, bidCorpYn: temp }
                })
              }}
            />
            <label>
              <span className="md:text-[20px] text-[16px] font-normal font-['suit'] not-italic text-left leading-[135%] tracking-[-2%] ml-1">
                개인
              </span>
            </label>
          </div>
          <div className="flex flex-row gap-[5px]">
            <input
              checked={biddingForm.bidCorpYn[stepNum - 1] === 'C'}
              name="bidderType"
              className="cursor-pointer w-[20px] h-[20px] mt-1 accent-myBlue"
              type="radio"
              onChange={() => {
                setBiddingForm((prev: any) => {
                  const temp = prev.bidCorpYn
                  temp[stepNum - 1] = 'C'
                  return { ...prev, bidCorpYn: temp }
                })
              }}
            />
            <label>
              <span className="md:text-[20px] text-[16px] font-normal font-['suit'] not-italic text-left leading-[135%] tracking-[-2%] ml-1">
                법인
              </span>
            </label>
          </div>
        </div>

        {/* 입력정보 */}
        <form
          onSubmit={handleSubmit(async () => {
            await onSubmit(stepNum)
          })}
          className="flex flex-col md:w-[550px] w-[80%] h-[60%] justify-center items-center overflow-y-auto overflow-x-hidden relative"
        >
          <div className="flex flex-col w-[100%] gap-2 absolute top-0">
            <div className="flex flex-col w-[100%] gap-1">
              <div className="flex justify-between w-[100%]">
                {errors.bidderName?.type == 'required' ? (
                  <div className="flex w-[100%] justify-start">
                    <label
                      htmlFor="bidderName"
                      className="md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left leading-[135%] tracking-[-2%] text-red-500"
                    >
                      {errors.bidderName?.message}
                    </label>
                  </div>
                ) : errors.bidderName?.type == 'minLength' &&
                  biddingForm.bidName[stepNum - 1].length < 2 ? (
                  <div className="flex w-[100%] justify-start">
                    <label
                      htmlFor="bidderName"
                      className="md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left leading-[135%] tracking-[-2%] text-red-500"
                    >
                      {errors.bidderName?.message}
                    </label>
                  </div>
                ) : errors.bidderName?.type == 'maxLength' &&
                  biddingForm.bidName[stepNum - 1].length > 10 ? (
                  <div className="flex w-[100%] justify-start">
                    <label
                      htmlFor="bidderName"
                      className="md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left leading-[135%] tracking-[-2%] text-red-500"
                    >
                      {errors.bidderName?.message}
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-row">
                    {biddingForm.bidCorpYn[stepNum - 1] === 'I' ? (
                      <span className="md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left leading-[135%] tracking-[-2%]">
                        성명
                      </span>
                    ) : (
                      <span className="md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left leading-[135%] tracking-[-2%]">
                        법인명
                      </span>
                    )}
                    <span className="md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left leading-[135%] tracking-[-2%] text-red-500">
                      *
                    </span>
                  </div>
                )}
              </div>
              <input
                {...register('bidderName', {
                  required: '이름을 입력해주세요',
                  minLength: {
                    value: 2,
                    message: '2글자 이상 입력해주세요',
                  },
                })}
                value={biddingForm.bidName[stepNum - 1] || ''}
                id="bidderName"
                type="text"
                className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left h-[40px] px-2 leading-[135%] tracking-[-2%]"
                placeholder={`${
                  biddingForm.bidCorpYn[stepNum - 1] === 'I' ? '성명' : '법인명'
                }을 입력해주세요`}
                onChange={(e) => {
                  setBiddingForm((prev: any) => {
                    const temp = prev.bidName
                    temp[stepNum - 1] = e.target.value
                    return { ...prev, bidName: temp }
                  })
                  handleInputChange(e)
                }}
              />
            </div>
            <div className="flex flex-col w-[100%] gap-1">
              <div className="flex justify-between w-[100%]">
                {(errors.bidderPhone1?.type === 'required' ||
                  errors.bidderPhone2?.type === 'required' ||
                  errors.bidderPhone3?.type === 'required') &&
                (biddingForm.bidPhone[stepNum - 1] === '' ||
                  biddingForm.bidPhone[stepNum - 1] === undefined) ? (
                  <div className="flex w-[100%] justify-start">
                    <span className="md:text-[20px] text-[16px] font-semibold font-['suit'] not-italic text-left leading-[135%] tracking-[-2%] text-red-500">
                      전화번호를 입력해주세요
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-row justify-start w-[100%]">
                    <label
                      htmlFor="bidderPhone"
                      className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left"
                    >
                      전화번호
                    </label>
                    <span className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left text-red-500">
                      *
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-[0.5%]">
                <input
                  {...register('bidderPhone1', { required: true })}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  }}
                  type="text"
                  id="bidderPhone1"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="010"
                  className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold font-['suit'] leading-[135%] tracking-[-2%] not-italic h-[40px] px-2 w-[33%] text-center"
                  value={biddingForm.bidPhone1[stepNum - 1] || ''}
                  onChange={(e) => {
                    setBiddingForm((prev: any) => {
                      const temp = prev.bidPhone1
                      temp[stepNum - 1] = e.target.value
                      return { ...prev, bidPhone1: temp }
                    })
                    setBiddingForm((prev: any) => {
                      const temp = prev.bidPhone
                      temp[stepNum - 1] =
                        e.target.value +
                        biddingForm.bidPhone2[stepNum - 1] +
                        biddingForm.bidPhone3[stepNum - 1]
                      return { ...prev, bidPhone: temp }
                    })
                    handlePhoneFocusMove(e.target)
                    handleInputChange(e)
                  }}
                />
                <input
                  {...register('bidderPhone2', {
                    required: true,
                    maxLength: 4,
                  })}
                  type="text"
                  id="bidderPhone2"
                  inputMode="numeric"
                  maxLength={4}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  }}
                  placeholder="1234"
                  className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[33%] text-center"
                  value={biddingForm.bidPhone2[stepNum - 1] || ''}
                  onChange={(e) => {
                    setBiddingForm((prev: any) => {
                      const temp = prev.bidPhone2
                      temp[stepNum - 1] = e.target.value
                      return { ...prev, bidPhone2: temp }
                    })
                    setBiddingForm((prev: any) => {
                      const temp = prev.bidPhone
                      temp[stepNum - 1] =
                        biddingForm?.bidPhone1[stepNum - 1] +
                        e.target.value +
                        biddingForm?.bidPhone3[stepNum - 1]
                      return { ...prev, bidPhone: temp }
                    })
                    handlePhoneFocusMove(e.target)
                    handleInputChange(e)
                  }}
                />
                <input
                  {...register('bidderPhone3', {
                    required: true,
                    maxLength: 4,
                  })}
                  type="text"
                  id="bidderPhone3"
                  inputMode="numeric"
                  maxLength={4}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  }}
                  placeholder="5678"
                  className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[33%] text-center"
                  value={biddingForm.bidPhone3[stepNum - 1] || ''}
                  onChange={(e) => {
                    setBiddingForm((prev: any) => {
                      const temp = prev.bidPhone3
                      temp[stepNum - 1] = e.target.value
                      return { ...prev, bidPhone3: temp }
                    })
                    setBiddingForm((prev: any) => {
                      const temp = prev.bidPhone
                      temp[stepNum - 1] =
                        biddingForm?.bidPhone1[stepNum - 1] +
                        biddingForm?.bidPhone2[stepNum - 1] +
                        e.target.value
                      return { ...prev, bidPhone: temp }
                    })
                    handlePhoneFocusMove(e.target)
                    handleInputChange(e)
                  }}
                />
              </div>
            </div>
            {biddingForm.bidCorpYn[stepNum - 1] === 'I' ? (
              <>
                <div className="flex flex-col w-[100%] gap-1">
                  <div className="flex justify-between w-[100%]">
                    {errors.bidderIdNum1?.type === 'required' &&
                    errors.bidderIdNum2?.type === 'required' &&
                    (biddingForm.bidIdNum[stepNum - 1] === '' ||
                      biddingForm.bidIdNum[stepNum - 1] === undefined) ? (
                      <div className="flex w-[100%] justify-start h-[15px] mb-2">
                        <span className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left text-red-500">
                          주민등록번호를 입력해주세요
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-row justify-between w-[100%]">
                        <div className="flex flex-row justify-start">
                          <label
                            htmlFor="bidIdNum"
                            className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left"
                          >
                            주민등록번호
                          </label>
                          <span className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left text-red-500">
                            *
                          </span>
                        </div>
                        <div>
                          <span className="hidden md:flex md:text-[15px] text-[0.8rem] font-light leading-[135%] tracking-[-3%] font-['suit'] not-italic text-left text-red-500">
                            주민등록번호는 별도로 저장되지 않습니다
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row gap-[5%] relative">
                    <input
                      {...register('bidderIdNum1', {
                        required: true,
                        maxLength: 6,
                      })}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1')
                      }}
                      type="text"
                      id="bidderIdNum1"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={6}
                      className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[45%] text-center"
                      value={biddingForm.bidIdNum1[stepNum - 1] || ''}
                      onChange={(e) => {
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidIdNum1
                          temp[stepNum - 1] = e.target.value
                          return { ...prev, bidIdNum1: temp }
                        })
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidIdNum
                          temp[stepNum - 1] =
                            e.target.value + biddingForm.bidIdNum2[stepNum - 1]
                          return { ...prev, bidIdNum: temp }
                        })
                        handleIdNumFocusMove(e.target)
                        handleInputChange(e)
                      }}
                    />
                    <span className="flex text-mygray font-['suit'] font-bold mt-1">
                      -
                    </span>
                    <input
                      {...register('bidderIdNum2', {
                        required: true,
                        maxLength: 7,
                      })}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1')
                      }}
                      id="bidderIdNum2"
                      inputMode="numeric"
                      autoComplete="off"
                      type={`${!passwordActive ? 'password' : 'text'}`}
                      maxLength={7}
                      className="flex justify-center items-center border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[150%] tracking-[-1%] font-['suit'] not-italic h-[40px] px-2 w-[45%] text-center"
                      value={biddingForm.bidIdNum2[stepNum - 1] ?? ''}
                      onChange={(e) => {
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidIdNum2
                          temp[stepNum - 1] = e.target.value
                          return { ...prev, bidIdNum2: temp }
                        })
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidIdNum
                          temp[stepNum - 1] =
                            biddingForm.bidIdNum1[stepNum - 1] + e.target.value
                          return { ...prev, bidIdNum: temp }
                        })
                        handleInputChange(e)
                      }}
                    />
                    <div
                      className="flex items-center absolute rigth-0 top-[10px] md:left-[95%] left-[93%] md:w-[10%] w-[15%] cursor-pointer"
                      onClick={() => setPasswordActive(!passwordActive)}
                      style={{
                        zIndex: 10,
                      }}
                    >
                      {passwordActive ? (
                        <LiaEyeSolid className="cursor-pointer" size={'35%'} />
                      ) : (
                        <LiaEyeSlashSolid
                          className="cursor-pointer"
                          size={'35%'}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col w-[100%] gap-1">
                  <div className="flex justify-between w-[100%]">
                    {(errors.bidderCorpNum1?.type === 'required' ||
                      errors.bidderCorpNum2?.type === 'required' ||
                      errors.bidderCorpNum3?.type === 'required') &&
                    (biddingForm.bidCorpNum[stepNum - 1] === '' ||
                      biddingForm.bidCorpNum[stepNum - 1] === undefined) ? (
                      <div className="flex w-[100%] justify-start mb-1">
                        <span className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left text-red-500">
                          사업자등록번호를 입력해주세요
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-row justify-start w-[100%]">
                        <label
                          htmlFor="bidCorpNum"
                          className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left"
                        >
                          사업자 등록번호
                        </label>
                        <span className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left text-red-500">
                          *
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row gap-[5%]">
                    <input
                      {...register('bidderCorpNum1', {
                        required: true,
                        maxLength: 3,
                      })}
                      type="text"
                      id="bidderCorpNum1"
                      inputMode="numeric"
                      placeholder="123"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1')
                      }}
                      maxLength={3}
                      className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[30%] text-center"
                      value={biddingForm.bidCorpNum1[stepNum - 1] || ''}
                      onChange={(e) => {
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidCorpNum1
                          temp[stepNum - 1] = e.target.value
                          return { ...prev, bidCorpNum1: temp }
                        })
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidCorpNum
                          temp[stepNum - 1] =
                            e.target.value +
                            biddingForm.bidCorpNum2[stepNum - 1] +
                            biddingForm.bidCorpNum3[stepNum - 1]
                          return { ...prev, bidCorpNum: temp }
                        })
                        handleCorpNumFocusMove(e.target)
                        handleInputChange(e)
                      }}
                    />
                    <span className="flex text-mygray font-['suit'] font-bold mt-1">
                      -
                    </span>
                    <input
                      {...register('bidderCorpNum2', {
                        required: true,
                        maxLength: 2,
                      })}
                      type="text"
                      id="bidderCorpNum2"
                      inputMode="numeric"
                      placeholder="45"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1')
                      }}
                      maxLength={2}
                      className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[30%] text-center"
                      value={biddingForm.bidCorpNum2[stepNum - 1] || ''}
                      onChange={(e) => {
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidCorpNum2
                          temp[stepNum - 1] = e.target.value
                          return { ...prev, bidCorpNum2: temp }
                        })
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidCorpNum
                          temp[stepNum - 1] =
                            biddingForm.bidCorpNum1[stepNum - 1] +
                            biddingForm.bidCorpNum2[stepNum - 1] +
                            e.target.value
                          return { ...prev, bidCorpNum: temp }
                        })
                        handleCorpNumFocusMove(e.target)
                        handleInputChange(e)
                      }}
                    />
                    <span className="flex text-mygray font-['suit'] font-bold mt-1">
                      -
                    </span>
                    <input
                      {...register('bidderCorpNum3', {
                        required: true,
                        maxLength: 5,
                      })}
                      type="text"
                      id="bidderCorpNum3"
                      inputMode="numeric"
                      placeholder="67890"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1')
                      }}
                      maxLength={5}
                      className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[30%] text-center"
                      value={biddingForm.bidCorpNum3[stepNum - 1] || ''}
                      onChange={(e) => {
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidCorpNum3
                          temp[stepNum - 1] = e.target.value
                          return { ...prev, bidCorpNum3: temp }
                        })
                        setBiddingForm((prev: any) => {
                          const temp = prev.bidCorpNum
                          temp[stepNum - 1] =
                            biddingForm.bidCorpNum1[stepNum - 1] +
                            biddingForm.bidCorpNum2[stepNum - 1] +
                            e.target.value
                          return { ...prev, bidCorpNum: temp }
                        })
                        handleCorpNumFocusMove(e.target)
                        handleInputChange(e)
                      }}
                    />
                  </div>
                  <div className="flex flex-col w-[100%] gap-1 mt-1">
                    <div className="flex justify-between w-[100%]">
                      {(errors.bidderCorpRegiNum1?.type === 'required' ||
                        errors.bidderCorpRegiNum2?.type === 'required') &&
                      (biddingForm.bidCorpRegiNum[stepNum - 1] === '' ||
                        biddingForm.bidCorpRegiNum[stepNum - 1] ===
                          undefined) ? (
                        <div className="flex w-[100%] justify-start mb-1">
                          <span className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left text-red-500">
                            법인 등록번호를 입력해주세요
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-row justify-start w-[100%]">
                          <label
                            htmlFor="bidCorpRegiNum"
                            className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left"
                          >
                            법인 등록번호
                          </label>
                          <span className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left text-red-500">
                            *
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row gap-[5%]">
                      <input
                        {...register('bidderCorpRegiNum1', {
                          required: true,
                          maxLength: 6,
                        })}
                        type="text"
                        id="bidderCorpRegiNum1"
                        inputMode="numeric"
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1')
                        }}
                        maxLength={6}
                        placeholder="123456"
                        className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[50%] text-center"
                        value={biddingForm.bidCorpRegiNum1[stepNum - 1] || ''}
                        onChange={(e) => {
                          setBiddingForm((prev: any) => {
                            const temp = prev.bidCorpRegiNum1
                            temp[stepNum - 1] = e.target.value
                            return { ...prev, bidCorpRegiNum1: temp }
                          })
                          setBiddingForm((prev: any) => {
                            const temp = prev.bidCorpRegiNum
                            temp[stepNum - 1] =
                              e.target.value +
                              biddingForm?.bidCorpRegiNum2[stepNum - 1]
                            return { ...prev, bidCorpRegiNum: temp }
                          })
                          handleCorpRegiNumFocusMove(e.target)
                          handleInputChange(e)
                        }}
                      />
                      <span className="flex text-mygray font-['suit'] font-bold mt-1">
                        -
                      </span>
                      <input
                        {...register('bidderCorpRegiNum2', {
                          required: true,
                          maxLength: 7,
                        })}
                        type="text"
                        id="bidderCorpRegiNum2"
                        inputMode="numeric"
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1')
                        }}
                        maxLength={7}
                        placeholder="1234567"
                        className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic h-[40px] px-2 w-[50%] text-center"
                        value={biddingForm.bidCorpRegiNum2[stepNum - 1] || ''}
                        onChange={(e) => {
                          setBiddingForm((prev: any) => {
                            const temp = prev.bidCorpRegiNum2
                            temp[stepNum - 1] = e.target.value
                            return { ...prev, bidCorpRegiNum2: temp }
                          })
                          setBiddingForm((prev: any) => {
                            const temp = prev.bidCorpRegiNum
                            temp[stepNum - 1] =
                              biddingForm?.bidCorpRegiNum1[stepNum - 1] +
                              e.target.value
                            return { ...prev, bidCorpRegiNum: temp }
                          })
                          handleInputChange(e)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className={`flex flex-col w-[100%] h-[100%] bg-mybg gap-1 relative`}
            >
              {biddingForm.agentYn === 'Y' && (
                <div className="flex flex-col w-[100%] gap-1">
                  <div className="flex justify-between w-[100%]">
                    <div className="flex flex-row justify-start w-[100%]">
                      <label
                        htmlFor="bidderJob"
                        className="md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left"
                      >
                        직업
                      </label>
                    </div>
                  </div>
                  <input
                    value={biddingForm.bidJob[stepNum - 1] || ''}
                    type="text"
                    maxLength={10}
                    className="border border-gray-300 focus:outline-2 focus:outline-myBlue rounded-md md:text-[20px] text-[16px] font-semibold leading-[135%] tracking-[-2%] font-['suit'] not-italic text-left h-[40px] px-2"
                    placeholder="직업을 입력해주세요(예: 회사원, 농부)"
                    onChange={(e) => {
                      setBiddingForm((prev: any) => {
                        const temp = prev.bidJob
                        temp[stepNum - 1] = e.target.value
                        return { ...prev, bidJob: temp }
                      })
                    }}
                  />
                </div>
              )}
              <SearchAddress
                stepNum={stepNum}
                register={register}
                errors={errors}
                setError={setError}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                setValue={setValue}
              />
            </div>
          </div>
          <div
            className={`flex flex-row fixed gap-[10px] md:w-[550px] w-[90%] ${
              biddingForm.bidCorpYn[stepNum - 1] === 'I'
                ? 'md:bottom-[80px] bottom-[10px]'
                : 'md:bottom-[80px] bottom-[10px]'
            }`}
          >
            <button
              type="button"
              className="flex w-[35%] h-[50px] bg-prevBtn rounded-full justify-center items-center cursor-pointer"
              onClick={() => {
                {
                  stepNum === 1
                    ? setStateNum(stateNum - 1)
                    : setStepNum(stepNum - 1)
                }
              }}
            >
              <span className="text-sutTitle font-bold font-['suit'] md:text-[1.2rem] text-[1rem]">
                이전으로
              </span>
            </button>
            <button
              type="submit"
              className="flex w-[60%] md:w-[65%] h-[50px] bg-myBlue rounded-full justify-center items-center cursor-pointer"
            >
              <span className="text-white font-bold font-['suit'] md:text-[1.2rem] text-[1rem]">
                다음으로
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

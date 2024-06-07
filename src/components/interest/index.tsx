import styled from '@emotion/styled'
import TitlePage from './Title'
import TableFrame from './TableFrame'
import Spacing from '../shared/Spacing'
import TopLine from './TopLine'
import TextField from '../shared/TextField'
import { useCallback, useEffect, useState } from 'react'
import GroupElements from './Group'
import NoGroupBtn from './Register/NoGroup'
import AlertCheck from './AlertCheck'
import Text from '../shared/Text'
import Flex from '../shared/Flex'
import { css } from '@emotion/react'
import { InterestFormData, UpdatedInterest, interest } from '@/models/Interest'
import Button from '../shared/Button'
import InfoTextPage from './InfoText'
import { usePostInterest } from './hooks/usePostInterest'
import Dimmed from '../shared/Dimmed'
import { colors } from '@/styles/colorPalette'
import {
  getGmInterest,
  getKmInterest,
  getKwInterest,
} from '@/remote/interest/getInterest'
import Loader from '../map/sideMenu/searchListBox/listBox/icon/loader/Loader'
import Image from 'next/image'
import UpdateResult from './InterestResult'
import { usePutInterest } from './hooks/usePutInterest'
import { useDeleteInterest } from './hooks/useDeleteInterest'

export default function InterestProps({
  openModal,
  setOpenModal,
  type,
  id,
  onButtonClick,
}: {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  type: string
  id: string
  onButtonClick: () => void
}) {
  const [openGroup, setOpenGroup] = useState(false)
  const [step, setStep] = useState(1)
  const [interestData, setInterestData] = useState<interest | null>(null)
  const 처음등록하는가 = interestData?.interestInfo === null
  const [formData, setFormData] = useState<InterestFormData>({
    goodsId: '',
    infoId: '',
    caseNo: '',
    manageNo: '',
    mulSeq: '',
    oldInfoId: '',
    infoNo: '',
    isNewCategory: false,
    interestInfo: {
      category: '',
      memo: '',
      starRating: '0',
    },
    title: '',
    importance: '',
    categories: [''],
    smsNotificationYn: 'N',
    isWait: false,
  })

  const [updatedData, setUpdatedData] = useState<UpdatedInterest>({
    infoId: '',
    caseNo: '',
    manageNo: '',
    mulSeq: '',
    oldInfoId: '',
    infoNo: '',
    interestInfo: {
      category: '',
      memo: '',
      starRating: '',
    },
    count: 0,
    categories: [''],
    smsNotificationYn: 'N',
    isWait: false,
    goodsId: '',
    address: '',
  })

  const handleGetData = async (type: string, id: string) => {
    try {
      switch (type) {
        case '1':
          const responseKm = await getKmInterest(id)
          if (responseKm.success) {
            setInterestData(responseKm.data)
            setFormData((prev) => {
              return {
                ...prev,
                infoId: responseKm.data?.infoId,
                caseNo: responseKm.data?.caseNo ?? '',
                manageNo: responseKm.data?.manageNo ?? '',
                mulSeq: responseKm.data?.mulSeq,
                infoNo: responseKm.data?.infoNo ?? '',
                oldInfoId: responseKm.data?.oldInfoId,
                interestInfo: {
                  category: responseKm.data?.interestInfo?.category ?? '미분류',
                  memo: responseKm.data?.interestInfo?.memo ?? '',
                  starRating: responseKm.data?.interestInfo?.starRating ?? '',
                },
                title:
                  responseKm.data?.caseNo !== undefined
                    ? '사건번호'
                    : '관리번호',
                categories: responseKm.data?.categories,
                smsNotificationYn: responseKm.data?.smsNotificationYn,
                isWait: responseKm.data?.isWait,
              }
            })
          }
          break
        case '2':
          const responseGm = await getGmInterest(id)
          if (responseGm.success) {
            setInterestData(responseGm.data)
            setFormData((prev) => {
              return {
                ...prev,
                goodsId: responseGm.data?.goodsId,
                manageNo: responseGm.data?.manageNo,
                interestInfo: {
                  category: responseGm.data?.interestInfo?.category ?? '미분류',
                  memo: responseGm.data?.interestInfo?.memo ?? '',
                  starRating: responseGm.data?.interestInfo?.starRating ?? '',
                },
                categories: responseGm.data?.categories,
              }
            })
          }
          break
        case '4':
          const responseKw = await getKwInterest(id)
          if (responseKw.success) {
            setInterestData(responseKw.data)
            setFormData((prev) => {
              return {
                ...prev,
                infoId: responseKw.data?.infoId,
                caseNo: responseKw.data?.caseNo,
                mulSeq: responseKw.data?.mulSeq,
                oldInfoId: responseKw.data?.oldInfoId,
                infoNo: responseKw.data?.infoNo,
                interestInfo: {
                  category: responseKw.data?.interestInfo?.category ?? '미분류',
                  memo: responseKw.data?.interestInfo?.memo ?? '',
                  starRating: responseKw.data?.interestInfo?.starRating ?? '',
                },
                categories: responseKw.data?.categories,
              }
            })
          }
          break
        default:
          return { notFound: true }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    handleGetData(type, id)
  }, [type, id])

  const { mutate: postInterest } = usePostInterest(
    type,
    formData,
    setUpdatedData,
  )
  const { mutate: putInterest } = usePutInterest(type, formData, setUpdatedData)
  const { mutate: deleteInterest } = useDeleteInterest(type, formData)
  const handleDuplicatedGroupName = useCallback(
    (name: string) => {
      if (formData.categories.includes(name) && formData.isNewCategory) {
        alert('이미 존재하는 그룹명입니다.')
        return true
      }
      return false
    },
    [formData.categories],
  )
  const handleForm = () => {
    if (
      formData.interestInfo.starRating === undefined ||
      formData.interestInfo.starRating === ''
    ) {
      alert('중요도를 선택해주세요')
    } else if (
      (formData.isNewCategory && formData.interestInfo.category === '') ||
      (formData.isNewCategory && formData.interestInfo.category === undefined)
    ) {
      alert('새 그룹명을 입력해주세요')
    } else if (handleDuplicatedGroupName(formData.interestInfo.category)) {
      return
    } else {
      if (처음등록하는가) {
        if (window.confirm('관심물건을 등록하시겠습니까?')) {
          postInterest()
          setStep(2)
        }
      } else {
        if (window.confirm('관심물건을 수정하시겠습니까?')) {
          putInterest()
          setStep(2)
        }
      }
    }
  }

  const handleCloseBtn = () => {
    if (처음등록하는가) {
      onButtonClick()
    } else {
      if (window.confirm('관심물건을 삭제하시겠습니까?')) {
        deleteInterest()
        onButtonClick()
      }
    }
  }
  return (
    <Dimmed>
      <ModalContainer
        style={{
          height:
            step === 1
              ? interestData?.interestInfo !== null
                ? '850px'
                : type === '1'
                ? '800px'
                : '550px'
              : '400px',
        }}
      >
        <Container>
          {step === 1 ? (
            interestData && interestData === null ? (
              <Loader />
            ) : (
              <>
                {interestData?.interestInfo !== null ? (
                  <>
                    <Flex justify="space-between">
                      <TitlePage title="관심물건 수정/삭제" />
                      <Image
                        src={
                          'https://cdn3.iconfinder.com/data/icons/user-interface-169/32/cross-512.png'
                        }
                        alt="close"
                        width={30}
                        height={30}
                        onClick={() => {
                          onButtonClick()
                        }}
                        style={{
                          cursor: 'pointer',
                        }}
                      />
                    </Flex>
                    <Spacing size={10} />
                    <InfoTextPage />
                  </>
                ) : (
                  <>
                    <Flex justify="space-between">
                      <TitlePage title="관심물건 등록" />
                      <Image
                        src={
                          'https://cdn3.iconfinder.com/data/icons/user-interface-169/32/cross-512.png'
                        }
                        alt="close"
                        width={30}
                        height={30}
                        onClick={() => {
                          onButtonClick()
                        }}
                        style={{
                          cursor: 'pointer',
                        }}
                      />
                    </Flex>
                  </>
                )}
                <Spacing size={10} />
                <TopLine />
                <TableFrame
                  title={
                    interestData?.caseNo !== undefined ? '사건번호' : '관리번호'
                  }
                  contents={
                    interestData?.caseNo !== undefined
                      ? interestData?.caseNo?.slice(0, 4) +
                        '-' +
                        interestData?.caseNo?.slice(
                          5,
                          interestData?.caseNo?.length,
                        )
                      : interestData?.manageNo
                  }
                />
                <TableFrame
                  title="중요도"
                  contents={
                    <GroupElements
                      formData={formData}
                      setFormData={setFormData}
                    />
                  }
                  background="#F9F9F9"
                />
                <TableFrame
                  title="등록그룹"
                  contents={
                    <NoGroupBtn
                      openGroup={openGroup}
                      setOpenGroup={setOpenGroup}
                      formData={formData}
                      setFormData={setFormData}
                      handleDuplicatedGroupName={handleDuplicatedGroupName}
                    />
                  }
                  background="#F9F9F9"
                  height="107"
                  openGroup={openGroup}
                  setOpenGroup={setOpenGroup}
                />
                <TableFrame
                  title="메모"
                  contents={
                    <TextField
                      maxLength={1500}
                      style={{
                        width: '600px',
                        height: '100px',
                        border: '1px solid #BDBDBD',
                        borderRadius: '5px',
                      }}
                      onChange={(e) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            interestInfo: {
                              ...prev.interestInfo,
                              memo: e.target.value,
                            },
                          }
                        })
                      }}
                    />
                  }
                  height="107"
                  background="#F9F9F9"
                />
                {type === '1' && (
                  <>
                    <Spacing size={45} />
                    <TitlePage title="SNS 알림 서비스" />
                    <Spacing size={20} />
                    <AlertCheck formData={formData} setFormData={setFormData} />
                    <Spacing size={10} />
                    <Flex justify="flex-end">
                      <Text
                        css={InfoText}
                        style={{
                          color: '#FF0000',
                        }}
                      >
                        {'고객라운지 > 환경설정 > 알림설정'}
                      </Text>
                      &nbsp;
                      <Text css={InfoText}>
                        {' 에서 더욱 자세한 설정이 가능합니다'}
                      </Text>
                    </Flex>
                  </>
                )}
                <Flex
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    gap: '10px',
                  }}
                >
                  <Button
                    css={RegisterBtn}
                    onClick={() => {
                      handleForm()
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontFamily: 'SUIT',
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '135%',
                        letterSpacing: '-0.36px',
                      }}
                    >
                      {처음등록하는가 ? '관심물건 등록' : '관심물건 수정'}
                    </Text>
                  </Button>
                  <CloseBtn
                    isUpdate={!처음등록하는가 || false}
                    onClick={() => {
                      handleCloseBtn()
                    }}
                  >
                    <Text
                      style={{
                        color: !처음등록하는가 ? '#F00' : '#6D6E70',
                        fontFamily: 'SUIT',
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '135%',
                        letterSpacing: '-0.36px',
                      }}
                    >
                      {!처음등록하는가 ? '삭제' : '닫기'}
                    </Text>
                  </CloseBtn>
                </Flex>
              </>
            )
          ) : (
            <UpdateResult
              onButtonClick={onButtonClick}
              type={type}
              id={id}
              updatedData={updatedData}
              처음등록하는가={처음등록하는가}
            />
          )}
        </Container>
      </ModalContainer>
    </Dimmed>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  flex-direction: column;
  position: relative;
  gap: 20px;
`

const InfoText = css`
  color: #000001;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%;
  letter-spacing: -0.32px;
`
const RegisterBtn = css`
  display: flex;
  width: 190px;
  height: 50px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #6d6e70;
`

const CloseBtn = styled.button<{ isUpdate: boolean }>`
  display: flex;
  width: 90px;
  height: 50px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 8px;
  border: ${({ isUpdate }) =>
    isUpdate ? '1px solid #F00' : '1px solid #6D6E70'};
  background: #fff;
`

const ModalContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colors.white};
  border-radius: 8px;
  overflow: hidden;
  z-index: 100000;
  width: 780px;
  height: 800px;
  padding: 10px;
  box-sizing: border-box;
`

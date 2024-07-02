import styled from '@emotion/styled'
import TitlePage from './Title'
import TableFrame from './TableFrame'
import Spacing from '../shared/Spacing'
import TopLine from './TopLine'
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
import { useRecoilValue } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import { usePostListItems } from '@/hooks/items/usePostListItems'
import usePostMapItems from '@/hooks/items/usePostMapItems'
import { useMutateDetail } from '../map/sections/Overlay/hooks/useMutateDetail'
import useHandleSelectedData from './hooks/useSelectedData'
import { authInfo } from '@/store/atom/auth'

interface InterestProps {
  type: string
  id: string
  openModal: boolean
  setOpenModal: (open: boolean) => void
  onButtonClick: () => void
}

export default function InterestProps({
  openModal,
  setOpenModal,
  type,
  id,
  onButtonClick,
}: InterestProps) {
  const [openGroup, setOpenGroup] = useState(false)
  const [step, setStep] = useState(1)
  const [interestData, setInterestData] = useState<interest | null>(null)
  const [formData, setFormData] = useState<InterestFormData>({
    goodsId: '',
    infoId: '',
    caseNo: '',
    manageNo: '',
    mulSeq: '',
    oldInfoId: '',
    infoNo: '',
    caseNoString: '',
    isNewCategory: false,
    interestInfo: {
      category: '',
      memo: '',
      starRating: '',
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
    caseNoString: '',
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

  const 처음등록하는가 = interestData?.interestInfo === null
  const oldFormData = useRecoilValue(formDataAtom)
  const auth = useRecoilValue(authInfo)
  const { mutate: postListItems } = usePostListItems(oldFormData, 1, 10)
  const { mutate: postMapItems } = usePostMapItems(oldFormData, false)
  const { mutate: postDetail } = useMutateDetail()
  const { handleSelectedData } = useHandleSelectedData()
  const { mutate: postInterest } = usePostInterest(
    type,
    formData,
    setUpdatedData,
  )
  const { mutate: putInterest } = usePutInterest(type, formData, setUpdatedData)
  const { mutate: deleteInterest } = useDeleteInterest(type, formData)

  const handleGetData = async (type: string, id: string) => {
    const fetchData: { [key: string]: Function } = {
      '1': getKmInterest,
      '2': getGmInterest,
      '3': getGmInterest,
      '4': getKwInterest,
    }
    const fetchFunction = fetchData[type]

    try {
      const response = await fetchFunction(id)
      if (response.success) {
        const data = response.data
        setInterestData(data)
        setFormData((prev) => ({
          ...prev,
          ...{
            infoId: data?.infoId,
            caseNo: data?.caseNo ?? '',
            manageNo: data?.manageNo ?? '',
            mulSeq: data?.mulSeq,
            infoNo: data?.infoNo ?? '',
            caseNoString: data?.caseNoString ?? '',
            oldInfoId: data?.oldInfoId,
            interestInfo: {
              category: data?.interestInfo?.category ?? '미분류',
              memo: data?.interestInfo?.memo ?? '',
              starRating: data?.interestInfo?.starRating ?? '',
            },
            title: data?.caseNo !== undefined ? '사건번호' : '관리번호',
            categories: data?.categories,
            smsNotificationYn: data?.smsNotificationYn,
            isWait: data?.isWait,
          },
        }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    handleGetData(type, id)
  }, [type, id])

  const handleDuplicatedGroupName = useCallback(
    (name: string) => {
      if (formData.categories.includes(name) && formData.isNewCategory) {
        alert('이미 존재하는 그룹명입니다.')
        return true
      }
      return false
    },
    [formData.categories, formData.isNewCategory],
  )

  const handleForm = () => {
    if (formData.isNewCategory && !formData.interestInfo.category) {
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
        setTimeout(() => {
          postListItems()
          postMapItems()
          postDetail()
          if (auth.idCode) handleSelectedData()
          onButtonClick()
        }, 500)
      }
    }
  }

  const renderInterestForm = () => (
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
              onClick={onButtonClick}
              style={{ cursor: 'pointer' }}
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
              onClick={onButtonClick}
              style={{ cursor: 'pointer' }}
            />
          </Flex>
        </>
      )}
      <Spacing size={10} />
      <TopLine />
      <TableFrame
        title={interestData?.caseNo !== undefined ? '사건번호' : '관리번호'}
        contents={interestData?.caseNoString ?? interestData?.manageNo}
      />
      <TableFrame
        title="중요도"
        contents={
          <GroupElements formData={formData} setFormData={setFormData} />
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
          <textarea
            maxLength={1500}
            style={{
              width: '600px',
              height: '100px',
              border: '1px solid #BDBDBD',
              borderRadius: '5px',
              padding: '10px',
              resize: 'none',
            }}
            value={formData.interestInfo.memo ?? ''}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                interestInfo: {
                  ...prev.interestInfo,
                  memo: e.target.value,
                },
              }))
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
            <Text css={InfoText} style={{ color: '#FF0000' }}>
              {'고객라운지 > 환경설정 > 알림설정'}
            </Text>
            &nbsp;
            <Text css={InfoText}>{' 에서 더욱 자세한 설정이 가능합니다'}</Text>
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
        <Button css={RegisterBtn} onClick={handleForm}>
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
        <CloseBtn isUpdate={!처음등록하는가} onClick={handleCloseBtn}>
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

  const renderContent = () => {
    if (step === 1) {
      return interestData === null ? <Loader /> : renderInterestForm()
    } else {
      return (
        <UpdateResult
          onButtonClick={onButtonClick}
          updatedData={updatedData}
          처음등록하는가={처음등록하는가}
          formData={formData}
        />
      )
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
        <Container>{renderContent()}</Container>
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

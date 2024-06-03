import styled from '@emotion/styled'
import TitlePage from './Title'
import TableFrame from './TableFrame'
import Spacing from '../shared/Spacing'
import TopLine from './TopLine'
import TextField from '../shared/TextField'
import { useEffect, useState } from 'react'
import GroupElements from './Group'
import NoGroupBtn from './Register/NoGroup'
import AlertCheck from './AlertCheck'
import Text from '../shared/Text'
import Flex from '../shared/Flex'
import { css } from '@emotion/react'
import { InterestFormData, interest } from '@/models/Interest'
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
  const [interestData, setInterestData] = useState<interest | null>(null)
  const [formData, setFormData] = useState<InterestFormData>({
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

  const handleGetData = async (type: string, id: string) => {
    try {
      let data
      switch (type) {
        case '1':
          data = await getKmInterest(id)
          setInterestData(data)
          break
        case '2':
          data = await getGmInterest(id)
          setInterestData(data)
          break
        case '4':
          data = await getKwInterest(id)
          setInterestData(data)
          break
        default:
          return { notFound: true }
      }
      if (interestData) {
        setFormData((prev) => {
          return {
            ...prev,
            infoId: data?.infoId,
            caseNo: data?.caseNo ?? '',
            manageNo: data?.manageNo ?? '',
            mulSeq: data?.mulSeq,
            infoNo: data?.infoNo ?? '',
            oldInfoId: data?.oldInfoId,
            interestInfo: {
              category: data?.interestInfo?.category ?? '',
              memo: data?.interestInfo?.memo ?? '',
              starRating: data?.interestInfo?.starRating ?? '',
            },
            title: data?.caseNo !== undefined ? '사건번호' : '관리번호',
            categories: handleCategorySort(data?.categories ?? ['']) ?? [''],
            smsNotificationYn: data?.smsNotificationYn,
            isWait: data?.isWait,
          }
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    handleGetData(type, id)
  }, [type, id])

  const { mutate: postInterest } = usePostInterest(type, formData)

  const handleCategorySort = (categories: string[]) => {
    if (interestData) {
      let newCategory = []
      for (const a of categories) {
        if (a === '미분류') {
          newCategory.unshift(a)
        } else {
          newCategory.push(a)
        }
      }
      return newCategory
    }
  }

  return (
    <Dimmed>
      <ModalContainer>
        <Container>
          {interestData && interestData?.interestInfo !== null ? (
            <>
              <TitlePage title="관심물건 수정/삭제" />
              <Spacing size={10} />
              <InfoTextPage />
            </>
          ) : (
            <>
              <TitlePage title="관심물건 등록" />
            </>
          )}
          <Spacing size={10} />
          <TopLine />
          <TableFrame
            title={interestData?.caseNo !== undefined ? '사건번호' : '관리번호'}
            contents={
              interestData?.caseNo !== undefined
                ? interestData?.caseNo?.slice(0, 4) +
                  '-' +
                  interestData?.caseNo?.slice(5, interestData?.caseNo?.length)
                : interestData?.manageNo
            }
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
                  width: '580px',
                  height: '80px',
                  border: '1px solid #BDBDBD',
                  borderRadius: '5px',
                  padding: '10px',
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
            height="96"
            background="#F9F9F9"
          />
          <Spacing size={65} />
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
            <Text css={InfoText}>{' 에서 더욱 자세한 설정이 가능합니다'}</Text>
          </Flex>
          <Flex
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              gap: '10px',
            }}
          >
            <Button
              css={RegisterBtn}
              onClick={() => {
                postInterest()
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
                {interestData && interestData?.interestInfo !== null
                  ? '관심물건 수정'
                  : '관심물건 등록'}
              </Text>
            </Button>
            <CloseBtn
              isUpdate={
                (interestData && interestData?.interestInfo !== null) || false
              }
              onClick={() => {
                onButtonClick()
              }}
            >
              <Text
                style={{
                  color:
                    interestData && interestData?.interestInfo !== null
                      ? '#F00'
                      : '#6D6E70',
                  fontFamily: 'SUIT',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '135%',
                  letterSpacing: '-0.36px',
                }}
              >
                {interestData && interestData?.interestInfo !== null
                  ? '삭제'
                  : '닫기'}
              </Text>
            </CloseBtn>
          </Flex>
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

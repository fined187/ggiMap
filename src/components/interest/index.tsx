import styled from '@emotion/styled'
import TitlePage from './Title'
import TableFrame from './TableFrame'
import Spacing from '../shared/Spacing'
import TopLine from './TopLine'
import TextField from '../shared/TextField'
import { useState } from 'react'
import GroupElements from './Group'
import NoGroupBtn from './Register/NoGroup'
import AlertCheck from './AlertCheck'
import Text from '../shared/Text'
import Flex from '../shared/Flex'
import { css } from '@emotion/react'
import { interest } from '@/models/Interest'
import Button from '../shared/Button'
import InfoTextPage from './InfoText'

export default function InterestProps({ data }: { data: interest }) {
  const [formData, setFormData] = useState({
    title: '',
    importance: '',
    group: '',
    memo: '',
    SnsAlert: false,
  })
  return (
    <Container>
      {data && data?.interestInfo.category !== '' ? (
        <>
          <TitlePage title="관심물건 수정/삭제" />
          <Spacing size={20} />
          <InfoTextPage />
        </>
      ) : (
        <>
          <TitlePage title="관심물건 등록" />
        </>
      )}
      <Spacing size={20} />
      <TopLine />
      <TableFrame title="사건번호" contents="2021-1234" />
      <TableFrame
        title="중요도"
        contents={<GroupElements />}
        background="#F9F9F9"
      />
      <TableFrame
        title="등록그룹"
        contents={<NoGroupBtn />}
        background="#F9F9F9"
        height="107"
      />
      <TableFrame
        title="메모"
        contents={
          <TextField
            style={{
              width: '580px',
              height: '80px',
              border: '1px solid #BDBDBD',
              borderRadius: '5px',
              padding: '10px',
            }}
          />
        }
        height="96"
        background="#F9F9F9"
      />
      <Spacing size={65} />
      <TitlePage title="SNS 알림 서비스" />
      <Spacing size={20} />
      <AlertCheck />
      <Spacing size={10} />
      <Flex
        justify="flex-end"
        style={{
          marginRight: '20px',
        }}
      >
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
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          gap: '10px',
        }}
      >
        <Button css={RegisterBtn}>
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
            {data && data?.interestInfo.category !== ''
              ? '관심물건 수정'
              : '관심물건 등록'}
          </Text>
        </Button>
        <CloseBtn isUpdate={data && data?.interestInfo.category !== ''}>
          <Text
            style={{
              color:
                data && data?.interestInfo.category !== '' ? '#F00' : '#6D6E70',
              fontFamily: 'SUIT',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '135%',
              letterSpacing: '-0.36px',
            }}
          >
            {data && data?.interestInfo.category !== '' ? '삭제' : '닫기'}
          </Text>
        </CloseBtn>
      </Flex>
    </Container>
  )
}

const Container = styled.div`
  width: 95%;
  height: 100vh;
  padding: 20px 20px;
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

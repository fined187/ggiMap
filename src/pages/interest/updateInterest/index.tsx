import TableFrame from '@/components/interest/TableFrame'
import TitlePage from '@/components/interest/Title'
import TopLine from '@/components/interest/TopLine'
import Button from '@/components/shared/Button'
import Flex from '@/components/shared/Flex'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export default function UpdateInterestPage({
  isUpdate,
}: {
  isUpdate: boolean
}) {
  return (
    <Container>
      {isUpdate ? (
        <>
          <TitlePage title="관심물건 수정되었습니다" />
          <Spacing size={20} />
        </>
      ) : (
        <>
          <TitlePage title="관심물건 등록되었습니다" />
          <Spacing size={20} />
        </>
      )}
      <TopLine />
      <TableFrame title="사건번호" contents="2021-1234" starRating={5} />
      <TableFrame
        title="소재지"
        contents="경북 울진군 후포면 삼율리 53--71, -73 2동 2층 201호"
        background="#F9F9F9"
      />
      <TableFrame
        title="등록그룹"
        contents="EEE 그룹"
        background="#F9F9F9"
        height="65"
      />
      <Flex
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          gap: '10px',
        }}
      >
        <Button
          css={RegisterBtn}
          style={{
            display: isUpdate ? 'none' : 'flex',
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
            {isUpdate ? '관심물건 수정' : '관심물건 목록 보기'}
          </Text>
        </Button>
        <CloseBtn isUpdate={isUpdate}>
          <Text
            style={{
              color: isUpdate ? '#F00' : '#6D6E70',
              fontFamily: 'SUIT',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '135%',
              letterSpacing: '-0.36px',
            }}
          >
            {isUpdate ? '삭제' : '닫기'}
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

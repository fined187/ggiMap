import Image from 'next/image'
import Flex from '../shared/Flex'
import TitlePage from './Title'
import { useInterestContext } from '@/contexts/useModalContext'
import { UpdatedInterest } from '@/models/Interest'
import Spacing from '../shared/Spacing'
import TopLine from './TopLine'
import TableFrame from './TableFrame'
import styled from '@emotion/styled'
import Text from '../shared/Text'
import { css } from '@emotion/react'

interface UpdateResultProps {
  type: string
  id: string
  onButtonClick?: () => void
  updatedData: UpdatedInterest
}

export default function UpdateResult({
  type,
  id,
  onButtonClick,
  updatedData,
}: UpdateResultProps) {
  console.log('updatedData', updatedData)

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    fetch('/member/scrap_list_kyung.asp', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text()) // JSON 요청의 경우 .json() 사용
      .then((data) => {
        console.log('Success:', data) // 성공 시 처리 로직
      })
      .catch((error) => {
        console.error('Error:', error) // 에러 시 처리 로직
      })
  }
  return (
    <>
      <Flex justify="space-between">
        <TitlePage title="관심물건이 등록되었습니다" />
        <Image
          src={
            'https://cdn3.iconfinder.com/data/icons/user-interface-169/32/cross-512.png'
          }
          alt="close"
          width={30}
          height={30}
          onClick={() => {
            onButtonClick && onButtonClick()
          }}
          style={{
            cursor: 'pointer',
          }}
        />
      </Flex>
      <Spacing size={10} />
      <TopLine />
      <TableFrame
        title={updatedData?.caseNo !== undefined ? '사건번호' : '관리번호'}
        contents={
          updatedData?.caseNo !== undefined
            ? updatedData?.caseNo?.slice(0, 4) +
              '-' +
              updatedData?.caseNo?.slice(5, updatedData?.caseNo?.length)
            : updatedData?.manageNo
        }
        starRating={parseInt(updatedData?.interestInfo.starRating)}
      />
      <TableFrame title="소재지" contents={''} background="#F9F9F9" />
      <TableFrame
        title="등록그룹"
        contents={updatedData?.interestInfo.category}
        background="#F9F9F9"
      />
      <Spacing size={20} />
      <Flex
        style={{
          width: '100%',
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          gap: '5px',
        }}
      >
        <form onSubmit={handleSubmitForm}>
          <input
            type="hidden"
            name="group"
            value={updatedData?.interestInfo.category}
          />
          <ListButtonStyle type="submit">
            <Text css={ListTextStyle}>관심물건 목록 보기</Text>
          </ListButtonStyle>
        </form>
        <CloseButtonStyle onClick={() => onButtonClick && onButtonClick()}>
          <Text css={TextStyle}>닫기</Text>
        </CloseButtonStyle>
      </Flex>
    </>
  )
}

const ListButtonStyle = styled.button`
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

const ListTextStyle = css`
  color: #fff;

  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
  letter-spacing: -0.36px;
`

const CloseButtonStyle = styled.button`
  display: flex;
  width: 90px;
  height: 50px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #6d6e70;
  background: #fff;
`
const TextStyle = css`
  color: #6d6e70;
  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
  letter-spacing: -0.36px;
`

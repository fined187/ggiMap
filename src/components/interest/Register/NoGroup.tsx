import Flex from '@/components/shared/Flex'
import Input from '@/components/shared/Input'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useState } from 'react'

export default function NoGroupBtn() {
  const [isFocus, setIsFocus] = useState(false)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ContainerStyle>
        <Flex
          direction="row"
          style={{
            width: '470px',
          }}
        >
          {isFocus ? (
            <InputStyle placeholder="그룹이름" />
          ) : (
            <ButtonStyle
              onClick={() => {
                setIsFocus(true)
              }}
            >
              <Text css={ButtonTextStyle}>미분류</Text>
              <Flex>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="#8C8C8C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Flex>
            </ButtonStyle>
          )}
          <Spacing direction="horizontal" size={10} />
          <Input
            type="radio"
            name="newGroup"
            style={{
              width: '15px',
              height: '15px',
              marginTop: '5px',
              marginRight: '5px',
            }}
            onClick={() => {
              setIsFocus(true)
            }}
            onChange={() => {}}
            checked={isFocus ? true : false}
          />
          <Text css={NewGroupRadioStyle}>새 그룹으로 등록</Text>
        </Flex>
        <Flex
          justify="end"
          align="end"
          style={{
            cursor: 'pointer',
          }}
        >
          <Text css={GroupListStyle}>그룹 목록 열기</Text>
        </Flex>
      </ContainerStyle>
      <Spacing size={20} />
      <ContainerStyle>
        <Flex
          style={{
            width: '110px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Input
            type="radio"
            name="newGroup"
            style={{
              width: '15px',
              height: '15px',
              marginTop: '5px',
              marginRight: '5px',
            }}
            onClick={() => {
              setIsFocus(false)
            }}
            onChange={() => {}}
          />
          <Text css={NewGroupRadioStyle}>미분류</Text>
        </Flex>
      </ContainerStyle>
    </div>
  )
}

const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: row;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: start;
`

const ButtonStyle = styled.button`
  display: flex;
  width: 135px;
  padding: 4px 8px 4px 4px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 4px;
  border: 1px solid #2a62c5;
  background: #fff;
  flex-direction: row;
`

const InputStyle = styled.input`
  display: flex;
  width: 135px;
  padding: 4px 8px 4px 4px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 4px;
  border: 1px solid #2a62c5;
  background: #fff;
  text-align: center;
  color: #2a62c5;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.32px;
  &:focus {
    outline: none;
  }
`

const ButtonTextStyle = css`
  color: #216cff;
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.32px;
`

const NewGroupRadioStyle = css`
  color: #000001;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%;
  letter-spacing: -0.32px;
  margin-top: 2px;
`

const GroupListStyle = css`
  color: #0075b1;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  letter-spacing: -0.32px;
`

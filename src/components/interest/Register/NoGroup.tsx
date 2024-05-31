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
    <ContainerStyle>
      <Flex direction="row">
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
                  stroke-width="2"
                  stroke-linecap="round"
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
        />
        <Text css={NewGroupRadioStyle}>새 그룹으로 등록</Text>
      </Flex>
      <Flex>hi</Flex>
    </ContainerStyle>
  )
}

const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 10px;
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

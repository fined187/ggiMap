import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export default function Reset() {
  return (
    <ContainerStyle>
      <TextStyle>전체 초기화</TextStyle>
    </ContainerStyle>
  )
}

const ContainerStyle = styled.div`
  display: inline-flex;
  height: 28px;
  padding: 6px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 100px;
  border: 0.5px solid #9d9999;
  background: #fcfcfc;
  cursor: pointer;
  &:hover {
    background: #a6a6a6;
  }
`
const TextStyle = styled.span`
  color: #545454;
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: -0.28px;
  &:hover {
    color: white;
  }
`

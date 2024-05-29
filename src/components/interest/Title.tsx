import { css } from '@emotion/react'
import Flex from '../shared/Flex'
import Text from '../shared/Text'

export default function TitlePage() {
  return (
    <Flex css={containerStyles}>
      <Text css={TitleStyle}>관심물건 등록</Text>
    </Flex>
  )
}

const containerStyles = css`
  position: absolute;
`
const TitleStyle = css`
  color: #000001;
  font-family: SUIT;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: -0.21px;
`

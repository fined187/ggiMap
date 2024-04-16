import { css } from '@emotion/react'
import Flex from '../shared/Flex'

function BottomAddress() {
  return <Flex css={ContainerStyle}>test</Flex>
}

const ContainerStyle = css`
  background-color: #fff;
  width: 350px;
  height: 220px;
  display: flex;
  left: calc(50% + 180px);
  transform: translateX(-50%);
  top: 80px;
  position: absolute;
  border-radius: 10px;
`

export default BottomAddress

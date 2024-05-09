import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'

export default function LayerTop() {
  return <Flex css={LayerTopStyle}></Flex>
}

const LayerTopStyle = css`
  width: 100%;
  height: 180px;
  background-color: #f2f2f2;
  border-radius: 8px 8px 0px 0px;
  border-bottom: 0.5px solid #9d9999;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #4f4f4f;
  cursor: pointer;
  flex-shrink: 0;
`

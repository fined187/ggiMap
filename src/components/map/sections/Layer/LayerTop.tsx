import Flex from '@/components/shared/Flex'
import { MapItem } from '@/models/MapItem'
import { css } from '@emotion/react'

interface LayerTopProps {
  clickedItem: MapItem | null
}

export default function LayerTop({ clickedItem }: LayerTopProps) {
  return <Flex css={LayerTopStyle}>{clickedItem?.id}</Flex>
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

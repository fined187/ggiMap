import LayerTop from './LayerTop'
import LayerBottom from './LayerBottom'
import { MapItem } from '@/models/MapItem'
import styled from '@emotion/styled'

interface ItemProps {
  clickedItem: MapItem | null
  position?: {
    top?: number
    left?: number
    right?: number
    bottom?: number
  }
}

export default function Layer({ clickedItem, position }: ItemProps) {
  console.log(window.innerWidth - 380, window.innerHeight)
  return (
    <LayerContainerStyle>
      <LayerTop clickedItem={clickedItem} />
      <LayerBottom />
    </LayerContainerStyle>
  )
}

const LayerContainerStyle = styled.div`
  width: 300px;
  height: 325px;
  background-color: white;
  flex-shrink: 0;
  border-radius: 8px 8px 8px 8px;
  border: 0.5px solid #9d9999;
  flex-direction: column;
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
`

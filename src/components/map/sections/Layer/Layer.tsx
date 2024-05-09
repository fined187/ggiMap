import Flex from '@/components/shared/Flex'
import LayerTop from './LayerTop'
import LayerBottom from './LayerBottom'
import { styled } from 'twin.macro'

export default function Layer() {
  return (
    <LayerContainerStyle>
      <LayerTop />
      <LayerBottom />
    </LayerContainerStyle>
  )
}

const LayerContainerStyle = styled.div`
  width: 300px;
  height: 325px;
  background-color: white;
  flex-shrink: 0;
  border-radius: 0px 0px 8px 8px;
  border: 0.5px solid #9d9999;
  flex-direction: column;
`

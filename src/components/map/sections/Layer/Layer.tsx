import LayerTop from './LayerTop'
import styled from '@emotion/styled'
import { DetailItems, SelectedItems } from '@/models/DetailItems'
import useGetKmSelected from './hooks/selected/useGetKmSelected'
import { useNavermaps } from 'react-naver-maps'

interface LayterProps {
  items: DetailItems
}

export default function Layer({ items }: LayterProps) {
  const naverMaps = useNavermaps()
  const selectedItems = useGetKmSelected(items?.idCode)
  console.log(selectedItems)
  console.log(naverMaps)
  return (
    <Container selectedItems={selectedItems}>
      <LayerTop />
    </Container>
  )
}

const Container = styled.div<{ selectedItems: SelectedItems }>`
  width: 300px;
  height: 180px;
  border-radius: 8px 8px 0px 0px;
  flex-shrink: 0;
  border: 0.5px solid #9d9999;
  background-color: #fff;
  position: absolute;
  z-index: 1;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

import { css } from '@emotion/react'
import Flex from '../shared/Flex'
import Text from '../shared/Text'
import { useRecoilState } from 'recoil'
import { mapAtom } from '@/store/atom/map'
import { useMap, useNavermaps } from 'react-naver-maps'

function Clustering() {
  const navrMaps = useNavermaps()
  const map = useMap()
  return (
    <Flex css={ContainerStyle}>
      <Text></Text>
    </Flex>
  )
}

export default Clustering

const ContainerStyle = css`
  display: flex;
  width: 80px;
  height: 80px;
  background-color: #333;
`

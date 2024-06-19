/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { ItemDetail } from '@/models/ItemDetail'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'
import { MapItem } from '@/models/MapItem'
import Carousel from './Carousel'

interface TopProps {
  clickedInfo: ItemDetail[] | null
  setClickedInfo: Dispatch<SetStateAction<ItemDetail[] | null>>
  nowIndex: number
  setNowIndex: Dispatch<SetStateAction<number>>
}

export default function Top({
  clickedInfo,
  setClickedInfo,
  nowIndex,
  setNowIndex,
}: TopProps) {
  return (
    <Flex css={ContainerStyle}>
      <Carousel
        clickedInfo={clickedInfo}
        nowIndex={nowIndex}
        setNowIndex={setNowIndex}
        setClickedInfo={setClickedInfo}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  width: 300px;
  height: 180px;
  border-radius: 8px 8px 0px 0px;
`

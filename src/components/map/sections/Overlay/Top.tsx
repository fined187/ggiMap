/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { ItemDetail } from '@/models/ItemDetail'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction, useEffect } from 'react'
import styled from '@emotion/styled'
import Text from '@/components/shared/Text'
import { MapItem } from '@/models/MapItem'
import Interest from '../../icons/Interest'
import MiniMap from './MiniMap'
import Carousel from './Carousel'
import KwCarousel from './KwCarousel'

interface TopProps {
  clickedInfo: ItemDetail[] | null
  setClickedInfo: Dispatch<SetStateAction<ItemDetail[] | null>>
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  nowIndex: number
  setNowIndex: Dispatch<SetStateAction<number>>
}

export default function Top({
  clickedInfo,
  setClickedInfo,
  clickedItem,
  setClickedItem,
  nowIndex,
  setNowIndex,
}: TopProps) {
  return (
    <Flex css={ContainerStyle}>
      <Carousel
        clickedInfo={clickedInfo}
        clickedItem={clickedItem}
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

/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { ItemDetail } from '@/models/ItemDetail'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'
import styled from '@emotion/styled'
import Text from '@/components/shared/Text'
import { MapItem } from '@/models/MapItem'
import Interest from '../../icons/Interest'
import MiniMap from './MiniMap'
import Carousel from './Carousel'

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
      {clickedItem?.type === 4 ? (
        <>
          <Flex
            style={{
              position: 'relative',
              width: '300px',
              height: '180px',
            }}
          >
            <MiniMap
              clickedItem={clickedItem}
              setClickedItem={setClickedItem}
            />
            <TypeStyle type={clickedItem?.type || 1}>
              <Text css={TextStyle}>예정</Text>
            </TypeStyle>
            <ShareType>
              <Text css={TextStyle}>지분</Text>
            </ShareType>
            <Flex
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 1,
              }}
            >
              <Interest interest={clickedInfo?.[0].interest ?? ''} />
            </Flex>
            <BottomBox
              style={{
                flexDirection: 'row',
                zIndex: 1,
              }}
            >
              <Text css={BottomTextStyle}>
                {clickedInfo && clickedInfo[0]?.caseNo}
              </Text>
            </BottomBox>
          </Flex>
        </>
      ) : (
        <Carousel
          clickedInfo={clickedInfo}
          clickedItem={clickedItem}
          nowIndex={nowIndex}
          setNowIndex={setNowIndex}
        />
      )}
    </Flex>
  )
}

const ContainerStyle = css`
  width: 300px;
  height: 180px;
  border-radius: 8px 8px 0px 0px;
`

const TextStyle = css`
  color: #fff;
  font-family: SUIT;
  font-size: 13px;
  font-style: normal;
  font-weight: 800;
  line-height: 140%;
  letter-spacing: -0.13px;
`

const BottomBox = styled.div`
  width: 299px;
  height: 30px;
  flex-shrink: 0;
  border: 0px solid #fff;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  padding: 5px 0px 5px 14px;
  flex-direction: row;
`

const TypeStyle = styled.div<{ type: number }>`
  display: flex;
  width: 39px;
  padding: 2px 6px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  position: absolute;
  border: 0.5px solid #fff;
  top: 13px;
  left: 14px;
  z-index: 1;
  background-color: ${({ type }) =>
    type === 1
      ? '#0038FF'
      : type === 2
      ? '#0087B1'
      : type === 3
      ? '#5200FF'
      : type === 4
      ? '#00924C'
      : ''};
`
const ShareType = styled.div`
  display: flex;
  width: 39px;
  padding: 2px 6px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 0.5px solid #fff;
  background: #f00;
  position: absolute;
  top: 13px;
  left: 60px;
`
const BottomTextStyle = css`
  color: #fff;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.14px;
`

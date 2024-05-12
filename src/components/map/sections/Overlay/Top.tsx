import Flex from '@/components/shared/Flex'
import { ItemDetail } from '@/models/ItemDetail'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import usePathUrl from '../../sideMenu/searchListBox/listBox/hooks/usePathUrl'
import Image from 'next/image'
import styled from '@emotion/styled'
import Text from '@/components/shared/Text'
import { MapItem } from '@/models/MapItem'
import Interest from '../../icons/Interest'

interface TopProps {
  clickedInfo: ItemDetail | null
  setClickedInfo: Dispatch<SetStateAction<ItemDetail | null>>
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
}

export default function Top({
  clickedInfo,
  setClickedInfo,
  clickedItem,
  setClickedItem,
}: TopProps) {
  const pathUrl = usePathUrl(clickedItem?.type || 1)
  console.log(clickedInfo)
  console.log(clickedItem)
  return (
    <Flex css={ContainerStyle}>
      <Swiper>
        <SwiperSlide>
          <Flex
            style={{
              position: 'relative',
              width: '300px',
            }}
          >
            <TypeStyle type={clickedItem?.type || 1}>
              <Text css={TextStyle}>
                {clickedItem?.type === 1
                  ? '경매'
                  : clickedItem?.type === 2
                  ? '캠코'
                  : clickedItem?.type === 3
                  ? '기관'
                  : clickedItem?.type === 4
                  ? '예정'
                  : ''}
              </Text>
            </TypeStyle>
            {clickedInfo?.share === 'Y' && (
              <ShareType>
                <Text css={TextStyle}>지분</Text>
              </ShareType>
            )}
            {clickedInfo?.winAmt ??
              (0 > 0 && (
                <WinType
                  style={{
                    backgroundColor: '#FF4D00',
                  }}
                  shareYn={clickedInfo?.share === 'Y' ? true : false}
                >
                  <Text css={TextStyle}>낙찰</Text>
                </WinType>
              ))}
            <Flex
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
              }}
            >
              <Interest interest={clickedInfo?.interest || ''} />
            </Flex>
            <Image
              src={`${pathUrl}${clickedInfo?.path}`}
              alt="image1"
              width={300}
              height={180}
              style={{
                borderRadius: '8px 8px 0px 0px',
                width: '300px',
                height: '180px',
              }}
            />
            <BottomBox
              style={{
                flexDirection: 'row',
              }}
            >
              <Text css={BottomTextStyle}>{clickedInfo?.usage}</Text>
              &nbsp;
              <Text css={BottomTextStyle}>{clickedInfo?.caseNo}</Text>
            </BottomBox>
          </Flex>
        </SwiperSlide>
      </Swiper>
    </Flex>
  )
}

const ContainerStyle = css`
  width: 300px;
  height: 180px;
  flex-shrink: 0;
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
  width: 300px;
  height: 30px;
  flex-shrink: 0;
  border: 0px solid #fff;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  padding: 5px 0px 5px 14px;
  flex-direction: row;
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

const WinType = styled.div<{ shareYn: boolean }>`
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
  left: ${({ shareYn }) => (shareYn ? '106px' : '60px')};
`

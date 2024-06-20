import Flex from '@/components/shared/Flex'
import MiniMap from './MiniMap'
import styled from '@emotion/styled'
import Interest from '../../icons/Interest'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import NextBtn from './icon/NextBtn'
import PrevBtn from './icon/PrevBtn'

interface KwCarouselProps {
  clickedInfo: ItemDetail[] | null
  clickedItem: MapItem | null
  nowIndex: number
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  setNowIndex: Dispatch<SetStateAction<number>>
}

export default function KwCarousel({
  clickedInfo,
  clickedItem,
  nowIndex,
  setClickedItem,
  setNowIndex,
}: KwCarouselProps) {
  const [kwInfo, setKwInfo] = useState<ItemDetail[]>([])
  useEffect(() => {
    const handleGetKwClickedInfo = () => {
      if (clickedInfo) {
        setKwInfo(clickedInfo.filter((info) => info.claimAmt! > 0))
      }
    }
    handleGetKwClickedInfo()
  }, [clickedInfo])
  console.log(nowIndex)
  return (
    <div>
      <Flex
        style={{
          position: 'relative',
          width: '300px',
          height: '180px',
        }}
      >
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            console.log(swiper.activeIndex)
            setNowIndex(swiper.activeIndex)
          }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {kwInfo.map((_, index) => (
            <SwiperSlide key={index}>
              <TypeStyle type={clickedItem?.types[0] || 1}>
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
                <Interest
                  interest={
                    (clickedInfo && clickedInfo[nowIndex]?.interest) ?? ''
                  }
                />
              </Flex>
              <BottomBox
                style={{
                  flexDirection: 'row',
                  zIndex: 1,
                }}
              >
                <Text css={BottomTextStyle}>
                  {clickedInfo && clickedInfo[nowIndex]?.caseNo}
                </Text>
              </BottomBox>
            </SwiperSlide>
          ))}
          {kwInfo.length > 1 && (
            <>
              <NextBtn />
              <PrevBtn />
            </>
          )}
        </Swiper>
      </Flex>
    </div>
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

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import usePathUrl from '../../sideMenu/searchListBox/listBox/hooks/usePathUrl'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import Text from '@/components/shared/Text'
import NextBtn from './icon/NextBtn'
import PrevBtn from './icon/PrevBtn'
import Flex from '@/components/shared/Flex'
import Interest from '../../icons/Interest'
import { colors } from '@/styles/colorPalette'

export default function Carousel({
  clickedInfo,
  clickedItem,
  nowIndex,
  setNowIndex,
}: {
  clickedInfo: ItemDetail[] | null
  clickedItem: MapItem | null
  nowIndex: number
  setNowIndex: Dispatch<SetStateAction<number>>
}) {
  const [image, setImage] = useState<string[]>([])
  const pathUrl = usePathUrl(clickedItem?.type || 1)
  useEffect(() => {
    if (clickedInfo) {
      setImage(clickedInfo.map((info) => pathUrl + info?.path ?? ''))
    }
  }, [clickedInfo, pathUrl])
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        style={{
          width: '299px',
          height: '180px',
        }}
        onSlideChange={(swiper) => {
          setNowIndex(swiper.activeIndex)
        }}
      >
        {image.map((img, index) => (
          <SwiperSlide key={index}>
            <TypeStyle type={clickedItem?.type || 1}>
              <Text css={TextStyle}>
                {clickedItem?.type === 1
                  ? '경매'
                  : clickedItem?.type === 2
                  ? '캠코'
                  : clickedItem?.type === 3
                  ? '기관'
                  : ''}
              </Text>
            </TypeStyle>
            {clickedInfo && clickedInfo?.length > 1 && (
              <PageCount>
                <Text css={PageCountTextStyle}>
                  {index + 1} / {clickedInfo && clickedInfo.length}
                </Text>
              </PageCount>
            )}
            {clickedInfo && clickedInfo[index]?.share === 'Y' && (
              <ShareType>
                <Text css={TextStyle}>지분</Text>
              </ShareType>
            )}
            {clickedInfo && clickedInfo[index]?.winAmt! > 0 && (
              <WinType
                shareYn={
                  clickedInfo && clickedInfo[index]?.share === 'Y'
                    ? true
                    : false
                }
                style={{
                  backgroundColor: colors.winOrange,
                }}
              >
                <Text css={TextStyle}>낙찰</Text>
              </WinType>
            )}
            <Flex
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
              }}
            >
              <Interest
                interest={(clickedInfo && clickedInfo[index]?.interest) || ''}
              />
            </Flex>
            <LazyLoadImage
              src={img}
              alt="image"
              width="299px"
              height="100%"
              css={imageStyles}
            />
            <BottomBox>
              <Text css={BottomTextStyle}>
                {clickedItem?.type === 1
                  ? clickedInfo && clickedInfo[index]?.caseNo
                  : clickedItem?.type === 2 || 3
                  ? clickedInfo && clickedInfo[index]?.manageNo
                  : ''}
              </Text>
            </BottomBox>
          </SwiperSlide>
        ))}
        {image.length > 1 ? (
          <>
            <NextBtn />
            <PrevBtn />
          </>
        ) : null}
      </Swiper>
    </div>
  )
}

const BottomBox = styled.div`
  width: 299px;
  height: 30px;
  border: 0px solid #fff;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  padding: 5px 0px 5px 14px;
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
const imageStyles = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`

const TextStyle = css`
  color: #fff;
  font-family: SUIT;
  font-size: 13px;
  font-style: normal;
  font-weight: 800;
  line-height: 140%;
  letter-spacing: -0.13px;
  text-align: center;
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
      ? `${colors.kmBlue}`
      : type === 2
      ? `${colors.gmBlue}`
      : type === 3
      ? `${colors.ggPurple}`
      : type === 4
      ? `${colors.kwGreen}`
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

const PageCount = styled.div`
  width: 39px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 0.5px solid #fff;
  background: rgba(0, 0, 0, 0.45);
  position: absolute;
  top: 40px;
  left: 14px;
  justify-content: center;
  align-items: center;
  display: flex;
`

const PageCountTextStyle = css`
  color: #fff;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.12px;
`

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import usePathUrl from '../../sideMenu/searchListBox/listBox/hooks/usePathUrl'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
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
import MiniMap from './MiniMap'
import NoImage from './icon/NoImage'
import NextImageWithFallback from '../../NextImageWithFallback'
import { useInterestContext } from '@/contexts/useModalContext'

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
  setClickedInfo?: Dispatch<SetStateAction<ItemDetail[] | null>>
}) {
  const [image, setImage] = useState<string[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const pathUrl = usePathUrl(clickedItem?.type || 1)
  useEffect(() => {
    if (clickedInfo) {
      setImage(clickedInfo.map((info) => pathUrl + info?.path ?? ''))
    }
  }, [pathUrl, clickedItem, clickedInfo])
  const { open } = useInterestContext()

  const onButtonClick = () => {
    setOpenModal(false)
  }

  return (
    <div
      style={{
        width: '299px',
        height: '180px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          width: '299px',
          height: '180px',
        }}
      >
        <MiniMap clickedItem={clickedItem} clickedInfo={clickedInfo} />
      </div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        freeMode={true}
        style={{
          width: '299px',
          height: '180px',
          borderRadius: '8px 8px 0px 0px',
          position: 'relative',
        }}
        onSlideChange={(swiper) => {
          setNowIndex(swiper.activeIndex)
        }}
      >
        {clickedInfo &&
          clickedInfo?.map((info, index) => (
            <div key={info?.id ? info?.id + index : info?.goodsID! + index}>
              <SwiperSlide>
                {(clickedInfo && clickedInfo[index]?.type === 1) ||
                clickedInfo[index]?.type === 2 ||
                clickedInfo[index]?.type === 3 ? (
                  <div>
                    <NextImageWithFallback
                      src={image[index] ?? ''}
                      alt="image"
                      fallbackComponent={<NoImage />}
                      width={299}
                      height={180}
                      style={{
                        borderRadius: '8px 8px 0px 0px',
                        width: '300px',
                        height: '180px',
                      }}
                    />
                    <TypeStyle
                      style={{
                        backgroundColor:
                          clickedInfo && clickedInfo[index]?.type === 1
                            ? colors.kmBlue
                            : clickedInfo && clickedInfo[index]?.type === 2
                            ? colors.gmBlue
                            : clickedInfo && clickedInfo[index]?.type === 3
                            ? colors.ggPurple
                            : colors.kwGreen,
                      }}
                    >
                      <Text css={TextStyle}>
                        {clickedItem?.type === 1
                          ? '경매'
                          : clickedItem?.type === 2
                          ? '캠코'
                          : clickedItem?.type === 3
                          ? '기관'
                          : '예정'}
                      </Text>
                    </TypeStyle>
                    {clickedInfo && clickedInfo.length > 1 && (
                      <PageCount>
                        <Text css={PageCountTextStyle}>
                          {index + 1}/{clickedInfo.length}
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
                      onClick={() => {
                        if (openModal) {
                          close()
                        } else {
                          open({
                            type:
                              (clickedInfo &&
                                clickedInfo[index]?.type?.toString()) ||
                              '1',
                            id:
                              clickedInfo && clickedInfo[index]?.type === 1
                                ? clickedInfo[index]?.id!
                                : clickedInfo[index]?.type === 2 || 3
                                ? clickedInfo[index]?.goodsID!
                                : clickedInfo[index]?.id!,
                            openModal: openModal,
                            setOpenModal: setOpenModal,
                            onButtonClick: () => {
                              onButtonClick()
                            },
                          })
                        }
                      }}
                    >
                      <Interest
                        interest={
                          (clickedInfo && clickedInfo[index]?.interest) || ''
                        }
                      />
                    </Flex>
                    <BottomBox>
                      <Text css={BottomTextStyle}>
                        {clickedItem?.type === 1
                          ? clickedInfo && clickedInfo[index]?.caseNo
                          : clickedItem?.type === 2 || 3
                          ? clickedInfo && clickedInfo[index]?.manageNo
                          : ''}
                      </Text>
                    </BottomBox>
                  </div>
                ) : (
                  <>
                    <TypeStyle
                      style={{
                        backgroundColor: colors.kwGreen,
                      }}
                    >
                      <Text css={TextStyle}>예정</Text>
                    </TypeStyle>
                    {clickedInfo && clickedInfo.length > 1 && (
                      <PageCount>
                        <Text css={PageCountTextStyle}>
                          {nowIndex + 1}/{clickedInfo.length}
                        </Text>
                      </PageCount>
                    )}
                    <Flex
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        zIndex: 1,
                      }}
                      onClick={() => {
                        if (openModal) {
                          close()
                        } else {
                          open({
                            type:
                              clickedInfo &&
                              clickedInfo[index]?.type?.toString()!,
                            id: clickedInfo && clickedInfo[index]?.id!,
                            openModal: openModal,
                            setOpenModal: setOpenModal,
                            onButtonClick: () => {
                              onButtonClick()
                            },
                          })
                        }
                      }}
                    >
                      <Interest
                        interest={
                          (clickedInfo && clickedInfo[index]?.interest) || ''
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
                        {clickedInfo && clickedInfo[index]?.caseNo}
                      </Text>
                    </BottomBox>
                  </>
                )}
              </SwiperSlide>
            </div>
          ))}
        {clickedInfo && clickedInfo.length > 1 ? (
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

const TypeStyle = styled.div<{ type?: boolean; num?: number }>`
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
  background-color: ${({ type, num }) =>
    type
      ? `${colors.kwGreen}`
      : num === 1
      ? `${colors.kmBlue}`
      : num === 2
      ? `${colors.gmBlue}`
      : num === 3
      ? `${colors.ggPurple}`
      : `${colors.kwGreen}`};
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

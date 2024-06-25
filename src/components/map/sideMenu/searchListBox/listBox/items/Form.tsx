/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import usePathUrl from '../hooks/usePathUrl'
import useNum2Han from '@/utils/useNum2Han'
import Interest from '@/components/map/icons/Interest'
import { MapItems } from '@/models/MapItem'
import KwForm from './KwForm'
import { useState } from 'react'
import NextImageWithFallback from '@/components/map/NextImageWithFallback'
import NoImage from '../icon/NoImage'
import { useInterestContext } from '@/contexts/useModalContext'
import { useRecoilState } from 'recoil'
import { listOverItemAtom } from '@/store/atom/map'

interface ItemProps {
  item: MapItems
  index: number
  isDetailed: boolean
  isSelected?: boolean
}

function Form({ item, index, isDetailed, isSelected }: ItemProps) {
  const url = usePathUrl(item?.type ?? 1)
  const [openModal, setOpenModal] = useState(false)
  const { open } = useInterestContext()
  const [overList, setOverList] = useRecoilState(listOverItemAtom)
  const onButtonClick = () => {
    setOpenModal(false)
  }
  const handleDetailPage = (idCode: string, type: number) => {
    if (isDetailed) {
      if (type === 1) {
        return `https://www.ggi.co.kr/kyungmae/mulgun_detail_popup_h.asp?idcode=${item.idCode}`
      } else if (type === 2 || type === 3) {
        return `https://www.ggi.co.kr/gongmae/GongMae_popup.asp?goodsid=${item.goodsId}&new=new`
      } else if (type === 4) {
        return `https://www.ggi.co.kr/wait/mulgun_detail_popup_w.asp?idcode=${item.idCode}&new=new&viewchk=P`
      }
    }
    if (type === 1) {
      return `https://www.ggi.co.kr/kyungmae/mulgun_detail_popup_h.asp?idcode=${idCode}`
    } else if (type === 2 || type === 3) {
      return `https://www.ggi.co.kr/gongmae/GongMae_popup.asp?goodsid=${idCode}&new=new`
    } else if (type === 4) {
      return `https://www.ggi.co.kr/wait/mulgun_detail_popup_w.asp?idcode=${idCode}&new=new&viewchk=P`
    }
  }
  const handleTitle = (type: number) => {
    if (isSelected) {
      switch (type) {
        case 1:
          return `[본건 : ${item.status}] 경매 `
        case 2:
          return `[본건 : ${item.status}] 캠코 `
        case 3:
          return `[본건 : ${item.status}] 기관매각 `
        case 4:
          return `[본건 : ${item.status}] 예정 `
        default:
          break
      }
    } else {
      switch (type) {
        case 1:
          return '경매 '
        case 2:
          return '캠코 '
        case 3:
          return '기관매각 '
        case 4:
          return '예정 '
        default:
          break
      }
    }
  }
  return (
    <div
      onMouseOver={() => {
        setOverList({
          isOver: true,
          x: item.x,
          y: item.y,
        })
      }}
      onMouseOut={() => {
        setOverList({
          isOver: false,
          x: 0,
          y: 0,
        })
      }}
    >
      {item?.type === 1 || item?.type === 2 || item?.type === 3 ? (
        <Flex
          direction="column"
          css={ContainerStyle}
          style={{
            borderTop: `${index === 0 ? '' : '0.5px solid #e0e0e0 '}`,
          }}
        >
          <ListRow
            left={
              <LeftTextStyle
                color={
                  item?.type === 2
                    ? '#0087B1'
                    : item?.type === 3
                    ? '#5200FF'
                    : '#0038FF'
                }
              >
                {handleTitle(item?.type ?? 1)}
              </LeftTextStyle>
            }
            contents={
              <LeftTextStyle
                color="#000"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item?.caseNo}
              </LeftTextStyle>
            }
            right={
              <Flex
                onClick={() => {
                  if (openModal) {
                    close()
                  } else {
                    open({
                      type: item?.type.toString() ?? '',
                      id: item?.id ?? '',
                      openModal: openModal,
                      setOpenModal: setOpenModal,
                      onButtonClick: () => {
                        onButtonClick()
                      },
                    })
                  }
                }}
              >
                <Interest interest={item?.interest ?? ''} />
              </Flex>
            }
            style={ListLeftStyle}
          />
          <Flex
            direction="row"
            style={{
              position: 'absolute',
              top: 45,
              width: '100%',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (window) {
                window.open(
                  handleDetailPage(item.idCode, item.type),
                  '_blank',
                  'width=1600, height=1000',
                )
              }
            }}
          >
            <NextImageWithFallback
              src={item?.path ? url + item?.path : ''}
              alt="KM image"
              fallbackComponent={<NoImage />}
              width={180}
              height={135}
              style={{
                borderRadius: '5px',
                objectFit: 'cover',
                width: '180px',
                height: '135px',
              }}
              handleDetailPage={handleDetailPage}
              type={item?.type ?? 1}
              idCode={item?.idCode ?? ''}
            />
            <Flex
              direction="column"
              style={{
                marginLeft: '10px',
                width: '150px',
                height: '135px',
                gap: '1px',
              }}
            >
              <Text
                css={minPriceTextStyle}
                style={{
                  color: item?.winAmt != 0 ? '#FF0000' : '#000000',
                }}
              >
                {item?.winAmt != 0 ? '낙찰가' : '최저가'}
              </Text>
              <Text css={minPriceNum}>
                {item?.winAmt != 0
                  ? useNum2Han(item?.winAmt ?? 0) +
                    (item?.ratio && item?.ratio > 0 ? `(${item?.ratio}%)` : '')
                  : useNum2Han(item?.minAmt ?? 0) +
                    (item?.ratio && item?.ratio > 0 ? `(${item?.ratio}%)` : '')}
              </Text>
              <Spacing direction="horizontal" size={2} />
              <Flex direction="row">
                <Text css={appraisalAmtNum}>감정가</Text>
                <Spacing direction="horizontal" size={5} />
                <Text css={appraisalAmt}>
                  {useNum2Han(item?.appraisalAmt ?? 0)}
                </Text>
              </Flex>
              <Spacing direction="horizontal" size={4} />
              <Flex direction="row">
                <Text
                  css={appraisalAmtNum}
                  style={{
                    width: '55px',
                  }}
                >
                  건물면적
                </Text>
                <Spacing direction="horizontal" size={5} />
                <Text
                  css={appraisalAmt}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item?.buildingArea !== '' ? item?.buildingArea : '-'}
                </Text>
              </Flex>
              <Spacing direction="horizontal" size={4} />
              <Flex direction="row">
                <Text
                  css={appraisalAmtNum}
                  style={{
                    width: '55px',
                  }}
                >
                  토지면적
                </Text>
                <Spacing direction="horizontal" size={4} />
                <Text
                  css={appraisalAmt}
                  style={{
                    width: '70px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item?.landArea !== '' ? item?.landArea : '-'}
                </Text>
              </Flex>
              <Spacing direction="horizontal" size={10} />
              {item?.checkInfo && (
                <Flex
                  direction="row"
                  style={{
                    gap: '5px',
                    overflow: 'hidden',
                  }}
                >
                  {Array.from(item?.checkInfo.split(',')).map((info, idx) => (
                    <Flex css={SpecialText} key={idx}>
                      <Text
                        css={SpecialTextStyle}
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {info}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <KwForm
          item={item}
          index={index}
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleDetailPage={handleDetailPage}
          handleTitle={handleTitle}
        />
      )}
    </div>
  )
}

const ContainerStyle = css`
  display: flex;
  position: relative;
  background: #fff;
  gap: 10px;
  padding: 10px 0 10px 0;
  width: 350px;
  height: 208px;
  flex-shrink: 0;
  left: 10px;
  &:hover {
    background: #f0f7ff;
    opacity: 0.5;
  }
`

const ListLeftStyle = css`
  width: 95%;
  flex: 1;
`
const LeftTextStyle = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-family: SUIT;
  font-size: 16.5px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: -0.165px;
  height: 30px;
`

const minPriceTextStyle = css`
  color: #676767;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.24px;
`

const minPriceNum = css`
  color: #000;
  font-family: SUIT;
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
  line-height: 145%;
  letter-spacing: -0.34px;
`

const appraisalAmtNum = css`
  color: #676767;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.28px;
`

const appraisalAmt = css`
  color: #000001;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.28px;
`

const SpecialText = css`
  border-radius: 3px;
  border: 0.5px solid #f00;
  background: #fff;
  display: inline-flex;
  height: 23px;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  gap: 5px;
`

const SpecialTextStyle = css`
  color: #f00;
  text-align: center;
  font-family: SUIT;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 13px;
  letter-spacing: -0.26px;
`
const opacity = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`

export default Form

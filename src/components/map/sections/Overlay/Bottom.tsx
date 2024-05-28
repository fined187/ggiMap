/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
import useNum2Han from '@/utils/useNum2Han'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

interface BottomProps {
  clickedInfo: ItemDetail[] | null
  clickedItem: MapItem | null
  nowIndex: number
}

export default function Bottom({
  clickedInfo,
  clickedItem,
  nowIndex,
}: BottomProps) {
  console.log(clickedInfo)
  console.log(nowIndex)
  console.log(clickedItem)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        borderRadius: ' 0px 0px 8px 8px',
        background: '#FFF',
      }}
    >
      <AmountContainer>
        <Text css={AmountTextStyle}>
          {clickedItem?.type === 4
            ? useNum2Han((clickedInfo && clickedInfo[nowIndex]?.claimAmt) || 0)
            : clickedItem?.winYn === 'Y'
            ? useNum2Han((clickedInfo && clickedInfo[nowIndex]?.winAmt) || 0)
            : useNum2Han((clickedInfo && clickedInfo[nowIndex]?.minAmt) || 0)}
        </Text>
        <Flex
          style={{
            width: '20px',
            height: '20px',
            flexShrink: 0,
            cursor: 'pointer',
            position: 'absolute',
            right: 0,
            top: '4px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 19H17.6154C17.9826 19 18.3348 18.842 18.5945 18.5607C18.8541 18.2794 19 17.8978 19 17.5V2.5C19 2.10218 18.8541 1.72064 18.5945 1.43934C18.3348 1.15804 17.9826 1 17.6154 1H2.38461C2.01739 1 1.66521 1.15804 1.40554 1.43934C1.14588 1.72064 1 2.10218 1 2.5V10"
              stroke="#000001"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 5.84619H1"
              stroke="#000001"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.53857 13.4614L1.00011 18.9999"
              stroke="#000001"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.38477 13.4614H6.53861V16.2307V17.6153"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Flex>
      </AmountContainer>
      <DetailContainer>
        <Flex
          style={{
            flexDirection: 'row',
            position: 'relative',
          }}
        >
          <div
            css={dotStyle}
            style={{
              backgroundColor: '#545454',
              position: 'absolute',
              left: 0,
              top: 7.5,
            }}
          />
          &nbsp;&nbsp;&nbsp;
          <Text css={DetailTextStyle}>
            {clickedInfo && clickedInfo[nowIndex]?.usage}
          </Text>
        </Flex>
        {(clickedItem?.type === 1 ||
          clickedItem?.type === 2 ||
          clickedItem?.type === 3) && (
          <Flex
            style={{
              flexDirection: 'row',
              position: 'relative',
            }}
          >
            <div
              css={dotStyle}
              style={{
                backgroundColor: '#545454',
                position: 'absolute',
                left: 0,
                top: 7.5,
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <Text css={DetailTextStyle}>
              {'감정가 ' +
                useNum2Han(
                  (clickedInfo && clickedInfo[nowIndex]?.appraisalAmt) || 0,
                )}
            </Text>
          </Flex>
        )}
        {clickedItem?.type === 4 &&
          clickedInfo &&
          clickedInfo[nowIndex]?.landArea && (
            <>
              <Text
                style={{
                  color: '#CBCBCB',
                  fontFamily: 'SUIT',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: '140%',
                  letterSpacing: '-0.14px',
                }}
              >
                &nbsp;{' | '}&nbsp;
              </Text>
              <Text css={DetailTextStyle}>
                {'토지 ' + clickedInfo[nowIndex]?.landArea}
              </Text>
            </>
          )}
        {clickedItem?.type !== 4 && (
          <Flex
            style={{
              flexDirection: 'row',
              position: 'relative',
            }}
          >
            <div
              css={dotStyle}
              style={{
                backgroundColor: '#E9413E',
                position: 'absolute',
                left: 0,
                top: 7.5,
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <Text
              css={DetailTextStyle}
              style={{
                color: '#E9413E',
              }}
            >
              {'유찰 ' + (clickedInfo && clickedInfo[nowIndex]?.failCount) ??
                '' + '회'}
            </Text>
            {clickedInfo && clickedInfo[nowIndex]?.landArea && (
              <>
                <Text
                  style={{
                    color: '#CBCBCB',
                    fontFamily: 'SUIT',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: '140%',
                    letterSpacing: '-0.14px',
                  }}
                >
                  &nbsp;{' | '}&nbsp;
                </Text>
                <Text css={DetailTextStyle}>
                  {'토지 ' + clickedInfo && clickedInfo[nowIndex]?.landArea}
                </Text>
              </>
            )}
            {clickedInfo && clickedInfo[nowIndex]?.buildingArea && (
              <>
                <Text
                  style={{
                    color: '#CBCBCB',
                    fontFamily: 'SUIT',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: '140%',
                    letterSpacing: '-0.14px',
                  }}
                >
                  &nbsp;{' | '}&nbsp;
                </Text>
                <Text css={DetailTextStyle}>
                  {'건물 ' + clickedInfo[nowIndex]?.buildingArea}
                </Text>
              </>
            )}
          </Flex>
        )}
        {clickedItem?.type === 4 && (
          <Flex
            style={{
              flexDirection: 'row',
              position: 'relative',
            }}
          >
            <div
              css={dotStyle}
              style={{
                backgroundColor: '#545454',
                position: 'absolute',
                left: 0,
                top: 7.5,
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <Text css={DetailTextStyle}>{'경매개시일'}</Text>
            <Text
              style={{
                color: '#CBCBCB',
                fontFamily: 'SUIT',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: '140%',
                letterSpacing: '-0.14px',
              }}
            >
              &nbsp;{' | '}&nbsp;
            </Text>
            <Text css={DetailTextStyle}>
              {clickedInfo && clickedInfo[nowIndex]?.startDate}
            </Text>
          </Flex>
        )}
        <Flex
          style={{
            flexDirection: 'row',
            position: 'relative',
          }}
        >
          <div
            css={dotStyle}
            style={{
              backgroundColor: '#545454',
              position: 'absolute',
              left: 0,
              top: 7.5,
            }}
          />
          &nbsp;&nbsp;&nbsp;
          <Text
            css={DetailTextStyle}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {clickedInfo && clickedInfo[nowIndex]?.shortAddress}
          </Text>
        </Flex>
      </DetailContainer>
    </div>
  )
}

const AmountContainer = styled.div`
  width: 90%;
  justify-content: space-between;
  display: flex;
  position: absolute;
  top: 12px;
`

const AmountTextStyle = css`
  color: #000001;
  font-family: SUIT;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
  line-height: 140%;
  letter-spacing: -0.2px;
`

const DetailContainer = styled.div`
  width: 85%;
  display: flex;
  position: absolute;
  top: 50px;
  flex-direction: column;
`
const DetailTextStyle = css`
  color: #545454;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.14px;
`
const dotStyle = css`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  position: absolute;
  top: 5px;
`

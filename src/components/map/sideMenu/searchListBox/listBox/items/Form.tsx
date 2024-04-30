/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Image from 'next/image'
import usePathUrl from '../hooks/usePathUrl'
import { GmgItems, KmItems, KwItems } from '@/models/ListItems'
import useNum2Han from '@/utils/useNum2Han'
import Interest from '@/components/map/icons/Interest'

interface ItemProps {
  item: Partial<GmgItems | KmItems | KwItems>
}

function Form({ item }: ItemProps) {
  const url = usePathUrl()
  return (
    <Flex direction="column" css={ContainerStyle}>
      <Spacing direction="horizontal" size={30} />
      <ListRow
        left={
          <LeftTextStyle
            color={
              item.type === 2
                ? '#0087B1'
                : item.type === 3
                ? '#5200FF'
                : '#0038FF'
            }
          >
            {item.type === 2 ? '캠코' : item.type === 3 ? '기관매각' : '경매'}
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
            {item.caseNo ? item.caseNo : item.manageNo}
          </LeftTextStyle>
        }
        right={<Interest interest={item.interest ?? ''} />}
        style={ListLeftStyle}
      />
      <Flex
        direction="row"
        style={{
          position: 'absolute',
          top: 45,
          left: 10,
        }}
      >
        <Image
          src={
            item.type === 2 || item.type === 3
              ? 'http://file.ggi.co.kr/Gongmae/Pic/' + item.path
              : url + item.path
          }
          alt="KM image"
          width={150}
          height={135}
          style={{
            objectFit: 'cover',
            width: '150px',
            height: '135px',
          }}
        />
        <Flex
          direction="column"
          style={{
            gap: item.type ? '0px' : '5px',
            marginLeft: '10px',
          }}
        >
          <Text
            css={minPriceTextStyle}
            style={{
              color: item.winAmt != 0 ? '#FF0000' : '#000000',
            }}
          >
            {item.winAmt != 0 ? '낙찰가' : '최저가'}
          </Text>
          <Text css={minPriceNum}>
            {useNum2Han(item.minAmt ?? 0) +
              '(' +
              (isNaN(((item.minAmt ?? 0) / (item.appraisalAmt ?? 0)) * 100)
                ? 0
                : ((item.minAmt ?? 0) / (item.appraisalAmt ?? 0)) * 100
              ).toFixed(0) ===
            'Infinity'
              ? ''
              : useNum2Han(item.minAmt ?? 0)}
          </Text>
          <Flex direction="row">
            <Text css={appraisalAmtNum}>감정가</Text>
            <Spacing direction="horizontal" size={5} />
            <Text css={appraisalAmt}>{useNum2Han(item.appraisalAmt ?? 0)}</Text>
          </Flex>
          {item.type && (
            <Flex direction="row">
              <Text css={appraisalAmtNum}>건물면적</Text>
              <Spacing direction="horizontal" size={5} />
              <Text css={appraisalAmt}>{item.buildingArea}</Text>
            </Flex>
          )}
          <Flex direction="row">
            <Text css={appraisalAmtNum}>토지면적</Text>
            <Spacing direction="horizontal" size={5} />
            <Text css={appraisalAmt}>{item.landArea}</Text>
          </Flex>
          {item.checkInfo && (
            <Flex
              direction="row"
              style={{
                gap: '5px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {Array.from(item.checkInfo.split(',')).map((info, idx) => (
                <Flex
                  css={SpecialText}
                  key={idx}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <Text css={SpecialTextStyle}>{info}</Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  position: relative;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  gap: 10px;
  padding: 10px;
  width: 100%;
  height: 208px;
  flex-shrink: 0;
`

const ListLeftStyle = css`
  width: 90%;
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
  display: flex;
  min-width: 50px;
  max-width: 100px;
  padding: 5px 2px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 3px;
  border: 0.5px solid #f00;
  background: #fff;
  height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  nowrap: white-space;
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

export default Form

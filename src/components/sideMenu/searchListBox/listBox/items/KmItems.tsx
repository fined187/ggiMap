import Interest from '@/components/icons/Interest'
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Text from '@/components/shared/Text'
import { KmItems } from '@/models/ListItems'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Image from 'next/image'
import usePathUrl from '../hooks/usePathUrl'
import useNum2Han from '@/utils/useNum2Han'
import Spacing from '@/components/shared/Spacing'

function Km({ kmItem }: { kmItem: KmItems }) {
  const url = usePathUrl()
  return (
    <Flex direction="column" css={ContainerStyle}>
      <ListRow
        left={<LeftTextStyle color="#0038FF">경매</LeftTextStyle>}
        contents={<LeftTextStyle color="#000">{kmItem.caseNo}</LeftTextStyle>}
        right={<Interest interest={kmItem.interest} />}
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
          src={url + kmItem.path}
          alt="KM image"
          width={150}
          height={150}
          style={{
            objectFit: 'cover',
          }}
        />
        <Flex
          direction="column"
          style={{
            gap: '5px',
            marginLeft: '10px',
          }}
        >
          <Text css={minPriceTextStyle}>최저가</Text>
          <Text css={minPriceNum}>
            {kmItem.minAmt.toLocaleString('KO') +
              '(' +
              ((kmItem.minAmt / kmItem.appraisalAmt) * 100).toFixed(0) +
              '%)'}
          </Text>
          <Flex direction="row">
            <Text css={appraisalAmtNum}>감정가</Text>
            <Spacing direction="horizontal" size={5} />
            <Text css={appraisalAmt}>{useNum2Han(kmItem.appraisalAmt)}</Text>
          </Flex>
          <Flex direction="row">
            <Text css={appraisalAmtNum}>토지면적</Text>
            <Spacing direction="horizontal" size={5} />
            <Text css={appraisalAmt}>{kmItem.landArea}</Text>
          </Flex>
          <Flex direction="row" css={SpecialText}></Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Km

const ContainerStyle = css`
  display: flex;
  position: relative;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  gap: 10px;
  padding: 10px;
  width: calc(100% - 20px);
  height: 208px;
  flex-shrink: 0;
`

const ListLeftStyle = css`
  width: 90%;
`
const LeftTextStyle = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-family: SUIT;
  font-size: 16.5px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: -0.165px;
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
  width: 80px;
  padding: 5px 2px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 3px;
  border: 0.5px solid #f00;
  background: #fff;
  height: 15px;
`

import Interest from '@/components/icons/Interest'
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import { Form } from '@/models/Form'
import { Items } from '@/models/ListItems'
import { css } from '@emotion/react'
import Header from './Header'
import Text from '@/components/shared/Text'
import styled from '@emotion/styled'
import Image from 'next/image'
import ListSkeleton from './Skeleton'
import Skeleton from '@/components/shared/Skeleton'
import { useEffect, useState } from 'react'

interface ResultProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  listItems: Items | null
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
}

function Result({
  formData,
  setFormData,
  listItems,
  isOpen,
  setIsOpen,
  isLoading,
}: ResultProps) {
  console.log('listItems', listItems)
  const pathUrl = 'https://www.ggi.co.kr'
  return (
    <Flex
      direction="column"
      justify="start"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        listItems={listItems}
        isLoading={isLoading}
      />
      <Flex
        direction="column"
        style={{
          height: isOpen ? 'calc(100% - 35px)' : '0px',
          display: 'flex',
          position: 'relative',
          overflowY: 'scroll',
        }}
      >
        {listItems?.kmItems.map((item, index) =>
          isLoading ? (
            <ListSkeleton key={index} />
          ) : (
            <Flex
              key={index}
              direction="column"
              style={{
                display: 'flex',
                position: 'relative',
                borderBottom: '1px solid #e0e0e0',
                background: '#fff',
                gap: '10px',
                padding: '10px',
                width: 'calc(100% - 20px)',
                height: '208px',
                flexShrink: 0,
              }}
            >
              <ListRow
                left={<LeftTextStyle color="#0038FF">경매</LeftTextStyle>}
                contents={
                  <LeftTextStyle color="#000">{item.caseNo}</LeftTextStyle>
                }
                right={<Interest interest={item.interest} />}
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
                  src={pathUrl + item.path}
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
                    {item.minAmt.toLocaleString('KO') +
                      '(' +
                      ((item.minAmt / item.appraisalAmt) * 100).toFixed(0) +
                      '%)'}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          ),
        )}
      </Flex>
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  position: relative;
  width: 350px;
  heght: 200px;
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  top: 0px;
  overflow: hidden;
  padding: 10px;
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

export default Result

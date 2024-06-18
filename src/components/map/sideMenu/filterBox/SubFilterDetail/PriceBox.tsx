import Flex from '@/components/shared/Flex'
import PriceRange from '@/components/shared/PriceRange'
import Text from '@/components/shared/Text'
import { PRICE } from '@/constants/SubFilter'
import { Form } from '@/models/Form'
import { formDataAtom } from '@/store/atom/map'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'

interface PriceBoxProps {
  fromToAppraisalPrice: number[]
  setFromToAppraisalPrice: React.Dispatch<React.SetStateAction<number[]>>
}

export default function PriceBox({
  fromToAppraisalPrice,
  setFromToAppraisalPrice,
}: PriceBoxProps) {
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const handlefromToAppraisalPrice = (price: number) => {
    if (fromToAppraisalPrice[0] === 0 && fromToAppraisalPrice[1] === 0) {
      setFromToAppraisalPrice([0, price])
      setFormData({
        ...formData,
        toAppraisalAmount: price,
      })
    } else if (
      fromToAppraisalPrice[0] === 0 &&
      fromToAppraisalPrice[1] !== 0 &&
      price < fromToAppraisalPrice[1]
    ) {
      setFromToAppraisalPrice([price, fromToAppraisalPrice[1]])
      setFormData({
        ...formData,
        toAppraisalAmount: fromToAppraisalPrice[1],
        fromAppraisalAmount: price,
      })
    } else if (fromToAppraisalPrice[0] !== 0 && fromToAppraisalPrice[1] !== 0) {
      setFromToAppraisalPrice([0, price])
      setFormData({
        ...formData,
        toAppraisalAmount: price,
        fromAppraisalAmount: 0,
      })
    } else if (fromToAppraisalPrice[0] !== 0 && fromToAppraisalPrice[1] === 0) {
      setFromToAppraisalPrice([fromToAppraisalPrice[0], price])
      setFormData({
        ...formData,
        fromAppraisalAmount: fromToAppraisalPrice[0],
        toAppraisalAmount: price,
      })
    } else if (fromToAppraisalPrice[0] === price) {
      setFromToAppraisalPrice([0, 0])
      setFormData({
        ...formData,
        fromAppraisalAmount: 0,
        toAppraisalAmount: 0,
      })
    } else if (
      fromToAppraisalPrice[0] === 0 &&
      fromToAppraisalPrice[1] !== 0 &&
      price > fromToAppraisalPrice[1]
    ) {
      setFromToAppraisalPrice([fromToAppraisalPrice[1], price])
      setFormData({
        ...formData,
        fromAppraisalAmount: fromToAppraisalPrice[1],
        toAppraisalAmount: price,
      })
    }
  }
  return (
    <Flex
      justify="start"
      direction="column"
      align="center"
      css={ContainerStyle}
    >
      <FlexContainer>
        {Object.values(PRICE).map((value, index) => (
          <React.Fragment key={index}>
            <FlexItem
              style={{
                borderLeft: `${
                  formData.fromAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index]) ||
                  formData.toAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index]) ||
                  formData.fromAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index - 1]) ||
                  (formData.toAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index - 1]) &&
                    formData.toAppraisalAmount !== 300000000)
                    ? '1px solid #007AFF'
                    : formData.fromAppraisalAmount !== 0 &&
                      formData.fromAppraisalAmount <
                        parseInt(Object.keys(PRICE)[index]) &&
                      formData.toAppraisalAmount >=
                        parseInt(Object.keys(PRICE)[index])
                    ? '1px solid #007AFF'
                    : '1px solid #e5e5e5'
                }`,
                borderTop: `${
                  index <= 3
                    ? formData.fromAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index]) ||
                      formData.toAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : formData.fromAppraisalAmount !== 0 &&
                        formData.fromAppraisalAmount <
                          parseInt(Object.keys(PRICE)[index]) &&
                        formData.toAppraisalAmount >=
                          parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : '1px solid #e5e5e5'
                    : index >= 4
                    ? formData.fromAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index]) ||
                      formData.toAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : formData.fromAppraisalAmount !== 0 &&
                        formData.fromAppraisalAmount <
                          parseInt(Object.keys(PRICE)[index]) &&
                        formData.toAppraisalAmount >=
                          parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : formData.fromAppraisalAmount ===
                          parseInt(Object.keys(PRICE)[index - 4]) ||
                        formData.toAppraisalAmount ===
                          parseInt(Object.keys(PRICE)[index - 4])
                      ? '1px solid #007AFF'
                      : formData.fromAppraisalAmount !== 0 &&
                        formData.fromAppraisalAmount <
                          parseInt(Object.keys(PRICE)[index - 4]) &&
                        formData.toAppraisalAmount >=
                          parseInt(Object.keys(PRICE)[index - 4]) &&
                        formData.fromAppraisalAmount !==
                          parseInt(Object.keys(PRICE)[index - 4]) &&
                        formData.toAppraisalAmount !==
                          parseInt(Object.keys(PRICE)[index - 4])
                      ? '1px solid #007AFF'
                      : '1px solid #e5e5e5'
                    : ''
                }`,
                borderRight: `${
                  index === 3
                    ? formData.fromAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index]) ||
                      formData.toAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : formData.fromAppraisalAmount !== 0 &&
                        formData.fromAppraisalAmount <
                          parseInt(Object.keys(PRICE)[index]) &&
                        formData.toAppraisalAmount >=
                          parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : '1px solid #e5e5e5'
                    : index === 7
                    ? formData.fromAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index]) ||
                      formData.toAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : formData.fromAppraisalAmount !== 0 &&
                        formData.fromAppraisalAmount <
                          parseInt(Object.keys(PRICE)[index]) &&
                        formData.toAppraisalAmount >=
                          parseInt(Object.keys(PRICE)[index])
                      ? '1px solid #007AFF'
                      : '1px solid #e5e5e5'
                    : ''
                }`,
                borderBottom: `${
                  index <= 3
                    ? ''
                    : formData.fromAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index]) ||
                      formData.toAppraisalAmount ===
                        parseInt(Object.keys(PRICE)[index])
                    ? '1px solid #007AFF'
                    : formData.fromAppraisalAmount !== 0 &&
                      formData.fromAppraisalAmount <
                        parseInt(Object.keys(PRICE)[index]) &&
                      formData.toAppraisalAmount >=
                        parseInt(Object.keys(PRICE)[index])
                    ? '1px solid #007AFF'
                    : '1px solid #e5e5e5'
                }`,
                backgroundColor: `${
                  formData.fromAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index]) ||
                  formData.toAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index])
                    ? '#F0F0FF'
                    : formData.fromAppraisalAmount !== 0 &&
                      formData.fromAppraisalAmount <
                        parseInt(Object.keys(PRICE)[index]) &&
                      formData.toAppraisalAmount >=
                        parseInt(Object.keys(PRICE)[index])
                    ? '#F0F0FF'
                    : 'white'
                }`,
              }}
              onClick={() => {
                handlefromToAppraisalPrice(parseInt(Object.keys(PRICE)[index]))
              }}
            >
              <Text
                fontWeight="500"
                typography="t5"
                style={{
                  color: `${
                    formData.fromAppraisalAmount ===
                      parseInt(Object.keys(PRICE)[index]) ||
                    formData.toAppraisalAmount ===
                      parseInt(Object.keys(PRICE)[index])
                      ? '#007AFF'
                      : formData.fromAppraisalAmount !== 0 &&
                        formData.fromAppraisalAmount <
                          parseInt(Object.keys(PRICE)[index]) &&
                        formData.toAppraisalAmount >=
                          parseInt(Object.keys(PRICE)[index])
                      ? '#007AFF'
                      : 'black'
                  }`,
                }}
              >
                {value}
              </Text>
            </FlexItem>
            {(index + 1) % 4 === 0 && <br />}
          </React.Fragment>
        ))}
      </FlexContainer>
      <PriceRange formData={formData} setFormData={setFormData} />
    </Flex>
  )
}

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const FlexItem = styled.div`
  display: flex;
  width: 80px;
  height: 45px;
  flex: 1 0 21%;
  padding: 8px 8px 8px 4px;
  justify-content: center;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
  cursor: pointer;
  box-sizing: border-box;
`

const ContainerStyle = css`
  display: flex;
  width: 100%;
  background-color: white;
`

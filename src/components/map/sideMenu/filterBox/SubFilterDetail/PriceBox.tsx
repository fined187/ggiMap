import Flex from '@/components/shared/Flex'
import PriceRange from '@/components/shared/PriceRange'
import Text from '@/components/shared/Text'
import { PRICE } from '@/constants/SubFilter'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { useState } from 'react'

interface PriceBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function PriceBox({ formData, setFormData }: PriceBoxProps) {
  const [fromToPrice, setFromToPrice] = useState([0, 0])
  const handleFromToPrice = (price: number) => {
    if (fromToPrice[0] === 0 && fromToPrice[1] === 0) {
      setFromToPrice([0, price])
      setFormData({
        ...formData,
        toAppraisalAmount: price,
      })
    } else if (
      fromToPrice[0] === 0 &&
      fromToPrice[1] !== 0 &&
      price < fromToPrice[1]
    ) {
      setFromToPrice([price, fromToPrice[1]])
      setFormData({
        ...formData,
        toAppraisalAmount: fromToPrice[1],
        fromAppraisalAmount: price,
      })
    } else if (fromToPrice[0] !== 0 && fromToPrice[1] !== 0) {
      setFromToPrice([0, price])
      setFormData({
        ...formData,
        toAppraisalAmount: price,
        fromAppraisalAmount: 0,
      })
    } else if (fromToPrice[0] !== 0 && fromToPrice[1] === 0) {
      setFromToPrice([fromToPrice[0], price])
      setFormData({
        ...formData,
        fromAppraisalAmount: fromToPrice[0],
        toAppraisalAmount: price,
      })
    } else if (fromToPrice[0] === price) {
      setFromToPrice([0, 0])
      setFormData({
        ...formData,
        fromAppraisalAmount: 0,
        toAppraisalAmount: 0,
      })
    } else if (
      fromToPrice[0] === 0 &&
      fromToPrice[1] !== 0 &&
      price > fromToPrice[1]
    ) {
      setFromToPrice([fromToPrice[1], price])
      setFormData({
        ...formData,
        fromAppraisalAmount: fromToPrice[1],
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
      <Flex direction="row" justify="center">
        {Object.values(PRICE)
          .slice(0, 4)
          .map((value, index) => (
            <Flex
              key={index}
              css={BoxStyle}
              style={{
                border: `${
                  formData.fromAppraisalAmount ===
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
                handleFromToPrice(parseInt(Object.keys(PRICE)[index]))
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
            </Flex>
          ))}
      </Flex>
      <Flex direction="row" justify="center">
        {Object.values(PRICE)
          .slice(4, 8)
          .map((value, index) => (
            <Flex
              key={index}
              css={BoxStyle}
              style={{
                border: `${
                  formData.fromAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index + 4]) ||
                  formData.toAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index + 4])
                    ? '1px solid #007AFF'
                    : formData.fromAppraisalAmount !== 0 &&
                      formData.fromAppraisalAmount <
                        parseInt(Object.keys(PRICE)[index + 4]) &&
                      formData.toAppraisalAmount >=
                        parseInt(Object.keys(PRICE)[index + 4])
                    ? '1px solid #007AFF'
                    : '1px solid #e5e5e5'
                }`,
                backgroundColor: `${
                  formData.fromAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index + 4]) ||
                  formData.toAppraisalAmount ===
                    parseInt(Object.keys(PRICE)[index + 4])
                    ? '#F0F0FF'
                    : formData.fromAppraisalAmount !== 0 &&
                      formData.fromAppraisalAmount <
                        parseInt(Object.keys(PRICE)[index + 4]) &&
                      formData.toAppraisalAmount >=
                        parseInt(Object.keys(PRICE)[index + 4])
                    ? '#F0F0FF'
                    : 'white'
                }`,
              }}
              onClick={() => {
                handleFromToPrice(parseInt(Object.keys(PRICE)[index + 4]))
              }}
            >
              <Text
                style={{
                  color: `${
                    formData.fromAppraisalAmount ===
                      parseInt(Object.keys(PRICE)[index + 4]) ||
                    formData.toAppraisalAmount ===
                      parseInt(Object.keys(PRICE)[index + 4])
                      ? '#007AFF'
                      : formData.fromAppraisalAmount !== 0 &&
                        formData.fromAppraisalAmount <
                          parseInt(Object.keys(PRICE)[index + 4]) &&
                        formData.toAppraisalAmount >=
                          parseInt(Object.keys(PRICE)[index + 4])
                      ? '#007AFF'
                      : 'black'
                  }`,
                }}
                fontWeight="500"
                typography="t5"
              >
                {value}
              </Text>
            </Flex>
          ))}
      </Flex>
      <PriceRange formData={formData} setFormData={setFormData} />
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  width: 100%;
  background-color: white;
`

const BoxStyle = css`
  display: flex;
  width: 80px;
  height: 45px;
  padding: 8px 8px 8px 4px;
  justify-content: center;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
  cursor: pointer;
`

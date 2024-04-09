import Flex from '@/components/shared/Flex'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { MULGUN, MULGUN_SUB } from '@/constants/SubFilter'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface FinishedBoxProps {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
}

interface GubunSelect {
  ekm: boolean
  egm: boolean
  egg: boolean
}

export default function FinishedBox({
  formData,
  setFormData,
}: FinishedBoxProps) {
  const [gubunSelect, setGubunSelect] = useState<GubunSelect>({
    ekm: false,
    egm: false,
    egg: false,
  })
  const [selectedValue, setSelectedValue] = useState<number>(0)
  const handleGubunBoxClick = (index: number) => {
    if (index === 0) {
      setFormData({
        ...formData,
        ekm: !formData.ekm,
      })
    } else if (index === 1) {
      setFormData({
        ...formData,
        egm: !formData.egm,
      })
    } else {
      setFormData({
        ...formData,
        egg: !formData.egg,
      })
    }
  }

  const handleFinishedBoxClick = (index: number) => {
    setFormData({
      ...formData,
      awardedMonths:
        formData.awardedMonths === Number(Object.keys(MULGUN)[index])
          ? 0
          : Number(Object.keys(MULGUN)[index]),
    })
  }

  return (
    <Flex justify="start" direction="column" css={ContainerStyle}>
      <Flex direction="column">
        <Flex justify="space-between">
          <Text typography="t4" fontWeight="700" color="black" textAlign="left">
            구분
          </Text>
          <Text
            typography="t6"
            fontWeight="500"
            color="textGray"
            textAlign="right"
          >
            낙찰 정보를 함께 표시합니다
          </Text>
        </Flex>
        <Flex>
          {Object.values(MULGUN_SUB).map((value, index) => {
            return (
              <Flex
                justify="center"
                align="center"
                key={index}
                css={BoxStyle}
                onClick={() => {
                  handleGubunBoxClick(index)
                }}
                style={{
                  border:
                    index === 0
                      ? formData.ekm
                        ? '1px solid #332EFC'
                        : '1px solid #E5E5E5'
                      : index === 1
                      ? formData.egm
                        ? '1px solid #332EFC'
                        : '1px solid #E5E5E5'
                      : formData.egg
                      ? '1px solid #332EFC'
                      : '1px solid #E5E5E5',
                  backgroundColor:
                    index === 0
                      ? formData.ekm
                        ? '#F0F0FF'
                        : 'white'
                      : index === 1
                      ? formData.egm
                        ? '#F0F0FF'
                        : 'white'
                      : formData.egg
                      ? '#F0F0FF'
                      : 'white',
                }}
              >
                <Text
                  fontWeight="500"
                  typography="t5"
                  style={{
                    color:
                      index === 0
                        ? formData.ekm
                          ? '#332EFC'
                          : 'black'
                        : index === 1
                        ? formData.egm
                          ? '#332EFC'
                          : 'black'
                        : formData.egg
                        ? '#332EFC'
                        : 'black',
                  }}
                >
                  {value}
                </Text>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
      <Spacing size={10} />
      <Flex direction="column">
        <Flex justify="start">
          <Text typography="t4" fontWeight="700" color="black" textAlign="left">
            기간
          </Text>
        </Flex>
        <Flex direction="row" justify="center">
          {Object.values(MULGUN)
            .slice(0, 3)
            .map((value, index) => (
              <Flex
                justify="center"
                align="center"
                key={index}
                css={BoxStyle}
                onClick={() => {
                  handleFinishedBoxClick(index)
                }}
                style={{
                  border:
                    formData.awardedMonths ===
                    Number(Object.keys(MULGUN)[index])
                      ? '1px solid #332EFC'
                      : '1px solid #E5E5E5',
                  backgroundColor:
                    formData.awardedMonths ===
                    Number(Object.keys(MULGUN)[index])
                      ? '#F0F0FF'
                      : 'white',
                }}
              >
                <Text
                  fontWeight="500"
                  typography="t5"
                  style={{
                    color:
                      formData.awardedMonths ===
                      Number(Object.keys(MULGUN)[index])
                        ? '#332EFC'
                        : 'black',
                  }}
                >
                  {value}
                </Text>
              </Flex>
            ))}
        </Flex>
        <Flex direction="row" justify="center">
          {Object.values(MULGUN)
            .slice(3, 6)
            .map((value, index) => (
              <Flex
                justify="center"
                align="center"
                key={index}
                css={BoxStyle}
                onClick={() => {
                  handleFinishedBoxClick(index + 3)
                }}
                style={{
                  border:
                    formData.awardedMonths ===
                    Number(Object.keys(MULGUN)[index + 3])
                      ? '1px solid #332EFC'
                      : '1px solid #E5E5E5',
                  backgroundColor:
                    formData.awardedMonths ===
                    Number(Object.keys(MULGUN)[index + 3])
                      ? '#F0F0FF'
                      : 'white',
                }}
              >
                <Text
                  fontWeight="500"
                  typography="t5"
                  style={{
                    color:
                      formData.awardedMonths ===
                      Number(Object.keys(MULGUN)[index + 3])
                        ? '#332EFC'
                        : 'black',
                  }}
                >
                  {value}
                </Text>
              </Flex>
            ))}
        </Flex>
      </Flex>
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
  border: 1px solid #e5e5e5;
  width: 110px;
  height: 40px;
  cursor: pointer;
`

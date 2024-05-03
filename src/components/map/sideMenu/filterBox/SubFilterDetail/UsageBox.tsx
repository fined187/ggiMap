import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { USAGE } from '@/constants/SubFilter'
import { Form } from '@/models/Form'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'

interface UsageBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function UsageBox({ formData, setFormData }: UsageBoxProps) {
  const handleAddUsage = (ids: number) => {
    if (formData.ids.includes(ids.toString())) {
      const index = formData.ids.indexOf(ids.toString())
      formData.ids.splice(index, 1)
    } else {
      formData.ids.push(ids.toString())
    }
    setFormData({ ...formData, ids: formData.ids })
  }

  return (
    <Flex justify="start" direction="column" align="center">
      <Flex direction="row" justify="center" css={ContainerStyle}>
        {Object.values(USAGE)
          .slice(1, 4)
          .map((value, index) => (
            <Flex
              key={index}
              css={BoxStyle}
              onClick={() => {
                handleAddUsage(Number(Object.keys(USAGE)[index + 1]))
              }}
              style={{
                backgroundColor: formData.ids.includes(
                  Object.keys(USAGE)[index + 1].toString(),
                )
                  ? `${colors.selectedUsageType}`
                  : 'white',
                border: formData.ids.includes(
                  Object.keys(USAGE)[index + 1].toString(),
                )
                  ? `1px solid ${colors.selectedFilter}`
                  : `1px solid ${colors.borderGray}`,
              }}
            >
              <Text
                fontWeight="500"
                typography="t5"
                color={
                  formData.ids.includes(
                    Object.keys(USAGE)[index + 1].toString(),
                  )
                    ? 'filterBlue'
                    : 'black'
                }
              >
                {value}
              </Text>
            </Flex>
          ))}
      </Flex>
      <Flex direction="row" justify="center" css={ContainerStyle}>
        {Object.values(USAGE)
          .slice(4, 7)
          .map((value, index) => (
            <Flex
              key={index}
              css={BoxStyle}
              onClick={() => {
                handleAddUsage(Number(Object.keys(USAGE)[index + 4]))
              }}
              style={{
                backgroundColor: formData.ids.includes(
                  Object.keys(USAGE)[index + 4].toString(),
                )
                  ? `${colors.selectedUsageType}`
                  : 'white',
                border: formData.ids.includes(
                  Object.keys(USAGE)[index + 4].toString(),
                )
                  ? `1px solid ${colors.selectedFilter}`
                  : `1px solid ${colors.borderGray}`,
              }}
            >
              <Text
                fontWeight="500"
                typography="t5"
                color={
                  formData.ids.includes(
                    Object.keys(USAGE)[index + 4].toString(),
                  )
                    ? 'filterBlue'
                    : 'black'
                }
              >
                {value}
              </Text>
            </Flex>
          ))}
      </Flex>
      <Flex direction="row" justify="center" css={ContainerStyle}>
        {Object.values(USAGE)
          .slice(7, 10)
          .map((value, index) => (
            <Flex
              key={index}
              css={BoxStyle}
              onClick={() => {
                handleAddUsage(Number(Object.keys(USAGE)[index + 7]))
              }}
              style={{
                backgroundColor: formData.ids.includes(
                  Object.keys(USAGE)[index + 7].toString(),
                )
                  ? `${colors.selectedUsageType}`
                  : 'white',
                border: formData.ids.includes(
                  Object.keys(USAGE)[index + 7].toString(),
                )
                  ? `1px solid ${colors.selectedFilter}`
                  : `1px solid ${colors.borderGray}`,
              }}
            >
              <Text
                fontWeight="500"
                typography="t5"
                color={
                  formData.ids.includes(
                    Object.keys(USAGE)[index + 7].toString(),
                  )
                    ? 'filterBlue'
                    : 'black'
                }
              >
                {value}
              </Text>
            </Flex>
          ))}
      </Flex>
      <Flex direction="row" justify="center" css={ContainerStyle}>
        {Object.values(USAGE)
          .slice(10, 13)
          .map((value, index) => (
            <Flex
              key={index}
              css={BoxStyle}
              style={{
                backgroundColor: formData.ids.includes(
                  Object.keys(USAGE)[index + 10].toString(),
                )
                  ? `${colors.selectedUsageType}`
                  : 'white',
                border: formData.ids.includes(
                  Object.keys(USAGE)[index + 10].toString(),
                )
                  ? `1px solid ${colors.selectedFilter}`
                  : `1px solid ${colors.borderGray}`,
              }}
              onClick={() => {
                handleAddUsage(Number(Object.keys(USAGE)[index + 10]))
              }}
            >
              <Text
                fontWeight="500"
                typography="t5"
                color={
                  formData.ids.includes(
                    Object.keys(USAGE)[index + 10].toString(),
                  )
                    ? 'filterBlue'
                    : 'black'
                }
              >
                {value}
              </Text>
            </Flex>
          ))}
      </Flex>
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  width: 100%;
  height: 40px;
  background-color: white;
`

const BoxStyle = css`
  display: flex;
  width: 110px;
  height: 45px;
  padding: 8px 8px 8px 4px;
  justify-content: center;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
  cursor: pointer;
`

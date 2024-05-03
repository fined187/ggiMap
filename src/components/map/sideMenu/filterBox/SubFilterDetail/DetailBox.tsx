import Flex from '@/components/shared/Flex'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import FinishedBox from './FinishedBox'
import LowPriceBox from './LowPriceBox'
import PriceBox from './PriceBox'
import UsageBox from './UsageBox'
import SelectAll from '@/components/map/icons/SelectAll'
import Reset from '@/components/map/icons/Reset'

interface SearchBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  isBoxOpen: {
    finished: boolean
    usage: boolean
    lowPrice: boolean
    price: boolean
  }
  setIsBoxOpen: React.Dispatch<
    React.SetStateAction<{
      finished: boolean
      usage: boolean
      lowPrice: boolean
      price: boolean
    }>
  >
}

export default function DetailBox({
  formData,
  setFormData,
  isBoxOpen,
  setIsBoxOpen,
}: SearchBoxProps) {
  return (
    <Flex
      css={ContainerStyle}
      direction="column"
      style={{
        gap: '10px',
        position: 'relative',
        height: `${
          formData.lastFilter === 1
            ? '220px'
            : formData.lastFilter === 2
            ? '250px'
            : formData.lastFilter === 3
            ? '210px'
            : formData.lastFilter === 4
            ? '210px'
            : '0px'
        }`,
      }}
    >
      {formData.lastFilter === 1 || formData.lastFilter === 0 ? null : (
        <SelectAll
          formData={formData}
          setFormData={setFormData}
          type={formData.lastFilter}
        />
      )}
      {isBoxOpen.usage && (
        <UsageBox formData={formData} setFormData={setFormData} />
      )}
      {isBoxOpen.price && (
        <PriceBox formData={formData} setFormData={setFormData} />
      )}
      {isBoxOpen.lowPrice && (
        <LowPriceBox formData={formData} setFormData={setFormData} />
      )}
      {isBoxOpen.finished && (
        <FinishedBox formData={formData} setFormData={setFormData} />
      )}
      {!isBoxOpen.usage &&
      !isBoxOpen.price &&
      !isBoxOpen.lowPrice &&
      !isBoxOpen.finished ? null : (
        <Flex direction="row" justify="right" css={ResetStyle}>
          <Text typography="t6" fontWeight="600" textAlign="center">
            초기화
          </Text>
          <Flex
            style={{
              cursor: 'pointer',
            }}
          >
            <Reset formData={formData} setFormData={setFormData} />
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

const ContainerStyle = css`
  background-color: white;
  width: 100%;
  margin-top: 10px;
  transition: all 0.3s ease-in-out;
`
const ResetStyle = css`
  display: flex;
  gap: 5px;
  position: absolute;
  bottom: 10px;
  right: 7px;
`

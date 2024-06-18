import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import FinishedBox from './FinishedBox'
import LowPriceBox from './LowPriceBox'
import PriceBox from './PriceBox'
import UsageBox from './UsageBox'
import SelectAll from '@/components/map/icons/SelectAll'
import Reset from '@/components/map/icons/Reset'
import { useRecoilState } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import { useState } from 'react'

interface SearchBoxProps {
  isBoxOpen: {
    finished: boolean
    usage: boolean
    lowPrice: boolean
    price: boolean
  }
}

export default function DetailBox({ isBoxOpen }: SearchBoxProps) {
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [fromToAppraisalPrice, setFromToAppraisalPrice] = useState([0, 0])
  const [fromToMinPrice, setFromToMinPrice] = useState([0, 0])
  const handleReset = () => {
    if (formData.lastFilter === 2) {
      setFormData((prev) => {
        return {
          ...prev,
          ids: [],
        }
      })
    } else if (formData.lastFilter === 3) {
      setFormData((prev) => {
        return {
          ...prev,
          fromAppraisalAmount: 0,
          toAppraisalAmount: 0,
        }
      })
      setFromToAppraisalPrice([0, 0])
    } else if (formData.lastFilter === 4) {
      setFormData((prev) => {
        return {
          ...prev,
          fromMinimumAmount: 0,
          toMinimumAmount: 0,
        }
      })
      setFromToMinPrice([0, 0])
    } else if (formData.lastFilter === 1) {
      setFormData((prev) => {
        return {
          ...prev,
          ekm: false,
          egm: false,
          egg: false,
          awardedMonths: 0,
        }
      })
    }
  }
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
        <SelectAll type={formData.lastFilter} />
      )}
      {isBoxOpen.usage && <UsageBox />}
      {isBoxOpen.price && (
        <PriceBox
          fromToAppraisalPrice={fromToAppraisalPrice}
          setFromToAppraisalPrice={setFromToAppraisalPrice}
        />
      )}
      {isBoxOpen.lowPrice && (
        <LowPriceBox
          fromToMinPrice={fromToMinPrice}
          setFromToMinPrice={setFromToMinPrice}
        />
      )}
      {isBoxOpen.finished && <FinishedBox />}
      {!isBoxOpen.usage &&
      !isBoxOpen.price &&
      !isBoxOpen.lowPrice &&
      !isBoxOpen.finished ? null : (
        <Flex
          direction="row"
          justify="right"
          css={ResetStyle}
          style={{
            cursor: 'pointer',
          }}
          onClick={handleReset}
        >
          <Text typography="t6" fontWeight="600" textAlign="center">
            초기화
          </Text>
          <Flex>
            <Reset />
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

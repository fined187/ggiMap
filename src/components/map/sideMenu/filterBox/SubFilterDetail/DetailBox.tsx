import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
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
    setFormData((prev) => {
      return {
        ...prev,
        ekm: false,
        egm: false,
        egg: false,
        awardedMonths: 0,
        ids: ['2', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14'],
        fromAppraisalAmount: 0,
        toAppraisalAmount: 0,
        fromMinimumAmount: 0,
        toMinimumAmount: 0,
      }
    })
    setFromToAppraisalPrice([0, 0])
    setFromToMinPrice([0, 0])
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
            ? '210px'
            : formData.lastFilter === 2
            ? '220px'
            : formData.lastFilter === 3
            ? '180px'
            : formData.lastFilter === 4
            ? '180px'
            : '0px'
        }`,
      }}
    >
      {formData.lastFilter === 1 || formData.lastFilter === 0 ? null : (
        <Flex justify="space-between">
          <SelectAll type={formData.lastFilter} />
          <Flex onClick={handleReset}>
            <Reset />
          </Flex>
        </Flex>
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
      {isBoxOpen.finished && <FinishedBox handleReset={handleReset} />}
    </Flex>
  )
}

const ContainerStyle = css`
  background-color: white;
  width: 100%;
  margin-top: 10px;
  transition: all 0.3s ease-in-out;
`

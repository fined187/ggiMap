import Flex from '@/components/shared/Flex'
import { SUBFILTERS } from '@/constants'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { useEffect } from 'react'
import SubFilterProps from './SubFilterProps'
import Arrow from '../../icons/Arrow'

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

export default function SubFilter({
  formData,
  setFormData,
  isBoxOpen,
  setIsBoxOpen,
}: SearchBoxProps) {
  useEffect(() => {
    if (
      !isBoxOpen.usage &&
      !isBoxOpen.price &&
      !isBoxOpen.lowPrice &&
      !isBoxOpen.finished
    ) {
      setFormData({
        ...formData,
        lastFilter: 0,
        isSubFilterBoxOpen: false,
      })
    } else {
      setFormData({
        ...formData,
        isSubFilterBoxOpen: true,
      })
    }
  }, [isBoxOpen.usage, isBoxOpen.price, isBoxOpen.lowPrice, isBoxOpen.finished])
  return (
    <Flex direction="row" align="center" justify="center" css={ContainerStyle}>
      <SubFilterProps
        isSelected={
          isBoxOpen.finished ||
          formData.awardedMonths > 0 ||
          formData.egg ||
          formData.egm ||
          formData.ekm
        }
        checkedColor="#007AFF"
        textType={SUBFILTERS.FINISHED}
        onButtonClick={() => {
          setIsBoxOpen({
            usage: false,
            lowPrice: false,
            price: false,
            finished: !isBoxOpen.finished,
          })
          setFormData({
            ...formData,
            lastFilter: 1,
          })
        }}
      />
      <SubFilterProps
        isSelected={isBoxOpen.usage || formData.ids.length > 0}
        checkedColor="#007AFF"
        textType={SUBFILTERS.USAGE}
        onButtonClick={() => {
          setIsBoxOpen({
            finished: false,
            lowPrice: false,
            price: false,
            usage: !isBoxOpen.usage,
          })
          setFormData({
            ...formData,
            lastFilter: 2,
          })
        }}
      />
      <SubFilterProps
        isSelected={isBoxOpen.price || formData.toAppraisalAmount > 0}
        checkedColor="#007AFF"
        textType={SUBFILTERS.PRCIE}
        onButtonClick={() => {
          setIsBoxOpen({
            lowPrice: false,
            usage: false,
            finished: false,
            price: !isBoxOpen.price,
          })
          setFormData({
            ...formData,
            lastFilter: 3,
          })
        }}
      />
      <SubFilterProps
        isSelected={isBoxOpen.lowPrice || formData.toMinimumAmount > 0}
        checkedColor="#007AFF"
        textType={SUBFILTERS.LOW_PRICE}
        onButtonClick={() => {
          setIsBoxOpen({
            usage: false,
            finished: false,
            price: false,
            lowPrice: !isBoxOpen.lowPrice,
          })
          setFormData({
            ...formData,
            lastFilter: 4,
          })
        }}
      />
      <Arrow
        isOpenArrow={formData.isSubFilterBoxOpen}
        setIsOpenArrow={setFormData}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  padding: 10px;
  background-color: #f9f9f9;
  width: 95%;
  height: 40px;
  gap: 5px;
  transition: all 0.3s ease-in-out;
`

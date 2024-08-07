import Flex from '@/components/shared/Flex'
import { SUBFILTERS } from '@/constants'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import SubFilterProps from './SubFilterProps'
import Arrow from '../../icons/Arrow'
import { MAP_KEY } from '../../sections/hooks/useMap'
import { UseQueryResult, useQuery } from 'react-query'
import { NaverMap } from '@/models/Map'

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
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
}

export default function SubFilter({
  formData,
  setFormData,
  isBoxOpen,
  setIsBoxOpen,
  setOpenOverlay,
}: SearchBoxProps) {
  const [nowChecked, setNowChecked] = useState(1)
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })
  useEffect(() => {
    if (
      !isBoxOpen.usage &&
      !isBoxOpen.price &&
      !isBoxOpen.lowPrice &&
      !isBoxOpen.finished
    ) {
      setFormData((prev) => {
        return {
          ...prev,
          isSubFilterBoxOpen: false,
        }
      })
    } else if (nowChecked !== 2 && map && map?.getZoom() < 15) {
      setFormData({
        ...formData,
        isSubFilterBoxOpen: false,
      })
    } else {
      setFormData({
        ...formData,
        isSubFilterBoxOpen: true,
      })
    }
  }, [
    isBoxOpen.usage,
    isBoxOpen.price,
    isBoxOpen.lowPrice,
    isBoxOpen.finished,
    map?.getZoom(),
  ])
  return (
    <Flex
      direction="row"
      align="center"
      justify="center"
      css={ContainerStyle}
      onClick={() => {
        setOpenOverlay(false)
      }}
    >
      <SubFilterProps
        isSelected={
          formData.awardedMonths > 0 ||
          formData.egg ||
          formData.egm ||
          formData.ekm
        }
        nowChecked={nowChecked === 1}
        isBoxOpen={isBoxOpen.finished}
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
          setNowChecked(1)
        }}
      />
      <SubFilterProps
        isSelected={formData.ids.length > 0}
        checkedColor="#007AFF"
        textType={SUBFILTERS.USAGE}
        nowChecked={nowChecked === 2}
        isBoxOpen={isBoxOpen.usage}
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
          setNowChecked(2)
        }}
      />
      <SubFilterProps
        isSelected={
          formData.toAppraisalAmount > 0 || formData.fromAppraisalAmount > 0
        }
        checkedColor="#007AFF"
        nowChecked={nowChecked === 3}
        textType={SUBFILTERS.PRCIE}
        isBoxOpen={isBoxOpen.price}
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
          setNowChecked(3)
        }}
      />
      <SubFilterProps
        isSelected={
          formData.toMinimumAmount > 0 || formData.fromMinimumAmount > 0
        }
        checkedColor="#007AFF"
        nowChecked={nowChecked === 4}
        textType={SUBFILTERS.LOW_PRICE}
        isBoxOpen={isBoxOpen.lowPrice}
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
          setNowChecked(4)
        }}
      />
      <Arrow
        isOpenArrow={formData.isSubFilterBoxOpen}
        setIsOpenArrow={setFormData}
        setIsBoxOpen={setIsBoxOpen}
        formData={formData}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  padding: 10px;
  background-color: #f9f9f9;
  width: 100%;
  height: 40px;
  gap: 5px;
  transition: all 0.3s ease-in-out;
  z-index: 100;
`

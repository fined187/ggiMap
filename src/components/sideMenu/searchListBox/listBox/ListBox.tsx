import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { Suspense, useEffect, useState } from 'react'
import Header from './Header'
import Result from './Result'
import { usePostListItems } from '../hooks/usePostListItems'
import { ListData } from '@/models/MapItem'
import { Items } from '@/models/ListItems'
import InfiniteScroll from 'react-infinite-scroller'
import { useInfiniteQuery } from 'react-query'
import postListItems from '@/remote/items/postListItems'

interface ListBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function ListBox({ formData, setFormData }: ListBoxProps) {
  const mapData: ListData = {
    ids:
      formData.ids.length === 12 ? '0' : formData.ids.map((id) => id).join(','),
    fromAppraisalAmount: formData.fromAppraisalAmount,
    toAppraisalAmount: formData.toAppraisalAmount,
    fromMinimumAmount: formData.fromMinimumAmount,
    toMinimumAmount: formData.toMinimumAmount,
    interests: formData.interests,
    x1: formData.x1,
    y1: formData.y1,
    x2: formData.x2,
    y2: formData.y2,
    awardedMonths: formData.awardedMonths,
    userId: formData.userId,
    km: formData.km,
    kw: formData.kw,
    gm: formData.gm,
    gg: formData.gg,
    ekm: formData.ekm,
    egm: formData.egm,
    egg: formData.egg,
  }
  const [isOpen, setIsOpen] = useState(false)
  const [listItems, setListItems] = useState<Items | null>(null)

  const { mutate: list, isLoading } = usePostListItems(mapData, setListItems)
  useEffect(() => {
    list()
  }, [formData])

  return (
    <Flex
      css={ContainerStyle}
      direction="column"
      style={{
        height: isOpen
          ? formData.lastFilter === 1 && formData.isSubFilterBoxOpen
            ? '490px'
            : formData.lastFilter === 2 && formData.isSubFilterBoxOpen
            ? '440px'
            : formData.lastFilter === 3 && formData.isSubFilterBoxOpen
            ? '500px'
            : formData.lastFilter === 4 && formData.isSubFilterBoxOpen
            ? '500px'
            : '710px'
          : '70px',
      }}
    >
      <Result
        formData={formData}
        setFormData={setFormData}
        listItems={listItems}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoading={isLoading}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  width: 370px;
  z-index: 10;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  background-color: white;
  position: relative;
  top: 1%;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
`

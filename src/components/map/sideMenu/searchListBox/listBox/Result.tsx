/* eslint-disable react-hooks/exhaustive-deps */
import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import { Items } from '@/models/ListItems'
import Header from './Header'
import styled from '@emotion/styled'
import ListSkeleton from './Skeleton'
import Km from './items/KmItems'
import Text from '@/components/shared/Text'
import React, { useEffect, useState } from 'react'
import { usePostListItems } from '../hooks/usePostListItems'
import { ListData } from '@/models/MapItem'
import Gmg from './items/GmgItems'
import Kw from './items/KwItems'

interface ResultProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function Result({ formData, setFormData, isOpen, setIsOpen }: ResultProps) {
  const [listItems, setListItems] = useState<Items | null>(null)
  const [showingList, setShowingList] = useState(false)

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
  const { mutate: list, isLoading } = usePostListItems(mapData, setListItems)

  useEffect(() => {
    if (formData.map.zoom! >= 15) {
      setShowingList(true)
      list()
    } else {
      setShowingList(false)
      setIsOpen(true)
    }
  }, [
    formData.map.zoom,
    formData.ids,
    formData.km,
    formData.gg,
    formData.gm,
    formData.kw,
    formData.ekm,
    formData.egg,
    formData.egm,
    formData.fromAppraisalAmount,
    formData.toAppraisalAmount,
    formData.fromMinimumAmount,
    formData.toMinimumAmount,
    formData.awardedMonths,
    formData.x1,
    formData.y1,
    formData.x2,
    formData.y2,
  ])

  return (
    <Flex
      direction="column"
      justify="start"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {showingList ? (
        <>
          <Header
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            formData={formData}
            setFormData={setFormData}
            listItems={listItems}
            isLoading={isLoading}
          />
          <Container isOpen={isOpen}>
            {listItems
              ? listItems?.kmItems?.map((item, index) =>
                  isLoading ? (
                    <ListSkeleton key={index} />
                  ) : (
                    <Km key={index} kmItem={item} />
                  ),
                )
              : null}
            {listItems
              ? listItems?.kwItems?.map((item, index) =>
                  isLoading ? (
                    <ListSkeleton key={index} />
                  ) : (
                    <Kw key={index} kwItem={item} />
                  ),
                )
              : null}
            {listItems
              ? listItems?.gmgItems?.map((item, index) =>
                  isLoading ? (
                    <ListSkeleton key={index} />
                  ) : (
                    <Gmg key={index} gmgItem={item} />
                  ),
                )
              : null}
          </Container>
        </>
      ) : (
        <>
          <Header
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            formData={formData}
            setFormData={setFormData}
            listItems={listItems}
            isLoading={isLoading}
          />
          <ContainerNone isOpen={true}>
            <Text>
              읍면동이상의 축소에서는 매물종류(경매/예정/공매)와
              <br />
              용도로만 검색됩니다.
            </Text>
          </ContainerNone>
        </>
      )}
    </Flex>
  )
}

const ContainerNone = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? 'calc(100% - 35px)' : '0px')};
  padding: 10px;
  display: flex;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Container = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? 'calc(100% - 50px)' : '0px')};
  display: flex;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
`

export default Result

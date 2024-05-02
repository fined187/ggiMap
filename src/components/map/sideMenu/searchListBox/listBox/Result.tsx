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
import { css } from '@emotion/react'
import Spacing from '@/components/shared/Spacing'

interface ResultProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function Result({ formData, setFormData, isOpen, setIsOpen }: ResultProps) {
  const [listItems, setListItems] = useState<Items | null>(null)
  const [showingList, setShowingList] = useState(false)

  const { mutate: list, isLoading } = usePostListItems(formData, setListItems)

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
    formData.interests,
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
            <Spacing size={20} />
            <Text css={NoResultText}>
              500m 이상에서는 매물 종류(경매/예정/공매)
              <br />와 용도로만 필터링 할 수 있습니다.
            </Text>
          </ContainerNone>
        </>
      )}
    </Flex>
  )
}

const ContainerNone = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? 'calc(100% - 60px)' : '0px')};
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: start;
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

const NoResultText = css`
  color: #545454;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  letter-spacing: -0.16px;
`

export default Result

/* eslint-disable react-hooks/exhaustive-deps */
import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import Header from './Header'
import styled from '@emotion/styled'
import ListSkeleton from './Skeleton'
import Text from '@/components/shared/Text'
import React, { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import Spacing from '@/components/shared/Spacing'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { ListData, MapItems } from '@/models/MapItem'
import Forms from './items/Form'
import InfiniteScroll from 'react-infinite-scroll-component'
import useSearchListQuery from './hooks/useSearchListQuery'

interface ResultProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setListItems: React.Dispatch<React.SetStateAction<MapItems[] | null>>
  listItems?: MapItems[] | null
}

const ROWS_PER_PAGE = 10

function Result({
  formData,
  setFormData,
  isOpen,
  setIsOpen,
  setListItems,
  listItems,
}: ResultProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [showingList, setShowingList] = useState(false)
  const [page, setPage] = useState(1)
  const scrollbarsRef = useRef<HTMLDivElement | null>(null)
  const [mapData, setMapData] = useState<ListData>({
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
    km: formData.km,
    kw: formData.kw,
    gm: formData.gm,
    gg: formData.gg,
    ekm: formData.ekm,
    egm: formData.egm,
    egg: formData.egg,
  })

  const { data, fetchNextPage, hasNextPage, isLoading } = useSearchListQuery({
    rowsPerPage: ROWS_PER_PAGE,
    mapData,
    page,
    setListItems,
  })

  useEffect(() => {
    if (map && map.zoom! >= 15) {
      setShowingList(true)
      fetchNextPage()
    } else if (map && map.zoom! < 15) {
      setShowingList(false)
      setIsOpen(true)
    }
  }, [map?.zoom])

  useEffect(() => {
    setMapData({
      ids:
        formData.ids.length === 12
          ? '0'
          : formData.ids.map((id) => id).join(','),
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
      km: formData.km,
      kw: formData.kw,
      gm: formData.gm,
      gg: formData.gg,
      ekm: formData.ekm,
      egm: formData.egm,
      egg: formData.egg,
    })
  }, [formData])

  useEffect(() => {
    if (data) {
      if (data.pageParams.length === 1) {
        scrollToTop()
        setListItems(data.pages[0]?.contents)
      } else if (data.pageParams.length > 1) {
        setListItems((prev) => [
          ...(prev ?? []),
          ...(data && data?.pages[data.pages.length - 1]?.contents),
        ])
      }
    }
  }, [data, setListItems])

  const scrollToTop = () => {
    if (!scrollbarsRef.current) return
    scrollbarsRef.current?.scrollTo(0, 0)
  }
  console.log('listItems', listItems)
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
        listItems && listItems?.length > 0 ? (
          <>
            <Header
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoading={isLoading}
              pageInfo={data?.pages[0]?.paging.totalElements ?? 0}
            />
            <Container isOpen={isOpen} id="scrollbarDiv" ref={scrollbarsRef}>
              <InfiniteScroll
                dataLength={listItems.length}
                next={fetchNextPage}
                hasMore={hasNextPage ?? false}
                loader={<ListSkeleton />}
                scrollableTarget="scrollbarDiv"
              >
                {listItems.map((item, index) => (
                  <Forms key={index} item={item} index={index} />
                ))}
              </InfiniteScroll>
            </Container>
          </>
        ) : (
          <>
            <Header
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoading={isLoading}
              pageInfo={data?.pages[0]?.paging.totalElements ?? 0}
            />
            <ContainerNone isOpen={true}>
              <Spacing size={20} />
              <Text css={NoResultText}>
                검색 결과가 없습니다. 좌표를 이동해주세요.
              </Text>
            </ContainerNone>
          </>
        )
      ) : (
        <>
          <Header
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLoading={isLoading}
            pageInfo={data?.pages[0]?.paging.totalElements ?? 0}
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
  height: ${({ isOpen }) => (isOpen ? 'calc(100% - 60px)' : '0px')};
  display: flex;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background: #dfdfdf;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
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

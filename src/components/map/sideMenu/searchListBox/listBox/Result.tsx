/* eslint-disable react-hooks/exhaustive-deps */
import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import Header from './Header'
import styled from '@emotion/styled'
import ListSkeleton from './Skeleton'
import Text from '@/components/shared/Text'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { usePostListItems } from '../hooks/usePostListItems'
import { css } from '@emotion/react'
import Spacing from '@/components/shared/Spacing'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { ListData, MapItems, PageInfo } from '@/models/MapItem'
import Forms from './items/Form'
import InfiniteScroll from 'react-infinite-scroll-component'
import postListItems from '@/remote/map/items/postListItems'
import { useInfiniteQuery } from 'react-query'
import useSearchListQuery from './hooks/useSearchListQuery'
import { useInView } from 'react-intersection-observer'
import { TSearchList } from '@/models/api/mapItem'
import useMapData from './hooks/useSearchListQuery'

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

  const fetchMapData = async (
    params: ListData,
    pageParam: number,
    rowsPerPage: number,
  ) => {
    const response = await postListItems(params, pageParam, rowsPerPage)
    return {
      contents: response.contents,
      paging: response.paging,
    }
  }

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<TSearchList>(
    ['searchList', mapData, page],
    async ({ pageParam = 1 }) =>
      await fetchMapData(mapData, pageParam, ROWS_PER_PAGE),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1
        return lastPage?.contents.length === 0 ||
          lastPage?.contents.length < ROWS_PER_PAGE
          ? undefined
          : nextPage
      },
      retry: 0,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      fetchNextPage().then(() => {
        console.log('fetchNextPage')
      })
    }
  }, [inView])

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
      if (data.pages[0].contents.length === 0) {
        setListItems(null)
      }
      if (data.pages[0].paging.pageNumber === 1) {
        setListItems(data.pages[0].contents)
      } else {
        setListItems((prev) => {
          if (prev) {
            return [...prev, ...data.pages[0].contents]
          } else {
            return data.pages[0].contents
          }
        })
      }
    }
  }, [data])
  console.log(inView)
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
              pageInfo={data?.pages[0].paging.totalElements ?? 0}
            />
            <Container isOpen={isOpen}>
              {listItems.map((item, index) => (
                <Forms key={index} item={item} index={index} />
              ))}
              {isFetchingNextPage ? <ListSkeleton /> : <div ref={ref} />}
            </Container>
          </>
        ) : (
          <>
            <Header
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoading={isLoading}
              pageInfo={data?.pages[0].paging.totalElements ?? 0}
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
            pageInfo={data?.pages[0].paging.totalElements ?? 0}
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
  overflow-y: auto;
  overflow-x: hidden;
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

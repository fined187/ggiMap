/* eslint-disable react-hooks/exhaustive-deps */
import Flex from '@/components/shared/Flex'
import Header from './Header'
import styled from '@emotion/styled'
import ListSkeleton from './Skeleton'
import Text from '@/components/shared/Text'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import Spacing from '@/components/shared/Spacing'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import Forms from './items/Form'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from './icon/loader/Loader'
import { useRecoilState } from 'recoil'
import { formDataAtom, loaderAtom, mapListAtom } from '@/store/atom/map'
import { usePostListItems } from '@/hooks/items/usePostListItems'

interface ResultProps {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ROWS_PER_PAGE = 10

function Result({ isOpen, setIsOpen, page, setPage }: ResultProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [mapListItems, setMapListItems] = useRecoilState(mapListAtom)
  const [showingList, setShowingList] = useState(false)
  const scrollbarsRef = useRef<HTMLDivElement | null>(null)
  const [loader, setLoader] = useRecoilState(loaderAtom)
  const { mutate: getMapLists } = usePostListItems(
    formData,
    page,
    ROWS_PER_PAGE,
  )
  const [isLoading, setIsLoading] = useState(false)
  const fetchNextPage = useCallback(() => {
    if (
      mapListItems?.paging.totalElements > mapListItems?.contents.length &&
      !isLoading
    ) {
      setIsLoading(true)
      setPage((prev) => prev + 1)
      getMapLists()
      setIsLoading(false)
    }
  }, [
    getMapLists,
    isLoading,
    mapListItems?.contents.length,
    mapListItems?.paging.totalElements,
  ])

  const handleScroll = useCallback(() => {
    const scrollElement = scrollbarsRef.current
    if (!scrollElement) return
    if (
      scrollElement.scrollTop + scrollElement.clientHeight ===
      scrollElement.scrollHeight
    ) {
      fetchNextPage()
    }
  }, [fetchNextPage])

  useEffect(() => {
    const scrollElement = scrollbarsRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  useEffect(() => {
    if (!map) return
    if (map.getZoom() >= 15) {
      setShowingList(true)
      fetchNextPage()
    } else if (map && map.getZoom() < 15) {
      setShowingList(false)
      setIsOpen(true)
    }
  }, [map?.getZoom()])

  const scrollToTop = useCallback(() => {
    if (!scrollbarsRef.current) return
    scrollbarsRef.current?.scrollTo(0, 0)
  }, [scrollbarsRef.current])

  useEffect(() => {
    setLoader(true)
    scrollToTop()
    setPage(1)
  }, [formData.x1, formData.y1, formData.x2, formData.y2])

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
        mapListItems?.contents && mapListItems?.contents.length > 0 ? (
          <>
            <Header
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoading={isLoading}
              pageInfo={mapListItems?.paging?.totalElements ?? 0}
            />
            <Container isOpen={isOpen} id="scrollbarDiv" ref={scrollbarsRef}>
              {loader ? (
                <Loader />
              ) : (
                <InfiniteScroll
                  dataLength={mapListItems.contents.length}
                  hasMore={
                    mapListItems.paging.totalElements >
                    mapListItems.contents.length
                  }
                  next={fetchNextPage}
                  loader={<ListSkeleton />}
                  scrollableTarget="scrollbarDiv"
                >
                  {mapListItems.contents.map((item, index) => (
                    <Forms key={index} item={item} index={index} />
                  ))}
                </InfiniteScroll>
              )}
            </Container>
          </>
        ) : (
          <>
            <Header
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoading={isLoading}
              pageInfo={mapListItems?.paging?.totalElements}
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
            pageInfo={mapListItems?.paging?.totalElements ?? 0}
          />
          <ContainerNone isOpen={true}>
            <Spacing size={20} />
            <Text css={NoResultText}>
              300m 초과에서는 매물 종류(경매/예정/공매)
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

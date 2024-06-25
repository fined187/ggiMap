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
import {
  formDataAtom,
  isOnlySelectedAtom,
  jusoAtom,
  mapListAtom,
  selectedItemAtom,
} from '@/store/atom/map'
import { ListData, MapItem, MapItems } from '@/models/MapItem'
import useSearchListQuery from './hooks/useSearchListQuery'
import { useReverseGeoCode } from '@/components/map/sections/hooks/useReverseGeoCode'
import { authInfo } from '@/store/atom/auth'

interface ResultProps {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  dragStateRef: React.MutableRefObject<boolean>
}

function Result({
  isOpen,
  setIsOpen,
  page,
  setPage,
  dragStateRef,
}: ResultProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [mapListItems, setMapListItems] = useRecoilState(mapListAtom)
  const [showingList, setShowingList] = useState(false)
  const scrollbarsRef = useRef<HTMLDivElement | null>(null)
  const [juso, setJuso] = useRecoilState(jusoAtom)
  const [auth, setAuth] = useRecoilState(authInfo)
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemAtom)
  const [isOnlySelected, setIsOnlySelected] = useRecoilState(isOnlySelectedAtom)
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

  const handleCenterChanged = useCallback(() => {
    if (map) {
      const mapCenter: naver.maps.Point = map.getCenter()
      const centerCoords = { lat: mapCenter.y, lng: mapCenter.x }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useReverseGeoCode(centerCoords.lat, centerCoords.lng, setJuso)
    }
  }, [map, setJuso, useReverseGeoCode])

  const { data, fetchNextPage, hasNextPage, isLoading } = useSearchListQuery({
    mapData,
    handleCenterChanged,
    dragStateRef,
    page,
  })

  const scrollToTop = useCallback(() => {
    if (!scrollbarsRef.current) return
    scrollbarsRef.current?.scrollTo(0, 0)
  }, [scrollbarsRef.current])

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
    if (!map) return
    if (map.getZoom() >= 15) {
      setShowingList(true)
      setPage(1)
    } else if (map && map.getZoom() < 15) {
      setShowingList(false)
      setIsOpen(true)
    }
  }, [map?.getZoom(), setPage, setIsOpen])

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
    const handleUpdateMapList = () => {
      if (data) {
        if (data.pageParams.length === 1) {
          scrollToTop()
          setMapListItems((prev: any) => {
            return {
              ...prev,
              contents: data.pages[0]?.contents,
              paging: data.pages[0]?.paging,
            }
          })
        } else if (data.pageParams.length > 1) {
          setMapListItems((prev) => {
            return {
              ...prev,
              contents: [
                ...(prev?.contents ?? []),
                ...((data && data?.pages[data.pages.length - 1]?.contents) ??
                  []),
              ],
            }
          })
        }
      }
    }
    handleUpdateMapList()
  }, [data, setMapListItems])

  const handleReturnSelectedItems = useCallback(() => {
    if (auth.type === '1') {
      return selectedItem?.kmItem
    } else if (auth.type === '2' || auth.type === '3') {
      return selectedItem?.gmItem
    } else if (auth.type === '4') {
      return selectedItem?.kwItem
    }
  }, [auth.type, selectedItem])
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
              pageInfo={
                auth.idCode !== ''
                  ? handleReturnSelectedItems()?.status === '진행'
                    ? mapListItems?.paging?.totalElements
                    : mapListItems?.paging?.totalElements + 1
                  : mapListItems?.paging?.totalElements
              }
            />
            {auth.idCode !== '' && (
              <Forms
                item={handleReturnSelectedItems() as MapItems}
                index={0}
                isSelected={true}
              />
            )}
            <Container isOpen={isOpen} id="scrollbarDiv" ref={scrollbarsRef}>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {!isOnlySelected && (
                    <InfiniteScroll
                      dataLength={mapListItems.contents.length}
                      next={fetchNextPage}
                      hasMore={hasNextPage ?? true}
                      loader={<ListSkeleton />}
                      scrollableTarget="scrollbarDiv"
                    >
                      {mapListItems.contents.map((item, index) => (
                        <Forms
                          key={index}
                          item={item}
                          index={auth.idCode === '' ? index : index + 1}
                          isSelected={false}
                        />
                      ))}
                    </InfiniteScroll>
                  )}
                </>
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

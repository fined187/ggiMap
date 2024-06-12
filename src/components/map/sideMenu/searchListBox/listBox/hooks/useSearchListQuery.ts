import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { ListData, MapItems, PageInfo } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { Dispatch, useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'
import useSWR from 'swr'

interface useSearhListQueryProps {
  rowsPerPage: number
  mapData: ListData
  page: number
}

const queryKey = 'searchList'

export default function useSearchListQuery({
  rowsPerPage,
  mapData,
  page,
}: useSearhListQueryProps) {
  const { data: map } = useSWR(MAP_KEY)
  const fetchSearchList = async (
    mapData: ListData,
    page: number,
    rowsPerPage: number,
  ) => {
    const res = await postListItems(mapData, page, rowsPerPage)
    return res
  }

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery(
      [queryKey, mapData, page],
      ({ pageParam = 1 }) =>
        map?.getZoom() >= 15
          ? fetchSearchList(mapData, pageParam, rowsPerPage)
          : undefined,
      {
        getNextPageParam: (lastPage) => {
          return lastPage?.paging?.isLast
            ? undefined
            : lastPage?.paging?.pageNumber + 1
        },
      },
    )
  const listProducts = useMemo(() => {
    if (!data) return []
    return data?.pages.flatMap((page) => (page?.contents ? page?.contents : []))
  }, [data])

  return {
    data,
    fetchNextPage,
    hasNextPage,
    listProducts,
    isFetching,
    isLoading,
  }
}

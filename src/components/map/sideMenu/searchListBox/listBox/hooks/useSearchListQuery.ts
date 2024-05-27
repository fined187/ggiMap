import { ListData, MapItems, PageInfo } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { Dispatch, useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

interface useSearhListQueryProps {
  rowsPerPage: number
  mapData: ListData
  page: number
  setListItems: Dispatch<React.SetStateAction<MapItems[] | null>>
}

const queryKey = 'searchList'

export default function useSearchListQuery({
  rowsPerPage,
  mapData,
  page,
  setListItems,
}: useSearhListQueryProps) {
  const fetchSearchList = async (
    mapData: ListData,
    page: number,
    rowsPerPage: number,
  ) => {
    try {
      const res = await postListItems(mapData, page, rowsPerPage)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery(
      [queryKey, mapData, page],
      ({ pageParam = 1 }) => fetchSearchList(mapData, pageParam, rowsPerPage),
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
    return data?.pages.flatMap((page) => page?.contents)
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

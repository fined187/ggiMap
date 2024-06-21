import useDebounce from '@/components/shared/hooks/useDebounce'
import { ListData, MapListResponse } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { Dispatch, useEffect, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useRecoilState } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import usePostMapItems from '@/hooks/items/usePostMapItems'
import { usePostListItems } from '@/hooks/items/usePostListItems'
import postMapItems from '@/remote/map/items/postMapItems'

interface SearchListQueryProps {
  mapData: ListData
  handleCenterChanged: () => void
  dragStateRef: React.MutableRefObject<boolean>
  page: number
}

const QUERY_KEY = 'searchList'
const DEBOUNCE_DELAY = 100
const PAGE_SIZE = 10

export default function useSearchListQuery({
  mapData,
  handleCenterChanged,
  dragStateRef,
  page,
}: SearchListQueryProps) {
  const [formData] = useRecoilState(formDataAtom)
  const { mutate: getMapItems } = usePostMapItems(
    formData,
    dragStateRef.current,
  )

  const fetchSearchList = async (
    mapData: ListData,
    page: number,
    PAGE_SIZE: number,
  ) => {
    try {
      const [listItems] =
        page > 1
          ? await Promise.all([postListItems(mapData, page, PAGE_SIZE)])
          : await Promise.all([
              postListItems(mapData, page, PAGE_SIZE),
              getMapItems(),
              handleCenterChanged(),
            ])
      return listItems as unknown as MapListResponse
    } catch (error) {
      console.error('fetchSearchList error:', error)
      throw error
    }
  }

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery(
      [QUERY_KEY, mapData, page],
      ({ pageParam = 1 }) => fetchSearchList(mapData, pageParam, PAGE_SIZE),
      {
        getNextPageParam: (lastPage) => {
          console.log('lastPage:', lastPage)
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

import { ListData, MapItems, MapListResponse } from '@/models/MapItem'
import { MutableRefObject, useCallback, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import usePostMapItems from '@/hooks/items/usePostMapItems'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { authInfo } from '@/store/atom/auth'
import usePostListItems from '../../hooks/usePostListItems'

interface SearchListQueryProps {
  mapData: ListData
  handleCenterChanged: () => void
  dragStateRef: MutableRefObject<boolean>
}

const QUERY_KEY = 'searchList'
const PAGE_SIZE = 10

export default function useSearchListQuery({
  mapData,
  handleCenterChanged,
  dragStateRef,
}: SearchListQueryProps) {
  const auth = useRecoilValue(authInfo)
  const formData = useRecoilValue(formDataAtom)
  const { data: map } = useSWR(MAP_KEY)
  const { mutate: getMapItems } = usePostMapItems(
    formData,
    dragStateRef.current,
  )
  const { mutateAsync: getMapListItems } = usePostListItems({formData})
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const fetchSearchList = useCallback(
    async (page: number, PAGE_SIZE: number) => {
      if (!map) return
      try {
        await delay(100)
        if (map?.getZoom() < 15) {
          await handleCenterChanged()
          return
        }
        const promises = [
          getMapListItems({ page, pageSize: PAGE_SIZE }),
        ]
        if (page === 1) {
          promises.push(getMapItems()!, handleCenterChanged()!)
        }
        const [listItems] = await Promise.all(promises)
        if (
          listItems?.contents.some(
            (item: MapItems) => item.idCode === auth.idCode,
          )
        ) {
          listItems.contents = listItems.contents.filter(
            (item: MapItems) => item.idCode !== auth.idCode,
          )
          return { ...listItems } as MapListResponse
        }
        return listItems as unknown as MapListResponse
      } catch (error) {
        console.error('fetchSearchList error:', error)
        throw error
      }
    },
    [map, getMapItems, getMapListItems, handleCenterChanged],
  )

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery(
      [QUERY_KEY, mapData],
      ({ pageParam = 1 }) => fetchSearchList(pageParam, PAGE_SIZE),
      {
        getNextPageParam: (lastPage) => {
          const nextPage = lastPage?.paging?.isLast
            ? undefined
            : (lastPage?.paging?.pageNumber ?? 0) + 1
          return nextPage
        },
        refetchOnWindowFocus: false,
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

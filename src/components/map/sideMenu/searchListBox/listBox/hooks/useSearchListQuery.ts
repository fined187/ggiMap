import { MapItems, MapListResponse } from '@/models/MapItem'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useInfiniteQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import usePostMapItems from '@/hooks/items/usePostMapItems'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { authInfo } from '@/store/atom/auth'
import usePostListItems from '../../hooks/usePostListItems'

interface SearchListQueryProps {
  handleCenterChanged: () => void
  dragStateRef: MutableRefObject<boolean>
}

const QUERY_KEY = 'searchList'
const PAGE_SIZE = 10

export default function useSearchListQuery({
  handleCenterChanged,
  dragStateRef,
}: SearchListQueryProps) {
  const isFirstMount = useRef(false)
  const auth = useRecoilValue(authInfo)
  const formData = useRecoilValue(formDataAtom)
  const { data: map } = useSWR(MAP_KEY)
  const { mutate: getMapItems } = usePostMapItems(
    formData,
    dragStateRef.current,
  )
  const { mutateAsync: getMapListItems } = usePostListItems({ formData })
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const fetchSearchList = useCallback(
    async (page: number, PAGE_SIZE: number) => {
      if (!map) return
      if (
        formData.x1 === 1 &&
        formData.x2 === 1 &&
        formData.y1 === 1 &&
        formData.y2 === 1
      )
        return
      await delay(100)
      if (!isFirstMount.current) {
        isFirstMount.current = true
        return
      }
      try {
        if (map?.getZoom() < 15) {
          await handleCenterChanged()
          return
        }

        let listItems
        if (page === 1) {
          const [mapListItems] = await Promise.all([
            getMapListItems({ page, pageSize: PAGE_SIZE }),
          ])
          listItems = mapListItems
          const promises = []
          promises.push(getMapItems())
          promises.push(handleCenterChanged())
          await Promise.all(promises)
        } else {
          listItems = await getMapListItems({ page, pageSize: PAGE_SIZE })
        }

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
    [
      auth.idCode,
      formData,
      getMapItems,
      getMapListItems,
      handleCenterChanged,
      map,
    ],
  )

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery(
      [QUERY_KEY, formData.x1, formData.y1, formData.x2, formData.y2],
      ({ pageParam = 1 }) =>
        fetchSearchList(pageParam, PAGE_SIZE) as Promise<MapListResponse>,
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

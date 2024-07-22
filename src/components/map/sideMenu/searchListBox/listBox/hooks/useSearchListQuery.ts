import { MapItems, MapListResponse } from '@/models/MapItem'
import { MutableRefObject, useCallback, useMemo, useRef } from 'react'
import { UseQueryResult, useInfiniteQuery, useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import usePostMapItems from '@/hooks/items/usePostMapItems'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { authInfo } from '@/store/atom/auth'
import usePostListItems from '../../hooks/usePostListItems'
import { NaverMap } from '@/models/Map'

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
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })
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
      await delay(250)
      try {
        if (map && map?.getZoom() < 15) {
          await handleCenterChanged()
          return
        }
        let listItems = null
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
            (item: MapItems) => item.idCode === auth.id,
          )
        ) {
          listItems.contents = listItems.contents.filter(
            (item: MapItems) => item.idCode !== auth.id,
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
      auth.id,
      formData.x1,
      formData.x2,
      formData.y1,
      formData.y2,
      formData.interests,
      formData.awardedMonths,
      formData.km,
      formData.kw,
      formData.gg,
      formData.gm,
      formData.ekm,
      formData.egm,
      formData.egg,
      formData.fromAppraisalAmount,
      formData.toAppraisalAmount,
      formData.fromMinimumAmount,
      formData.toMinimumAmount,
      formData.ids,
      getMapItems,
      getMapListItems,
      handleCenterChanged,
      map,
    ],
  )

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery(
      [
        QUERY_KEY,
        formData.x1,
        formData.x2,
        formData.y1,
        formData.y2,
        formData.interests,
        formData.awardedMonths,
        formData.km,
        formData.kw,
        formData.gg,
        formData.gm,
        formData.ekm,
        formData.egm,
        formData.egg,
        formData.fromAppraisalAmount,
        formData.toAppraisalAmount,
        formData.fromMinimumAmount,
        formData.toMinimumAmount,
        formData.ids,
      ],
      ({ pageParam = 1 }) =>
        fetchSearchList(pageParam, PAGE_SIZE) as Promise<MapListResponse>,
      {
        getNextPageParam: (lastPage) => {
          const nextPage = lastPage?.paging?.isLast
            ? undefined
            : (lastPage?.paging?.pageNumber ?? 0) + 1
          return nextPage
        },
        enabled: !!map || !!auth.isInitialized, 
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

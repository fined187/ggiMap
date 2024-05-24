import { ListData } from '@/models/MapItem'
import { TSearchList } from '@/models/api/mapItem'
import postListItems from '@/remote/map/items/postListItems'
import { useInfiniteQuery } from 'react-query'

const fetchMapData = async (
  params: ListData,
  pageParam: number,
  rowsPerPage: number,
) => {
  console.log('fetchMapData', pageParam, rowsPerPage)
  const response = await postListItems(params, pageParam, rowsPerPage)
  return response
}

const useMapData = (mapData: ListData, rowsPerPage: number) => {
  return useInfiniteQuery<TSearchList>(
    ['searchList', mapData],
    async ({ pageParam = 1 }) => fetchMapData(mapData, pageParam, rowsPerPage),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.paging.pageNumber + 1
      },
      refetchOnWindowFocus: false,
    },
  )
}

export default useMapData

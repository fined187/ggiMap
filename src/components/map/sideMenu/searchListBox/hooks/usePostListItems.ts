import { ListData, MapListResponse } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { useMutation } from 'react-query'

interface PostListItemsArgs {
  mapData: ListData
  page: number
  pageSize: number
}

function usePostListItems() {
  return useMutation<MapListResponse, unknown, PostListItemsArgs>(
    ['postListItems'],
    async ({ mapData, page, pageSize }) => {
      const response = await postListItems(mapData, page, pageSize)
      return response as MapListResponse
    },
  )
}

export default usePostListItems

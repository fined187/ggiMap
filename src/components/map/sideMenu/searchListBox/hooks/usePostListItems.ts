import { ListData, MapListResponse } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { mapListAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

interface PostListItemsArgs {
  mapData: ListData
  page: number
  pageSize: number
}

function usePostListItems() {
  const setMapList = useSetRecoilState(mapListAtom)
  const mapList = useRecoilValue(mapListAtom)
  return useMutation<MapListResponse, unknown, PostListItemsArgs>(
    ['postListItems'],
    async ({ mapData, page, pageSize }) => {
      const response = await postListItems(mapData, page, pageSize)
      if (!response) {
        setMapList((prev) => {
          return {
            contents: prev.contents,
            paging: prev.paging,
          }
        })
      }
      return response?.data.data as MapListResponse
    },
  )
}

export default usePostListItems

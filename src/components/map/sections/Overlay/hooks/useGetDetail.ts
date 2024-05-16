import { ItemDetail } from '@/models/ItemDetail'
import {
  getGgDetail,
  getGmDetail,
  getKmDetail,
  getKwDetail,
} from '@/remote/map/info/getDetail'
import { Dispatch, SetStateAction } from 'react'
import { useQuery } from 'react-query'

export const useGetDetail = (
  ids: string[],
  type: number,
  setClickedInfo: Dispatch<SetStateAction<ItemDetail[] | null>>,
) => {
  return useQuery<ItemDetail[]>(
    ['dtail', type, ids],
    async () => {
      const data = await Promise.all(
        ids.map((id) => {
          if (type === 1) {
            return getKmDetail(id)
          } else if (type === 2) {
            return getGmDetail(id)
          } else if (type === 3) {
            return getGgDetail(id)
          } else if (type === 4) {
            return getKwDetail(id)
          }
          return null
        }),
      )
      return data
    },
    {
      onSuccess: (data) => {
        setClickedInfo(null)
        setClickedInfo(data)
      },
    },
  )
}

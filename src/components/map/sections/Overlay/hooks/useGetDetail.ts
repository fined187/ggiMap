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
  type: number[],
  setClickedInfo: Dispatch<SetStateAction<ItemDetail[] | null>>,
) => {
  return useQuery<ItemDetail[]>(
    ['dtail', { type, ids }],
    async () => {
      const data = await Promise.all(
        ids.map(async (id, index) => {
          if (type[index] === 1) {
            return await getKmDetail(id)
          } else if (type[index] === 4) {
            return await getKwDetail(id)
          } else if (type[index] === 2) {
            return await getGmDetail(id)
          } else if (type[index] === 3) {
            return await getGgDetail(id)
          }
          return null
        }),
      )
      return data.filter((item) => item !== null) as ItemDetail[]
    },
    {
      onSuccess: (data) => {
        setClickedInfo(null)
        setClickedInfo(data)
      },
      onError: (error) => {
        console.error(error)
      },
    },
  )
}

import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
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
  clickedItem: MapItem | null,
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
        const SortedData = data.sort((a, b) => {
          if (a?.winAmt !== undefined && b?.winAmt !== undefined) {
            if (a.winAmt > 0 && b.winAmt === 0) {
              return 1
            } else if (a.winAmt === 0 && b.winAmt > 0) {
              return 1
            } else if (a.winAmt > 0 && b.type === 4) {
              return -1
            } else if (a.type !== 4 && b.type === 4) {
              return -1
            }
          }
          return 0
        })
        setClickedInfo(null)
        setClickedInfo(() => {
          return SortedData.map((item, index) => {
            if (item) {
              return {
                ...item,
                number: index,
                x: clickedItem?.x,
                y: clickedItem?.y,
              }
            }
            return item
          })
        })
      },
      onError: (error) => {
        console.error(error)
      },
    },
  )
}

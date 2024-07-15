import { ItemDetail } from '@/models/ItemDetail'
import {
  getGgDetail,
  getGmDetail,
  getKmDetail,
  getKwDetail,
} from '@/remote/map/info/getDetail'
import { clickedInfoAtom, clickedItemAtom } from '@/store/atom/map'
import { useQuery } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

type detailFetchersType = {
  [key: number]: (id: string) => Promise<ItemDetail>
}

const detailFetchers: detailFetchersType = {
  1: getKmDetail,
  2: getGmDetail,
  3: getGgDetail,
  4: getKwDetail,
}

const fetchDetails = async (ids: string[], types: number[]) => {
  const data = await Promise.all(
    ids.map((id, index) => {
      const fetcher = detailFetchers[types[index]]
      return fetcher ? fetcher(id) : null
    })
  )
  return data.filter((item): item is ItemDetail => item !== null)
}

const useGetDetail = () => {
  const clickedItem = useRecoilValue(clickedItemAtom)
  const setClickedInfo = useSetRecoilState(clickedInfoAtom)
  const ids = clickedItem?.ids ?? []
  const type = clickedItem?.types ?? []
  return useQuery<ItemDetail[]>(
    ['dtail', { ids, type }],
    () => fetchDetails(ids, type),
    {
      onSuccess: (data) => {
        const sortedData = data?.slice().sort((a, b) => {
          if (a?.winAmt !== undefined && b?.winAmt !== undefined) {
            if (a.winAmt > 0 && b.winAmt === 0) {
              return 1
            } else if (a.winAmt === 0 && b.winAmt > 0) {
              return -1
            } else if (a.winAmt > 0 && b.type === 4) {
              return -1
            } else if (a.type !== 4 && b.type === 4) {
              return -1
            }
          }
          return 0
        })
        setClickedInfo(sortedData)
      },
      onError: (error) => {
        console.error(error)
      },
    },
  )
}

export default useGetDetail

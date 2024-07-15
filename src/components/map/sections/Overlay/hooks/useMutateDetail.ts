import { ItemDetail } from '@/models/ItemDetail'
import {
  getGgDetail,
  getGmDetail,
  getKmDetail,
  getKwDetail,
} from '@/remote/map/info/getDetail'
import { clickedInfoAtom, clickedItemAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

const useMutateDetail = () => {
  const clickedItem = useRecoilValue(clickedItemAtom)
  const setClickedInfo = useSetRecoilState(clickedInfoAtom)
  const ids = clickedItem?.ids ?? []
  const type = clickedItem?.types ?? []

  // 데이터 패칭 함수 정의
  const fetchDetails = async () => {
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
  }

  // Mutation 훅 생성
  const mutateDetails = useMutation(fetchDetails, {
    onSuccess: (data) => {
      const sortedData = data.sort((a, b) => {
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
      setClickedInfo([])
      setClickedInfo(sortedData)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return mutateDetails
}

export default useMutateDetail

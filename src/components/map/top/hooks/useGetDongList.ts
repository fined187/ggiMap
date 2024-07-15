import { DongProps } from '@/models/Juso'
import { jusoAtom } from '@/store/atom/map'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

const fetchDongList = async (si: string, gu: string) => {
  try {
    const { data } = await axios.get(`/ggi/api/location/${si}/${gu}/umds`)
    if (data.success) {
      const addArray =
        data.data.umds.length % 3 === 0
          ? null
          : Array(3 - (data.data.umds.length % 3)).fill({
              umd: ' ',
              x: 0,
              y: 0,
            })
      return [...data.data.umds, ...(addArray === null ? [] : addArray)]
    }
  } catch (error) {
    throw new Error('동 리스트를 가져오는데 실패했습니다.')
  }
  return []
}

export default function useGetDongList() {
  const juso = useRecoilValue(jusoAtom)
  return useQuery<DongProps[], Error>(['dongList', juso.bottomSido, juso.bottomGungu, juso.bottomDong], () =>
    fetchDongList(juso.bottomSido, juso.bottomGungu),
  )
}

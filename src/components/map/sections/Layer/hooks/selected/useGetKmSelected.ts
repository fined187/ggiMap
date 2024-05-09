import getKmSelected from '@/remote/map/selected/getSelected'
import { useQuery } from 'react-query'

export default function useGetKmSelected(idCode: string) {
  const { data } = useQuery(['getSelected', idCode], () =>
    getKmSelected(idCode),
  )
  return data
}

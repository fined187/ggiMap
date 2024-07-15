import getKmSelected from '@/remote/map/selected/getSelected'
import { useQuery } from 'react-query'

const useGetKmSelected = (idCode: string) => {
  const { data } = useQuery(['getSelected', idCode], () =>
    getKmSelected(idCode),
  )
  return data
}

export default useGetKmSelected

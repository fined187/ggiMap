import getKmDetail from '@/remote/map/info/getDetail'
import { useQuery } from 'react-query'

export default function useGetKmItemdetail(id: string) {
  const { data } = useQuery(['getDetail', id], () => getKmDetail(id))
  return data
}

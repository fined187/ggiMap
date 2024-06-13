import getAddress from '@/remote/map/auth/getAddress'
import { useQuery } from 'react-query'

export default function useAddress() {
  return useQuery(['address'], () => getAddress())
}

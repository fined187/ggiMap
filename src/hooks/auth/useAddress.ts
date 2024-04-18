import getAddress from '@/remote/auth/getAddress'
import { useQuery } from 'react-query'

export default function useAddress() {
  const response = useQuery(['address'], () => getAddress())
  return response
}

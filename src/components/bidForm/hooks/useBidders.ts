import { getBidders } from '@/remote/bidForm/form/getBidders'
import { useQuery } from 'react-query'

export default function useBidders(seq: number, idNum: string[]) {
  return useQuery(['bidders', seq, idNum], () => getBidders(seq, idNum))
}

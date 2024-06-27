import { KakaoAddrProps } from '@/models/Juso'
import { getKakaoAddr } from '@/remote/map/subway/getKakaoAddr'

const useSearchAddr = (keyword: string) => {
  const searchAddr = async () => {
    const response = await getKakaoAddr(keyword)
    if (response.length > 0) {
      return response as KakaoAddrProps[]
    }
  }
  return { searchAddr }
}

export default useSearchAddr

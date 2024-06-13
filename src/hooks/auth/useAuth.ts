import handleToken from '@/remote/map/auth/token'
import { UseMutationOptions, useMutation } from 'react-query'
interface TokenResponse {
  success: boolean
  data: any
}

// 에러 타입을 정의합니다.
interface TokenError {
  message: string
}

export const useAuth = (
  token: string,
  options?: UseMutationOptions<TokenResponse, TokenError, string>,
) => {
  return useMutation<TokenResponse, TokenError, string>(
    async () => {
      const response = await handleToken(token)

      // 필요한 경우 에러 처리를 명시적으로 수행할 수 있습니다.
      if (!response?.data.success) {
        throw new Error('Token 처리에 실패했습니다.')
      }
      return response.data // Return the 'data' property of the response
    },
    {
      ...options, // 외부로부터 전달받은 옵션을 추가합니다.
    },
  )
}

import { mapItem } from '@/models/api/mapItem'
import getUser from '@/remote/auth/user'
import { mapAtom } from '@/store/atom/map'
import { userAtom } from '@/store/atom/postUser'
import { useMap, useNavermaps } from 'react-naver-maps'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'

export default function useUser() {
  const [user, setUser] = useRecoilState(userAtom)
  const { mutate } = useMutation(() => getUser(), {
    onSuccess: (data) => {
      setUser({
        ...user,
        aesUserId: 'Ug3033i0SuUmGQaRK2XcxQ==',
        address: data.address,
      })
    },
  })
  return { mutate }
}

import { mapItem } from '@/models/api/mapItem'
import postMapItems from '@/remote/map/items/postMapItems'
import { mapAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'

export default function usePostMapItems(formData: mapItem) {
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const { mutate } = useMutation(() => postMapItems(formData), {
    onSuccess: (data) => {
      setMapItems([])
      setMapItems(data.mapItems)
    },
    onError: () => {
      console.log('error')
    },
  })
  return { mutate }
}

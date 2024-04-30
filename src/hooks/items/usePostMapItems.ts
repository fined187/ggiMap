import { Form } from '@/models/Form'
import { mapItem } from '@/models/api/mapItem'
import postMapItems from '@/remote/map/items/postMapItems'
import { mapAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'

export default function usePostMapItems(formData: Form) {
  const param = {
    ids:
      formData.ids.length === 12 ? '0' : formData.ids.map((id) => id).join(','),
    fromAppraisalAmount: formData.fromAppraisalAmount,
    toAppraisalAmount: formData.toAppraisalAmount,
    fromMinimumAmount: formData.fromMinimumAmount,
    toMinimumAmount: formData.toMinimumAmount,
    interests: formData.interests,
    x1: formData.x1,
    y1: formData.y1,
    x2: formData.x2,
    y2: formData.y2,
    awardedMonths: formData.awardedMonths,
    userId: formData.userId,
    km: formData.km,
    kw: formData.kw,
    gg: formData.gg,
    gm: formData.gm,
    ekm: formData.ekm,
    egm: formData.egm,
    egg: formData.egg,
  }
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const { mutate } = useMutation(() => postMapItems(param), {
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

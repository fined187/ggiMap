import { Form } from '@/models/Form'
import postMapItems from '@/remote/map/items/postMapItems'
import { mapItemsAtom, mapItemsOriginAtom } from '@/store/atom/map'
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
    km: formData.km,
    kw: formData.kw,
    gg: formData.gg,
    gm: formData.gm,
    ekm: formData.ekm,
    egm: formData.egm,
    egg: formData.egg,
  }
  const [mapItems, setMapItems] = useRecoilState(mapItemsAtom)
  const [mapItemOrigin, setMapItemOrigin] = useRecoilState(mapItemsOriginAtom)
  const { mutate } = useMutation(async () => await postMapItems(param), {
    onSuccess: (data) => {
      setMapItems([])
      setMapItems(data.mapItems)
      setMapItemOrigin(data.mapItems)
    },
    onError: () => {
      console.log('error')
    },
  })
  return { mutate }
}

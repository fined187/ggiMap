import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import postMapItems from '@/remote/map/items/postMapItems'
import { authInfo } from '@/store/atom/auth'
import { mapItemsAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'

export default function usePostMapItems(formData: Form, dragState: boolean) {
  const [mapItems, setMapItems] = useRecoilState(mapItemsAtom)
  const [auth, setAuth] = useRecoilState(authInfo)
  const param = {
    ids:
      formData.ids.length === 12 || formData.ids.length === 0
        ? '0'
        : formData.ids.map((id) => id).join(','),
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
    selectedId: auth.idCode !== '' ? auth.idCode : null,
    selectedType: auth.type !== '' ? parseInt(auth.type) : null,
  }

  const { mutate } = useMutation(async () => await postMapItems(param), {
    onSuccess: (data) => {
      if (data) {
        setMapItems([])
        setMapItems(data?.mapItems as MapItem[])
      } else {
        return
      }
      dragState = false
    },
    onError: () => {
      console.log('error')
    },
  })
  return { mutate }
}

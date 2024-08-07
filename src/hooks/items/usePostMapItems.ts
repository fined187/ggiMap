import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import postMapItems from '@/remote/map/items/postMapItems'
import { authInfo } from '@/store/atom/auth'
import { mapItemsAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

export default function usePostMapItems(formData: Form, dragState: boolean) {
  const setMapItems = useSetRecoilState(mapItemsAtom)
  const auth = useRecoilValue(authInfo)
  const param = {
    ids:
      formData.ids.length === 12 || formData.ids.length === 0
        ? '0'
        : formData.ids.join(','),
    fromAppraisalAmount: formData.fromAppraisalAmount,
    toAppraisalAmount:
      formData.toAppraisalAmount === 3000000001
        ? 0
        : formData.toAppraisalAmount,
    fromMinimumAmount: formData.fromMinimumAmount,
    toMinimumAmount:
      formData.toMinimumAmount === 3000000001 ? 0 : formData.toMinimumAmount,
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
    selectedId: auth.id !== '' ? auth.id : null,
    selectedType: auth.type !== '' ? parseInt(auth.type) : null,
  }
  const { mutate } = useMutation(
    ['mapItems', param.x1, param.y1, param.x2, param.y2, param.interests],
    async () => await postMapItems(param),
    {
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
        setMapItems((prev) => {
          return prev
        })
      },
    },
  )
  return { mutate }
}

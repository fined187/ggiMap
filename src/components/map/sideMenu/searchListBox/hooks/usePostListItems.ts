import { Form } from '@/models/Form'
import { ListData, MapItems, PageInfo } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { authInfo } from '@/store/atom/auth'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'

export function usePostListItems(
  formData: Form,
  setListItems: React.Dispatch<React.SetStateAction<MapItems[] | null>>,
  pageNum: number,
) {
  const auth = useRecoilValue(authInfo)
  const mapData: ListData = {
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
    gm: formData.gm,
    gg: formData.gg,
    ekm: formData.ekm,
    egm: formData.egm,
    egg: formData.egg,
    selectedId: auth.idCode !== '' ? auth.idCode : null,
    selectedType: auth.type !== '' ? parseInt(auth.type) : null,
  }
  const { mutate, isLoading } = useMutation(
    () => postListItems(mapData, pageNum, 10),
    {
      onSuccess: (data) => {
        setListItems((data && (data.contents as MapItems[])) ?? [])
      },
    },
  )
  return { mutate, isLoading }
}

import { Form } from '@/models/Form'
import { ListData, MapItems, PageInfo } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { useMutation } from 'react-query'

export function usePostListItems(
  formData: Form,
  setListItems: React.Dispatch<React.SetStateAction<MapItems[] | null>>,
  pageNum: number,
) {
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

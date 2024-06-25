import { Form } from '@/models/Form'
import { MapListResponse } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { authInfo } from '@/store/atom/auth'
import { mapListAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'

export const usePostListItems = (
  formData: Form,
  pageNum: number,
  pageSize: number,
) => {
  const auth = useRecoilValue(authInfo)
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
    selectedId: auth.idCode !== '' ? auth.idCode : null,
    selectedType: auth.type !== '' ? parseInt(auth.type) : null,
  }
  const [mapListItems, setMapListItems] = useRecoilState(mapListAtom)
  const { mutate } = useMutation(
    async () => await postListItems(param, pageNum, pageSize),
    {
      onSuccess: (data) => {
        console.log(data)
        if (
          pageNum > 1 &&
          mapListItems.contents.length > 0 &&
          mapListItems.paging.isFirst === false
        ) {
          setMapListItems((prev) => {
            return {
              contents: [...prev.contents, ...data?.contents],
              paging: data?.paging,
            }
          })
        } else {
          setMapListItems({
            contents: [],
            paging: {
              isFirst: false,
              isLast: false,
              pageNumber: 0,
              totalPages: 0,
              isEmpty: false,
              pageSize: 0,
              totalElements: 0,
            },
          })
          setMapListItems(data as MapListResponse)
        }
      },
      onError: () => {
        console.log('error')
      },
    },
  )
  return { mutate }
}

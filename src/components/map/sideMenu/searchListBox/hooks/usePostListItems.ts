import { Form } from '@/models/Form'
import { ListData, MapListResponse } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { authInfo } from '@/store/atom/auth'
import { mapListAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

interface PostListItemsArgs {
  page: number
  pageSize: number
}

function usePostListItems({ formData }: { formData: Form }) {
  const setMapList = useSetRecoilState(mapListAtom)
  const auth = useRecoilValue(authInfo)
  const param: ListData = {
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
  return useMutation<MapListResponse, unknown, PostListItemsArgs>(
    ['postListItems', param],
    async ({ page, pageSize }) => {
      const response = formData.role.includes('ROLE_ANONYMOUS' || 'ROLE_FREE')
        ? null
        : await postListItems(param, page, pageSize)
      if (!response) {
        setMapList((prev) => {
          return {
            contents: prev.contents,
            paging: prev.paging,
          }
        })
      }
      return response?.data.data as MapListResponse
    },
  )
}

export default usePostListItems

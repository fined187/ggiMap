import { Form } from '@/models/Form'
import { ListData, MapListResponse } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { authInfo } from '@/store/atom/auth'
import { mapListAtom } from '@/store/atom/map'
import { useIsMutating, useMutation } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

interface PostListItemsArgs {
  page: number
  pageSize: number
}

function usePostListItems({ formData }: { formData: Form }) {
  const prevList = useRecoilValue(mapListAtom)
  const setMapList = useSetRecoilState(mapListAtom)
  const auth = useRecoilValue(authInfo)
  const param: ListData = {
    ids:
      formData.ids.length === 12 || formData.ids.length === 0
        ? '0'
        : formData.ids.join(','),
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

  const isMutating = useIsMutating({ mutationKey: ['postListItems', param] })
  return useMutation<MapListResponse, unknown, PostListItemsArgs>(
    ['postListItems', param],
    async ({ page, pageSize }) => {
      const isRoleAnonymousOrFree = ['ROLE_ANONYMOUS', 'ROLE_FREE'].some(
        (role) => formData.role.includes(role),
      )
      if (isRoleAnonymousOrFree) {
        const prev = prevList
        setMapList((prev) => ({
          contents: [],
          paging: prev.paging,
        }))
        return { contents: [], paging: prev.paging } as MapListResponse
      }
      const response = await postListItems(param, page, pageSize)

      if (response?.data.data) {
        return response?.data.data as MapListResponse
      }
      throw new Error('Failed to fetch list items')
    },
    {
      onError: (error) => {
        console.error('usePostListItems error:', error)
      },
    },
  )
}

export default usePostListItems

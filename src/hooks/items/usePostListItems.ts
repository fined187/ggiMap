import { Form } from '@/models/Form'
import { MapItems, MapListResponse, PageInfo } from '@/models/MapItem'
import postListItems from '@/remote/map/items/postListItems'
import { authInfo } from '@/store/atom/auth'
import { mapListAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

interface PostListItemsProps {
  oldFormData: Form
  pageNum: number
  pageSize: number
}

export default function usePostListItems({
  oldFormData,
  pageNum,
  pageSize,
}: PostListItemsProps) {
  const auth = useRecoilValue(authInfo)
  const setMapListItems = useSetRecoilState(mapListAtom)
  const param = {
    ids:
      oldFormData.ids.length === 12
        ? '0'
        : oldFormData.ids.map((id) => id).join(','),
    fromAppraisalAmount: oldFormData.fromAppraisalAmount,
    toAppraisalAmount: oldFormData.toAppraisalAmount,
    fromMinimumAmount: oldFormData.fromMinimumAmount,
    toMinimumAmount: oldFormData.toMinimumAmount,
    interests: oldFormData.interests,
    x1: oldFormData.x1,
    y1: oldFormData.y1,
    x2: oldFormData.x2,
    y2: oldFormData.y2,
    awardedMonths: oldFormData.awardedMonths,
    km: oldFormData.km,
    kw: oldFormData.kw,
    gg: oldFormData.gg,
    gm: oldFormData.gm,
    ekm: oldFormData.ekm,
    egm: oldFormData.egm,
    egg: oldFormData.egg,
    selectedId: auth.idCode !== '' ? auth.idCode : null,
    selectedType: auth.type !== '' ? parseInt(auth.type) : null,
  }
  return async (pageCount: number) => {
    let allContents: MapItems[] = []
    let paging: PageInfo = {
      isFirst: false,
      isLast: false,
      pageNumber: 0,
      totalPages: 0,
      isEmpty: false,
      pageSize: 0,
      totalElements: 0,
    }

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const response = await postListItems(param, pageNum, pageSize)
      if (
        response?.contents.some((item: MapItems) => item.idCode === auth.idCode)
      ) {
        response.contents = response.contents.filter(
          (item: MapItems) => item.idCode !== auth.idCode,
        )
        allContents = [...allContents, ...response.contents]
        paging = response.paging
        setMapListItems({ contents: allContents, paging })
        if (response.contents.length < pageSize) {
          break
        }
      }
      return {
        contents: allContents,
        paging,
      } as MapListResponse
    }
  }
}

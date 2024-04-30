import { Form } from '@/models/Form'
import { MapCountsResponse } from '@/models/MapItem'
import { mapCounts } from '@/models/api/mapItem'
import postMapCounts from '@/remote/map/items/postMapCounts'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

export default function useMapCounts(
  formData: Form,
  setMapCount: Dispatch<SetStateAction<MapCountsResponse[]>>,
) {
  const countParam = {
    ids:
      formData.ids.length === 12 ? '0' : formData.ids.map((id) => id).join(','),
    km: formData.km,
    kw: formData.kw,
    gm: formData.gm,
    gg: formData.gg,
    x1: formData.x1,
    y1: formData.y1,
    x2: formData.x2,
    y2: formData.y2,
    level: formData.map.zoom as number,
  }
  const { mutate } = useMutation(async () => await postMapCounts(countParam), {
    onSuccess: (data) => {
      if (data.mapCounts !== null) {
        setMapCount(data.mapCounts as MapCountsResponse[])
      }
    },
  })
  return { mutate }
}

import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { Form } from '@/models/Form'
import { MapCountsResponse } from '@/models/MapItem'
import { mapCounts } from '@/models/api/mapItem'
import postMapCounts from '@/remote/map/items/postMapCounts'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'
import useSWR from 'swr'

export default function useMapCounts(
  formData: Form,
  setMapCount: Dispatch<SetStateAction<MapCountsResponse[]>>,
) {
  const { data: map } = useSWR(MAP_KEY)
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
    level: map?.zoom as number,
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

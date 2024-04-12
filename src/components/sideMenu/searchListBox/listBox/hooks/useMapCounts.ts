import { Form } from '@/models/Form'
import { mapCounts } from '@/models/api/mapItem'
import postMapCounts from '@/remote/items/postMapCounts'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

export default function useMapCounts(param: mapCounts, setMapCount: any) {
  const { mutate } = useMutation(async () => await postMapCounts(param), {
    onSuccess: (data) => {
      setMapCount(data.mapCounts)
    },
  })
  return { mutate }
}

import { mapCounts } from '@/models/api/mapItem'
import postMapCounts from '@/remote/items/postMapCounts'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

export default function useMapCounts(formData: mapCounts, setMapCount: any) {
  const { mutate } = useMutation(async () => await postMapCounts(formData), {
    onSuccess: (data) => {
      setMapCount(data)
    },
  })
  return { mutate }
}

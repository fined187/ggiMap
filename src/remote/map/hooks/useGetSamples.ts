import { mapItemsAtom, mapListAtom } from '@/store/atom/map'
import { useMutation } from 'react-query'
import { useSetRecoilState } from 'recoil'
import { getSampleItems } from '../auth/getSampleItems'

function useGetSamples(type: number) {
  const setMapItems = useSetRecoilState(mapItemsAtom)
  const setMapLists = useSetRecoilState(mapListAtom)
  const { mutate } = useMutation(
    ['samples'],
    async () => await getSampleItems(type),
    {
      onSuccess: (data: any) => {
        setMapItems(data.mapItems)
        setMapLists(data.contents)
      },
    },
  )
  return { mutate }
}

export default useGetSamples

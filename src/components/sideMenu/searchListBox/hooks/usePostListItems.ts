import { Items } from '@/models/ListItems'
import { ListData } from '@/models/MapItem'
import postListItems from '@/remote/items/postListItems'
import { useMutation } from 'react-query'

export function usePostListItems(
  formData: ListData,
  setListItems: React.Dispatch<React.SetStateAction<Items | null>>,
) {
  const { mutate, isLoading } = useMutation(() => postListItems(formData), {
    onSuccess: (data) => {
      setListItems(data)
    },
  })
  return { mutate, isLoading }
}

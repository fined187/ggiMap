import { useMutation } from 'react-query'
import baseApiInstance from '../../baseURL'
import { ListData } from '@/models/MapItem'
import { Dispatch, SetStateAction } from 'react'

async function postListItems(formData: ListData) {
  const response = await baseApiInstance.post('ggi/api/map/items', formData)
  return response.data.data
}

export default postListItems

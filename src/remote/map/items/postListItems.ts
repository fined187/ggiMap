import { ListData } from '@/models/MapItem'
import axios from 'axios'

async function postListItems(
  formData: ListData,
  pageNum: number,
  pageSize: number,
) {
  const response = await axios.post(
    `ggi/api/map/items?pageNumber=${pageNum}&pageSize=${pageSize}`,
    formData,
  )
  return response.data.data
}

export default postListItems

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
  console.log(response)
  return {
    contents: response.data.data.contents,
    paging: response.data.data.paging,
  }
}

export default postListItems

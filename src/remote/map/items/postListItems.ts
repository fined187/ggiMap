import { ListData } from '@/models/MapItem'
import axios from 'axios'

async function postListItems(
  formData: ListData,
  pageNum: number,
  pageSize: number,
) {
  try {
    const response = await axios.post(
      `ggi/api/map/items?pageNumber=${pageNum}&pageSize=${pageSize}`,
      formData,
    )
    if (response.data.success) {
      return {
        contents: response.data.data.contents,
        paging: response.data.data.paging,
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export default postListItems

import { ListData } from '@/models/MapItem'
import axios from 'axios'

async function postListItems(formData: ListData) {
  const response = await axios.post('ggi/api/map/items', formData)
  return response.data.data
}

export default postListItems

import { mapItem } from '@/models/api/mapItem'
import axios from 'axios'

export default async function postMapItems(params: mapItem) {
  try {
    const response = await axios.post('ggi/api/map/map-items', params)
    if (response.data.success) {
      return response.data.data
    }
  } catch (error) {
    console.log(error)
  }
}

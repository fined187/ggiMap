import { mapItem } from '@/models/api/mapItem'
import axios from 'axios'

export default async function postMapItems(params: mapItem) {
  const response = await axios.post('ggi/api/map/map-items', params)
  return response.data.data
}

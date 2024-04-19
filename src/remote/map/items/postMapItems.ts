import { mapItem } from '@/models/api/mapItem'
import baseApiInstance from '../../baseURL'

export default async function postMapItems(params: mapItem) {
  const response = await baseApiInstance.post('ggi/api/map/map-items', params)
  return response.data.data
}

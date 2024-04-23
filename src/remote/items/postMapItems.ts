import { mapItem } from '@/models/api/mapItem'
import baseApiInstance from '../baseURL'
import axios from 'axios'

export default async function postMapItems(params: mapItem) {
  const response = await axios.post('/ggi/api/map/map-items', params)
  return response.data.data
}

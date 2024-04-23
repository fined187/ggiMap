import { mapCounts } from '@/models/api/mapItem'
import baseApiInstance from '../baseURL'
import axios from 'axios'

export default async function postMapCounts(formData: mapCounts) {
  try {
    const response = await axios.post('/ggi/api/map/map-counts', formData)
    if (response.data.success === true) {
      return response.data.data
    }
  } catch (error) {
    console.error(error)
  }
}

import { mapCounts } from '@/models/api/mapItem'
import baseApiInstance from '../baseURL'

export default async function postMapCounts(formData: mapCounts) {
  try {
    const response = await baseApiInstance.post(
      'ggi/api/map/map-counts',
      formData,
    )
    if (response.data.success === true) {
      return response.data.data
    }
  } catch (error) {
    console.error(error)
  }
}

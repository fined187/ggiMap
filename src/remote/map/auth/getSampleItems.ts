import { MapItem, MapItems, MapListResponse } from '@/models/MapItem'
import axios from 'axios'
import { SetterOrUpdater } from 'recoil'

export const getSampleItems = async (type: number): Promise<void> => {
  try {
    const response = await axios.post(`/ggi/api/auth/map?type=${type}`, {})
    if (response.data.success) {
      return response.data.data
    }
  } catch (error) {
    console.log(error)
  }
}

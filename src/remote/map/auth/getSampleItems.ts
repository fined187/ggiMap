import { MapItem, MapItems, MapListResponse } from '@/models/MapItem'
import axios from 'axios'
import { SetterOrUpdater } from 'recoil'

export const getSampleItems = async (
  type: number,
  setMapItems: SetterOrUpdater<MapItem[]>,
  setMapLists: SetterOrUpdater<MapListResponse>,
): Promise<void> => {
  try {
    const response = await axios.post(`/ggi/api/auth/map?type=${type}`, {})
    if (response.data.success) {
      setMapItems(response.data.data.mapItems)
      setMapLists(response.data.data.contents)
    }
  } catch (error) {
    console.log(error)
  }
}

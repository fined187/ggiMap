import { MapItem } from '@/models/MapItem'
import { mapItem } from '@/models/api/mapItem'
import axios from 'axios'

interface MapItemsResponse {
  count: number
  mapItems: MapItem[]
}

export default async function postMapItems(params: mapItem) {
  const errorCode400Regex = /^400\d{2}$/
  let ok = false
  try {
    const response = await axios.post('ggi/api/map/map-items', params)
    if (response.data.success) {
      return response.data.data as MapItemsResponse
    } else if (errorCode400Regex.test(response.data.code.toString()) && !ok) {
      ok = true
      setTimeout(() => {
        alert('지도 검색은 유료서비스 입니다.')
        window.close()
      }, 500)
    }
  } catch (error) {
    console.log(error)
  }
}

import { mapCounts } from '@/models/api/mapItem'
import axios from 'axios'

export default async function postMapCounts(formData: mapCounts) {
  const errorCode400Regex = /^400\d{2}$/
  let ok = false
  try {
    const response = await axios.post('/ggi/api/map/map-counts', formData)
    if (response.data.success === true) {
      return response.data.data
    } else if (errorCode400Regex.test(response.data.code.toString()) && !ok) {
      ok = true
      setTimeout(() => {
        alert('지도 검색은 유료서비스 입니다.')
        window.close()
      }, 500)
    }
  } catch (error) {
    console.error(error)
  }
}

import { ListData } from '@/models/MapItem'
import axios from 'axios'

async function postListItems(
  formData: ListData,
  pageNum: number,
  pageSize: number,
) {
  const errorCode400Regex = /^400\d{2}$/
  let ok = false
  try {
    const response = await axios.post(
      `/ggi/api/map/items?pageNumber=${pageNum}&pageSize=${pageSize}`,
      formData,
    )
    if (response.data.success) {
      return response
    } else if (errorCode400Regex.test(response.data.code.toString()) && !ok) {
      ok = true
      setTimeout(() => {
        alert('지도 검색은 유료서비스 입니다. 로그인 후 이용해주세요.')
        window.close()
      }, 500)
    }
  } catch (error) {
    console.error(error)
  }
}

export default postListItems

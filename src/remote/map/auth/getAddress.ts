import axios from 'axios'

export default async function getAddress() {
  try {
    const response = await axios.get('/ggi/api/map/address')
    if (response.data.success === true) {
      return response.data.data
    } else {
      alert('사용자 정보를 가져오는데 실패했습니다.')
    }
  } catch (error) {
    console.error(error)
  }
}

import axios from 'axios'

async function getKmDetail(id: string) {
  const response = await axios.get(`/ggi/api/map/km-info/${id}`)
  return response.data.data
}

export default getKmDetail

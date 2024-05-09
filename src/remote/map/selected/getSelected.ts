import axios from 'axios'

async function getKmSelected(idCode: string) {
  const response = await axios.get(`/ggi/api/map/km-item/${idCode}`)
  return response.data.data
}

export default getKmSelected

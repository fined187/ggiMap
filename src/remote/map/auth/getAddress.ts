import axios from 'axios'

export default async function getAddress() {
  try {
    const response = await axios.get('/ggi/api/map/address')
    return response.data.data
  } catch (error) {
    console.error(error)
  }
}

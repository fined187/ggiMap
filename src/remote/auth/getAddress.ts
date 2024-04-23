import axios from 'axios'
import baseApiInstance from '../baseURL'

export default async function getAddress() {
  try {
    const response = await axios.get('/ggi/api/map/address')
    console.log(response.data)
    return response.data.data
  } catch (error) {
    console.error(error)
  }
}

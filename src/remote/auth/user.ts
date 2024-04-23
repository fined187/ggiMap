import axios from 'axios'
import baseApiInstance from '../baseURL'

export default async function getUser(id: string) {
  const response = await axios.post('/ggi/api/map/address', {
    aesUserId: id,
  })
  return response.data.data
}

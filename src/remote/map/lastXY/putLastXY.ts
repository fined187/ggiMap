import axios from 'axios'

export default async function putLastXY(x: number, y: number) {
  try {
    const response = await axios.put(`ggi/api/map/position`, {
      x,
      y,
    })
    if (response.data.success) {
      return response
    }
  } catch (error) {
    console.error(error)
  }
}

import axios from 'axios'

export const getKmInterest = async (id: string) => {
  try {
    const response = await axios.get(`/ggi/api/interest/map/km/${id}`)
    console.log(response)
    if (response.data.success) {
      return response.data
    }
  } catch (error) {
    console.error(error)
  }
}

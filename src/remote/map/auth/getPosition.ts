import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'

export const getPosition = async (
  addr: string,
  setUser: Dispatch<SetStateAction<any>>,
) => {
  try {
    const response = await axios.post('/ggi/api/map/position', {
      sd: addr.split(' ')[0],
      sgg: addr.split(' ')[1],
      umd: addr.split(' ')[2],
    })
    if (response.data.success) {
      return response.data.data
    }
  } catch (error) {
    console.error(error)
  }
}

import axios from 'axios'

export const getAuth = async (token: string, Api_Key: string) => {
  try {
    const response = await axios.post(
      `/ggi/api/auth/asp`,
      {},
      {
        headers: {
          'Content-Type': 'Application/json',
          Api_Key: Api_Key,
          Authorization: token,
        },
      },
    )
    if (response.data.success === true) {
      return response
    }
  } catch (error) {
    console.error(error)
  }
}

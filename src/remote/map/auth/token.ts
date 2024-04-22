import axios from 'axios'

export default async function handleToken(token: string) {
  try {
    const response = await axios.post(
      `/ggi/api/auth/asp`,
      {},
      {
        headers: {
          'Content-Type': 'Application/json',
          Api_Key: 'iyv0Lk8v.GMiSXcZDDSRLquqAm7M9YHVwTF4aY8zr',
          Authorization: token,
        },
      },
    )
    if (response.data.success === true) {
      return response.data.data
    }
  } catch (error) {
    console.error(error)
  }
}

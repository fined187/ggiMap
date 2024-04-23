import axios from 'axios'
export default async function handleToken(token: string) {
  try {
    const response = await axios.post(
      `https://dev-api.ggi.co.kr:8443/ggi/api/auth/asp`,
      {},
      {
        headers: {
          'Content-Type': 'Application/json',
          Api_Key: 'iyv0Lk8v.GMiSXcZDDSRLquqAm7M9YHVwTF4aY8zr',
          Authorization:
            'aspeyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiZXN0IiwiaWF0IjoxNzEyMjE2MDIxLCJleHAiOjE3MTc0MDAwMjF9.-02DzRz0XSu0D2f0pL48hp4QWcFr0tUfsKJr3Ukx1ueMYgOluZ3FZDqmhqR5yBAI7X-doBnR6LPpcCh1lZ3g5A',
        },
      },
    )
    if (response.data.success === true) {
      console.log(response.data.data)
      return response.data.data
    }
  } catch (error) {
    console.error(error)
  }
}

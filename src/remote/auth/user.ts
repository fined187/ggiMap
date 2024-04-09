import baseApiInstance from '../baseURL'

export default async function getUser() {
  const response = await baseApiInstance.post('ggi/api/map/address', {
    aesUserId: 'Ug3033i0SuUmGQaRK2XcxQ==',
  })
  return response.data.data
}

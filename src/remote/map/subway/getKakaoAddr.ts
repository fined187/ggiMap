import baseApiInstance from './baseURL'

export const getKakaoAddr = async (keyword: string) => {
  try {
    const response = await baseApiInstance.get(
      `/v2/local/search/address.json?query=${keyword}&page=1&size=15`,
    )
    return response.data.documents
  } catch (error) {
    console.error(error)
  }
}

import baseApiInstance from './baseURL'

export default async function getSubway(subwayStationName: string) {
  const response = await baseApiInstance.get(
    `/v2/local/search/keyword.json?query=${subwayStationName}&page=1&size=15`,
  )
  return response.data
}

import getSubway from '@/remote/map/subway/getSubway'

const useSubwayStation = async (keyword: string) => {
  try {
    const response = await getSubway(keyword)
    const subwayLists = response.documents
    return subwayLists
  } catch (error) {
    console.error(error)
  }
}

export default useSubwayStation

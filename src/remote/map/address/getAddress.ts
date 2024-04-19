import baseApiInstance from './baseURL'

export default async function getAddress(addr: string) {
  const response = await baseApiInstance.get(
    `/req/data?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&key=27619A99-57CC-3447-AC94-15541E5FF45A&attrfilter=sig_kor_nm:like:${addr}`,
  )
  console.log(response.data)
  return response.data
}

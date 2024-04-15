import baseApiInstance from './baseURL'

export default async function getAddress(addr: string) {
  const response = await baseApiInstance.get(
    `&attrfilter=sig_kor_nm:like:${addr}`,
  )
  console.log(response.data)
  return response.data
}

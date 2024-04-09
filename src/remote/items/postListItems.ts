import { useMutation } from 'react-query'
import baseApiInstance from '../baseURL'

interface FormData {
  ids: string
  km: boolean
  kw: boolean
  gm: boolean
  gg: boolean
  x1: number
  y1: number
  x2: number
  y2: number
  ekm: boolean
  egm: boolean
  egg: boolean
  fromAppraisalAmount: number
  toAppraisalAmount: number
  fromMinimumAmount: number
  toMinimumAmount: number
  interests: boolean
  awardedMonths: number
  userId: string
}

async function postListItems(formData: FormData) {
  try {
    const response = await baseApiInstance.post('ggi/api/map/items', {
      formData,
    })
    return response.data.data
  } catch (error) {
    console.error(error)
  }
}

export default postListItems

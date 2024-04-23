import { useMutation } from 'react-query'
import baseApiInstance from '../baseURL'
import { ListData } from '@/models/MapItem'
import { Dispatch, SetStateAction } from 'react'
import axios from 'axios'

async function postListItems(formData: ListData) {
  const response = await axios.post('/ggi/api/map/items', formData)
  return response.data.data
}

export default postListItems

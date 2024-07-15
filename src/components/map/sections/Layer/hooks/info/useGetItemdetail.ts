import {
  getGgDetail,
  getGmDetail,
  getKmDetail,
  getKwDetail,
} from '@/remote/map/info/getDetail'
import { useQuery } from 'react-query'

export const useGetKmItemdetail = (id: string) => {
  return useQuery(['getDetail', id], () => getKmDetail(id))
}

export const useGetKwItemdetail = (id: string) => {
  return useQuery(['getDetail', id], () => getKwDetail(id))
}

export const useGetGmItemdetail = (id: string) => {
  return useQuery(['getDetail', id], () => getGmDetail(id))
}

export const useGetGgItemdetail = (id: string) => {
  return useQuery(['getDetail', id], () => getGgDetail(id))
}

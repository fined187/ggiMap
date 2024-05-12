import {
  getGgDetail,
  getGmDetail,
  getKmDetail,
  getKwDetail,
} from '@/remote/map/info/getDetail'
import { useQuery } from 'react-query'

export function useGetKmItemdetail(id: string) {
  return useQuery(['getDetail', id], () => getKmDetail(id))
}

export function useGetKwItemdetail(id: string) {
  return useQuery(['getDetail', id], () => getKwDetail(id))
}

export function useGetGmItemdetail(id: string) {
  return useQuery(['getDetail', id], () => getGmDetail(id))
}

export function useGetGgItemdetail(id: string) {
  return useQuery(['getDetail', id], () => getGgDetail(id))
}

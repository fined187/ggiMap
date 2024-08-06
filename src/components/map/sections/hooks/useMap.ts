import { Coordinates, NaverMap } from '@/models/Map'
import { useCallback } from 'react'
import { useQueryClient } from 'react-query'
import useSWR, { mutate } from 'swr'

export const INITIAL_CENTER: Coordinates = [37.497013, 127.0114263]
export const INITIAL_ZOOM = 16

export const MAP_KEY = '/map'

const useMap = () => {
  const { data: map } = useSWR(MAP_KEY)

  const initializeMap = useCallback((map: NaverMap) => {
    mutate(MAP_KEY, map)
  }, [])

  const queryClient = useQueryClient()
  const initMap = useCallback((map: NaverMap) => {
    return queryClient.setQueryData<NaverMap>(MAP_KEY, map)
  }, [])

  const resetMapOptions = useCallback(() => {
    map.morph(new naver.maps.LatLng(...INITIAL_CENTER), INITIAL_ZOOM)
  }, [map])

  const getMapOptions = useCallback(() => {
    const mapCenter = map.getCenter()
    const center: Coordinates = [mapCenter.lat(), mapCenter.lng()]
    const zoom = map?.getZoom()
    return { center, zoom }
  }, [map])
  return {
    initializeMap,
    resetMapOptions,
    getMapOptions,
    initMap,
  }
}

export default useMap

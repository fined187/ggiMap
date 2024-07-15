import { NaverMap } from '@/models/Map'
import { useCallback } from 'react'
import useSWR, { mutate } from 'swr'

export const MINI_MAP_KEY = '/minimap'

const useMiniMap = () => {
  const { data: miniMap } = useSWR(MINI_MAP_KEY)

  const initializeMiniMap = useCallback((miniMap: NaverMap) => {
    mutate(MINI_MAP_KEY, miniMap)
  }, [])

  const resetMiniMapOptions = useCallback(() => {
    miniMap.morph(new naver.maps.LatLng(37.497013, 127.0114263), 16)
  }, [miniMap])

  const getMapOptions = useCallback(() => {
    const mapCenter = miniMap.getCenter()
    const center: [number, number] = [mapCenter.lat(), mapCenter.lng()]
    const zoom = miniMap?.getZoom()
    return { center, zoom }
  }, [miniMap])
  return {
    initializeMiniMap,
    resetMiniMapOptions,
    getMapOptions,
  }
}

export default useMiniMap

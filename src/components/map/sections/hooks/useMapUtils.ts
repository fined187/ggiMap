import { MAP_KEY } from './useMap'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import { useCallback, useEffect, useState } from 'react'
import { MapCountsResponse } from '@/models/MapItem'
import { authInfo } from '@/store/atom/auth'
import { UseQueryResult, useQuery } from 'react-query'
import { NaverMap } from '@/models/Map'

const useMapUtils = () => {
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })
  const setFormData = useSetRecoilState(formDataAtom)
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [openOverlay, setOpenOverlay] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const auth = useRecoilValue(authInfo)

  const initialMapType = {
    basic: true,
    terrain: false,
    satellite: false,
    cadastral: false,
    interest: false,
    roadView: false,
    current: false,
    distance: false,
    area: false,
  }

  const [clickedMapType, setClickedMapType] = useState(initialMapType)

  const syncMapTypeToForm = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      interests: clickedMapType.interest,
    }))
  }, [clickedMapType.interest, setFormData])

  useEffect(() => {
    if (!map) return
    map?.setCenter({
      lat: auth.lat,
      lng: auth.lng,
    })
  }, [map, auth.lat, auth.lng])

  useEffect(() => {
    syncMapTypeToForm()
  }, [clickedMapType, syncMapTypeToForm])

  return {
    mapCount,
    setMapCount,
    openOverlay,
    setOpenOverlay,
    isOpen,
    setIsOpen,
    clickedMapType,
    setClickedMapType,
  }
}

export default useMapUtils

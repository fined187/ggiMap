import { NaverMap } from '@/models/Map'
import useSWR from 'swr'
import { MAP_KEY } from './useMap'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import { useCallback, useEffect, useState } from 'react'
import { MapCountsResponse } from '@/models/MapItem'
import { authInfo } from '@/store/atom/auth'

const useMapUtils = (
  token: string,
  type: string,
  idCode: string,
  handleParameters: (
    params1: string,
    params2: string,
    params3?: string,
    map?: NaverMap,
  ) => void,
) => {
  const { data: map } = useSWR(MAP_KEY)
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [openOverlay, setOpenOverlay] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const auth = useRecoilValue(authInfo)

  // 초기 맵 타입 설정
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
    handleParameters(token, type, idCode, map as NaverMap)
    map.setCenter({
      lat: auth.lat,
      lng: auth.lng,
    })
  }, [map, idCode, type, token, handleParameters, auth.lat, auth.lng])

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

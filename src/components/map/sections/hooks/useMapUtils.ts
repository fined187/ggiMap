import { NaverMap } from '@/models/Map'
import useSWR from 'swr'
import { MAP_KEY } from './useMap'
import { useRecoilState } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import { useCallback, useEffect, useState } from 'react'
import { MapCountsResponse } from '@/models/MapItem'

type PnuCount = {
  pnu: string
  type: number
  count: number
  includeYn: boolean
}

const useMapUtils = (
  token: string,
  type: string,
  idCode: string,
  handleParameters: (
    params1?: string,
    params2?: string,
    params3?: string,
    map?: NaverMap,
  ) => void,
) => {
  const { data: map } = useSWR(MAP_KEY)
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [openOverlay, setOpenOverlay] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [clickedMapType, setClickedMapType] = useState({
    basic: true,
    terrain: false,
    satellite: false,
    cadastral: false,
    interest: false,
    roadView: false,
    current: false,
    distance: false,
    area: false,
  })

  const handleSyncMap = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      interests: clickedMapType.interest,
    }))
  }, [clickedMapType.interest, setFormData])

  useEffect(() => {
    if (map) {
      handleParameters(token, type, idCode, map as NaverMap)
    }
  }, [map, idCode, type, token])

  useEffect(() => {
    handleSyncMap()
  }, [clickedMapType])

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

import { MapItem } from '@/models/MapItem'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import IconContent from './IconContent'
import { useRecoilState } from 'recoil'
import { clickedItemAtom, markerPositionAtom } from '@/store/atom/map'

interface MarkerRendererProps {
  item: MapItem
  index: number
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
}

const MarkerRenderer = ({
  item,
  index,
  openOverlay,
  setOpenOverlay,
  markerClickedRef,
}: MarkerRendererProps) => {
  const { data: map } = useSWR(MAP_KEY)
  const [isSame, setIsSame] = useState<boolean>(false)
  const [includeYn, setIncludeYn] = useState<boolean>(false)
  const markerRef = useRef<naver.maps.Marker | null>(null)
  const [markerPosition, setMarkerPosition] = useRecoilState(markerPositionAtom)
  const [clickedItem, setClickedItem] = useRecoilState(clickedItemAtom)

  const handleItemUsage = useCallback(() => {
    if (item.usage.length >= 4) {
      if (item.usage === '단독,다가구') return '다가구'
      if (item.usage === '연립.다세대') return '다세대'
      if (item.usage === '전,답,과수') return '전답과'
      if (item.usage === '기타토지') return '기타'
      if (item.usage === '상업시설') return '상업'
      if (item.usage === '공업시설') return '공업'
      return item.usage.slice(0, 2) + '<br />' + item.usage.slice(2, 4)
    }
    return item.usage
  }, [item.usage])

  const handleZIndex = useCallback((types: number) => {
    if (types === 1) return 100
    if (types === 2) return 90
    if (types === 3) return 80
    if (types === 4) return 60
  }, [])

  const handleMarkerClick = useCallback(
    (item: MapItem) => {
      if (clickedItem === item) {
        setOpenOverlay(!openOverlay)
        markerClickedRef.current = !openOverlay
        setClickedItem(openOverlay ? null : item)
      } else {
        setOpenOverlay(true)
        markerClickedRef.current = true
        setClickedItem(item)
      }
    },
    [
      clickedItem,
      setOpenOverlay,
      setClickedItem,
      markerClickedRef,
      openOverlay,
    ],
  )
  let markers: naver.maps.Marker[] = []
  useEffect(() => {
    if (
      !map ||
      typeof window === 'undefined' ||
      IconContent === undefined ||
      typeof window.naver.maps.Marker === 'undefined'
    )
      return

    if (markers) {
      markers.forEach((marker) => {
        naver.maps.Event?.clearInstanceListeners(marker)
        marker.setMap(null)
      })
    }
    markers = []
    const zoomLevel = map?.getZoom()
    const marker = new window.naver.maps.Marker({
      map: map,
      position: new window.naver.maps.LatLng(item.y, item.x),
      icon: {
        content: IconContent({
          item,
          isSame,
          count: item.count || 0,
          includeYn,
          handleItemUsage,
          index,
          zoomLevel: zoomLevel || 0,
        }),
        anchor: new window.naver.maps.Point(12, 12),
      },
    })
    marker.setZIndex(handleZIndex(item.types[0]))
    markers.push(marker)

    if (marker) {
      markerRef.current = marker
      naver.maps.Event?.addListener(marker, 'mouseover', () => {
        marker.setZIndex(110)
      })
      naver.maps.Event?.addListener(marker, 'mouseout', () => {
        item.types[0] === 1
          ? marker.setZIndex(100)
          : item.types[0] === 2
          ? marker.setZIndex(90)
          : item.types[0] === 3
          ? marker.setZIndex(80)
          : marker.setZIndex(60)
      })
      naver.maps.Event?.addListener(marker, 'click', () => {
        handleMarkerClick(item)
        const target = document.getElementById(`target_${index}`)
        if (target) {
          const rect = target.getBoundingClientRect()
          setMarkerPosition((prev) => {
            return {
              position: [0, 0],
              type: [1],
              winYn: item.winYn,
            }
          })
          setMarkerPosition((prev) => {
            return {
              position: [rect.left, rect.top],
              type: item.types,
              winYn: item.winYn,
            }
          })
        }
      })
    }

    return () => {
      if (markers) {
        markers.forEach((marker) => {
          marker.setMap(null)
        })
      }
    }
  }, [
    map,
    item,
    index,
    isSame,
    includeYn,
    handleItemUsage,
    openOverlay,
    clickedItem,
    handleMarkerClick,
    setMarkerPosition,
  ])
  return null
}

export default MarkerRenderer

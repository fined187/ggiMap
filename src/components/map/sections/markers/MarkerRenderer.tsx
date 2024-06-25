import { MapItem } from '@/models/MapItem'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import IconContent from './IconContent'
import { useRecoilState } from 'recoil'
import {
  clickedItemAtom,
  listOverItemAtom,
  markerPositionAtom,
} from '@/store/atom/map'

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
  const markerRef = useRef<naver.maps.Marker | null>(null)
  const [markerPosition, setMarkerPosition] = useRecoilState(markerPositionAtom)
  const [clickedItem, setClickedItem] = useRecoilState(clickedItemAtom)
  const [listOver, setListOver] = useRecoilState(listOverItemAtom)
  let markers: naver.maps.Marker[] = []

  const handleItemUsage = useCallback(() => {
    switch (item.usage) {
      case '단독,다가구':
        return '다가구'
      case '연립.다세대':
        return '다세대'
      case '전,답,과수':
        return '전답과'
      case '기타토지':
        return '기타'
      case '상업시설':
        return '상업'
      case '공업시설':
        return '공업'
      default:
        return item.usage.length >= 4
          ? `${item.usage.slice(0, 2)}<br />${item.usage.slice(2, 4)}`
          : item.usage
    }
  }, [item?.usage])

  const handleZIndex = useCallback((types: number, yn: string) => {
    if (types === 1 && yn !== 'Y') return 100
    if (types === 2 && yn !== 'Y') return 90
    if (types === 3 && yn !== 'Y') return 80
    if (types === 4) return 60
    if (yn === 'Y') return 70
  }, [])

  const handleMarkerClick = useCallback(
    (item: MapItem) => {
      const isSelected = clickedItem === item
      setOpenOverlay(isSelected ? !openOverlay : true)
      markerClickedRef.current = isSelected ? !openOverlay : true
      setClickedItem(isSelected ? null : item)
    },
    [
      clickedItem,
      setOpenOverlay,
      setClickedItem,
      markerClickedRef,
      openOverlay,
    ],
  )

  useEffect(() => {
    if (!map || !item || map.getZoom() < 15) return

    const removeAllMarkers = () => {
      markers.forEach((marker) => {
        naver.maps.Event?.clearInstanceListeners(marker)
        marker.setMap(null)
      })
      markers = []
    }
    removeAllMarkers()
    const zoomLevel = map.getZoom()
    const marker = new window.naver.maps.Marker({
      map: map,
      position: new window.naver.maps.LatLng(item.y, item.x),
      icon: {
        content: IconContent({
          item,
          handleItemUsage,
          index,
          zoomLevel: zoomLevel || 0,
          winExist: item.winExist,
        }),
        anchor: new window.naver.maps.Point(12, 12),
      },
      animation:
        listOver.isOver && item.x === listOver.x && item.y === listOver.y
          ? naver.maps.Animation.BOUNCE
          : null,
    })
    marker.setZIndex(handleZIndex(item.types[0], item.winYn))
    markers.push(marker)

    markerRef.current = marker

    naver.maps.Event?.addListener(marker, 'mouseover', () => {
      marker.setZIndex(110)
    })
    naver.maps.Event?.addListener(marker, 'mouseout', () => {
      marker.setZIndex(handleZIndex(item.types[0], item.winYn))
    })
    naver.maps.Event?.addListener(marker, 'click', () => {
      handleMarkerClick(item)
      const target = document.getElementById(`target_${index}`)
      if (target) {
        const rect = target.getBoundingClientRect()
        setMarkerPosition({
          position: [rect.left, rect.top],
          type: item.types,
          winYn: item.winYn,
        })
      }
    })
    return () => removeAllMarkers()
  }, [
    map,
    item,
    index,
    handleItemUsage,
    openOverlay,
    clickedItem,
    handleMarkerClick,
    setMarkerPosition,
    listOver.isOver,
  ])
  return null
}

export default MarkerRenderer

import { MapItem } from '@/models/MapItem'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { MAP_KEY } from '../hooks/useMap'
import IconContent from './IconContent'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  clickedItemAtom,
  isPanoramaVisibleAtom,
  listOverItemAtom,
  markerPositionAtom,
} from '@/store/atom/map'
import { UseQueryResult, useQuery } from 'react-query'
import { NaverMap } from '@/models/Map'
import { MINI_MAP } from '../MiniMap'

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
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })
  const markerRef = useRef<naver.maps.Marker | null>(null)
  const setMarkerPosition = useSetRecoilState(markerPositionAtom)
  const [clickedItem, setClickedItem] = useRecoilState(clickedItemAtom)
  const listOver = useRecoilValue(listOverItemAtom)
  const isPanoVisible = useRecoilValue(isPanoramaVisibleAtom)
  const { data: miniMap }: UseQueryResult<NaverMap> = useQuery(MINI_MAP, {
    enabled: false,
  })
  const handleItemUsage = useCallback(() => {
    const usageMapping: { [key: string]: string } = {
      단독: '단독',
      다가구: '다가구',
      연립: '연립',
      다세대: '다세대',
      전: '전',
      답: '답',
      과수: '과수',
      기타토지: '기타',
      상업시설: '상업',
      공업시설: '공업',
    }

    const mappedUsage = usageMapping[item.usage]
    if (!mappedUsage) {
      if (item.usage.length >= 4) {
        return `${item.usage.slice(0, 2)}<br />${item.usage.slice(2, 4)}`
      } else {
        return item.usage
      }
    }

    return mappedUsage
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
      if (isPanoVisible) return
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
      isPanoVisible,
    ],
  )

  const handleAnchor = useCallback(() => {
    if (map) {
      if (map.getZoom() >= 16) return new window.naver.maps.Point(0, 0)
      if (map.getZoom() >= 15) return new window.naver.maps.Point(1, 1)
    }
  }, [map])

  useEffect(() => {
    if (!map || !item || map.getZoom() < 15) return
    const zoomLevel = map?.getZoom()
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
        anchor: handleAnchor(),
      },
      animation:
        listOver.isOver && item.x === listOver.x && item.y === listOver.y
          ? naver.maps.Animation.BOUNCE
          : null,
    })
    marker.setZIndex(
      listOver.isOver && item.x === listOver.x && item.y === listOver.y
        ? 110
        : handleZIndex(item.types[0], item.winYn),
    )

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
    return () => {
      marker.setMap(null)
    }
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
    isPanoVisible,
    miniMap,
  ])
  return null
}

export default MarkerRenderer

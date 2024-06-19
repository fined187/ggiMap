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

type PnuProps = {
  pnu: string
  count: number
  type: number
  includeYn: boolean
}

interface MarkerRendererProps {
  item: MapItem
  index: number
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
  originPnuCounts: {
    updatedCounts: PnuProps[]
  }
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  handleFilterMarkers: () => MapItem[] | undefined
}

const MarkerRenderer = ({
  item,
  index,
  pnuCounts,
  originPnuCounts,
  openOverlay,
  setOpenOverlay,
  markerClickedRef,
  handleFilterMarkers,
}: MarkerRendererProps) => {
  const { data: map } = useSWR(MAP_KEY)
  const [count, setCount] = useState<number>(0)
  const [originCount, setOriginCount] = useState<number>(0)
  const [isSame, setIsSame] = useState<boolean>(false)
  const [includeYn, setIncludeYn] = useState<boolean>(false)
  const markerRef = useRef<naver.maps.Marker | null>(null)
  const [markerPosition, setMarkerPosition] = useRecoilState(markerPositionAtom)
  const [clickedItem, setClickedItem] = useRecoilState(clickedItemAtom)
  const targetRef = useRef<HTMLElement | HTMLDivElement | null>(null)

  const handleGetItemCounts = useCallback(() => {
    const pnuCount =
      pnuCounts.updatedCounts.find((pnu) => pnu.pnu === item.pnu)?.count ?? 0
    const pnuOriginCount =
      originPnuCounts.updatedCounts.find((pnu) => pnu.pnu === item.pnu)
        ?.count ?? 0
    const originIncludeYn = originPnuCounts.updatedCounts.find(
      (pnu) => pnu.pnu === item.pnu && pnu.includeYn === true,
    )
    const includeYn = pnuCounts.updatedCounts.find(
      (pnu) => pnu.pnu === item.pnu && pnu.includeYn === true,
    )
    setCount(pnuCount)
    setOriginCount(pnuOriginCount)
    setIsSame(pnuCount === pnuOriginCount)
    setIncludeYn(originIncludeYn ? true : includeYn ? true : false)
  }, [item.pnu, pnuCounts, originPnuCounts])

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

  useEffect(() => {
    handleGetItemCounts()
  }, [handleGetItemCounts])

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
    [clickedItem, setOpenOverlay, setClickedItem, markerClickedRef],
  )
  let markers: naver.maps.Marker[] = []
  useEffect(() => {
    if (!map || typeof window.naver === 'undefined' || !handleFilterMarkers())
      return

    const zoomLevel = map?.getZoom()
    const marker = new window.naver.maps.Marker({
      map: map,
      position: new window.naver.maps.LatLng(item.y, item.x),
      icon: {
        content: IconContent({
          item,
          originCount,
          isSame,
          includeYn,
          handleItemUsage,
          index,
          zoomLevel,
          ref: targetRef.current,
        }),
      },
    })
    markers.push(marker)
    if (marker) {
      markerRef.current = marker
      naver.maps.Event?.addListener(marker, 'mouseover', () => {
        marker.setZIndex(110)
      })
      naver.maps.Event?.addListener(marker, 'mouseout', () => {
        item.type === 1
          ? marker.setZIndex(100)
          : item.type === 2
          ? marker.setZIndex(90)
          : item.type === 3
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
              type: 1,
              winYn: item.winYn,
            }
          })
          setMarkerPosition((prev) => {
            return {
              position: [rect.left, rect.top],
              type: item.type,
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
    originCount,
    isSame,
    includeYn,
    handleItemUsage,
    pnuCounts,
    openOverlay,
    clickedItem,
    handleMarkerClick,
    setMarkerPosition,
    handleFilterMarkers,
  ])
  return null
}

export default MarkerRenderer

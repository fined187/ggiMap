import { NaverMap } from '@/models/Map'
import { useEffect, useRef, useState } from 'react'
import { MapItem } from '@/models/MapItem'
import getPolypath from '@/remote/map/selected/getPolypath'
import { ItemDetail } from '@/models/ItemDetail'

declare global {
  interface Window {
    naver: any
    kakao: any
  }
}

interface MiniMapProps {
  clickedItem: MapItem | null
  clickedInfo: ItemDetail[] | null
  index: number
}

export default function MiniMap({
  clickedItem,
  clickedInfo,
  index,
}: MiniMapProps) {
  const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`
  const mapRef = useRef<NaverMap | null>(null)
  const [path, setPath] = useState<number[][]>([])
  const [maps, setMaps] = useState<any>(null)
  const [roadViewAvailable, setRoadViewAvailable] = useState<boolean>(false)

  const delay = () => new Promise((resolve) => setTimeout(resolve, 100))
  console.log(clickedInfo)
  useEffect(() => {
    if (!clickedInfo || !clickedItem) return

    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL

    const handleChangeXY = () => {
      if (clickedInfo[index]?.roadViewInfo?.isChange) {
        return {
          x: clickedInfo[index]?.roadViewInfo?.changeX,
          y: clickedInfo[index]?.roadViewInfo?.changeY,
        }
      } else {
        return {
          x: clickedItem?.x,
          y: clickedItem?.y,
        }
      }
    }

    const onLoadScript = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('miniMap')
        const options = {
          center: new window.kakao.maps.LatLng(
            handleChangeXY().y as number,
            handleChangeXY().x as number,
          ),
          level: 2,
        }
        console.log(options)
        const roadviewContainer = document.getElementById('roadview')
        const roadview = new window.kakao.maps.Roadview(roadviewContainer)
        const rvClient = new window.kakao.maps.RoadviewClient()
        const position = new window.kakao.maps.LatLng(
          clickedItem?.y as number,
          clickedItem?.x as number,
        )
        console.log(handleChangeXY())
        rvClient.getNearestPanoId(position, 50, () => {
          if (clickedInfo[index]?.roadViewInfo?.panoId) {
            setRoadViewAvailable(true)
            delay().then(() => {
              const panoId = clickedInfo[index]?.roadViewInfo?.panoId
              roadview.setPanoId(panoId, position)
              window.kakao.maps.event.addListener(roadview, 'init', () => {
                roadview.setViewpoint({
                  pan: clickedInfo[index]?.roadViewInfo?.pan,
                  tilt: clickedInfo[index]?.roadViewInfo?.tilt,
                  zoom: clickedInfo[index]?.roadViewInfo?.zoom,
                })
              })
            })
          } else {
            setRoadViewAvailable(false)
            delay().then(() => {
              const map = new window.kakao.maps.Map(container, options)
              map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT)
              mapRef.current = map
              setMaps(map)
            })
          }
        })
      })
    }
    script.onload = onLoadScript
    document.head.appendChild(script)
    return () => {
      script.onload = null
      document.head.removeChild(script)
      setMaps(null)
      if (roadViewAvailable) {
        setRoadViewAvailable(false)
      }
    }
  }, [clickedInfo, index, clickedItem, KAKAO_SDK_URL])

  useEffect(() => {
    if (!clickedItem || roadViewAvailable) return
    const handleGetPolypath = async () => {
      try {
        const response = await getPolypath(
          clickedItem?.y as number,
          clickedItem?.x as number,
        )
        if (response && Array.isArray(response)) {
          setPath(response)
        }
      } catch (error) {
        console.error(error)
      }
    }

    handleGetPolypath()
  }, [clickedItem, roadViewAvailable])

  useEffect(() => {
    const drawPolyline = () => {
      if (!path.length || !mapRef.current || typeof path === 'undefined') return
      const polyline = new window.kakao.maps.Polyline({
        path: path?.map(
          (coord) => new window.kakao.maps.LatLng(coord[0], coord[1]),
        ),
        strokeWeight: 2,
        strokeColor: '#FF0000',
        strokeOpacity: 1,
        strokeStyle: 'solid',
      })
      polyline.setMap(mapRef.current)
      const bounds = new window.kakao.maps.LatLngBounds()
      path.forEach((coord) => {
        bounds.extend(new window.kakao.maps.LatLng(coord[0], coord[1]))
      })
      maps.setBounds(bounds)
    }
    if (!roadViewAvailable && maps) {
      drawPolyline()
    }
  }, [path, roadViewAvailable, maps])

  return (
    <>
      <div
        id="roadview"
        style={{
          display: roadViewAvailable ? 'block' : 'none',
          width: '298px',
          height: '100%',
          borderRadius: '8px 8px 0px 0px',
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 100,
          cursor: 'pointer',
        }}
      />
      <div
        id="miniMap"
        style={{
          width: '298px',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0',
          borderRadius: '8px 8px 0px 0px',
          display: roadViewAvailable ? 'none' : 'block',
          zIndex: 1,
        }}
      />
    </>
  )
}

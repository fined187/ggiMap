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

type Props = {
  lat: number
  lng: number
}

interface MiniMapProps {
  clickedItem: MapItem | null
  clickedInfo: ItemDetail[] | null
}

export default function MiniMap({ clickedItem, clickedInfo }: MiniMapProps) {
  const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`
  const mapRef = useRef<NaverMap | null>(null)
  const [path, setPath] = useState<number[][]>([])
  const [maps, setMaps] = useState<any>(null)
  const [roadViewAvailable, setRoadViewAvailable] = useState<boolean>(false)
  const [getLatLngArr, setGetLatLngArr] = useState<Props[]>([])

  useEffect(() => {
    setGetLatLngArr(
      Array.from({ length: clickedInfo?.length ?? 0 }, () => ({
        lat: clickedItem?.y || 0,
        lng: clickedItem?.x || 0,
      })),
    )
  }, [clickedInfo, clickedItem])
  useEffect(() => {
    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL
    document.head.appendChild(script)
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('miniMap')
        const options = {
          center: new window.kakao.maps.LatLng(clickedItem?.y, clickedItem?.x),
          level: 2,
        }
        const roadviewContainer = document.getElementById('roadview')
        const roadview = new window.kakao.maps.Roadview(roadviewContainer)
        const rvClient = new window.kakao.maps.RoadviewClient()
        const position = new window.kakao.maps.LatLng(
          clickedItem?.y,
          clickedItem?.x,
        )

        rvClient.getNearestPanoId(position, 50, (panoId: any) => {
          if (panoId) {
            setRoadViewAvailable(true)
            roadview.setPanoId(panoId, position)
            roadview.setViewpoint({
              pan: 10,
              tilt: 0,
              zoom: 0,
            })
          } else {
            setRoadViewAvailable(false)
            const map = new window.kakao.maps.Map(container, options)
            map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT)

            mapRef.current = map
            setMaps(map)
          }
        })
      })
    }
    return () => {
      document.head.removeChild(script)
    }
  }, [clickedItem, KAKAO_SDK_URL])

  useEffect(() => {
    const handleGetPolypath = async () => {
      const response = await getPolypath(
        clickedItem?.x as number,
        clickedItem?.y as number,
      )
      setPath(response)
    }

    handleGetPolypath()
  }, [clickedItem?.x, clickedItem?.y])

  useEffect(() => {
    const drawPolyline = () => {
      if (path?.length === 0 || !mapRef.current) return
      let polyline = new window.kakao.maps.Polyline({
        path: path?.map(
          (coord) => new window.kakao.maps.LatLng(coord[0], coord[1]),
        ),
        strokeWeight: 2,
        strokeColor: '#FF0000',
        strokeOpacity: 1,
        strokeStyle: 'solid',
      })
      polyline.setMap(mapRef.current)
      let bounds = new window.kakao.maps.LatLngBounds()
      path?.forEach((coord) => {
        bounds.extend(new window.kakao.maps.LatLng(coord[0], coord[1]))
      })
      maps.setBounds(bounds)
    }
    if (!roadViewAvailable) {
      drawPolyline()
    }
  }, [path, roadViewAvailable, maps])

  return (
    <>
      <div
        id="roadview"
        style={{
          display: roadViewAvailable ? 'block' : 'none',
          width: '299px',
          height: '100%',
          borderRadius: '8px 8px 0px 0px',
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 1,
        }}
      />
      <div
        id="miniMap"
        style={{
          width: '299px',
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

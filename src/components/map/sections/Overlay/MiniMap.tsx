import { NaverMap } from '@/models/Map'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { MapItem } from '@/models/MapItem'
import getPolypath from '@/remote/map/selected/getPolypath'

declare global {
  interface Window {
    naver: any
    kakao: any
  }
}

interface MiniMapProps {
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
}

export default function MiniMap({ clickedItem, setClickedItem }: MiniMapProps) {
  const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`
  const mapRef = useRef<NaverMap | null>(null)
  const [path, setPath] = useState<number[][]>([])

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
        const map = new window.kakao.maps.Map(container, options)
        map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT)
        mapRef.current = map
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
      if (path.length === 0 || !mapRef.current) return
      let polyline = new window.kakao.maps.Polyline({
        path: path.map(
          (coord) => new window.kakao.maps.LatLng(coord[0], coord[1]),
        ),
        strokeWeight: 2,
        strokeColor: '#FF0000',
        strokeOpacity: 1,
        strokeStyle: 'solid',
      })
      polyline.setMap(mapRef.current)
    }
    drawPolyline()
  }, [path])

  return (
    <>
      <div
        id="miniMap"
        style={{
          width: '299px',
          height: '100%',
          borderRadius: '8px 8px 0px 0px',
        }}
      ></div>
    </>
  )
}

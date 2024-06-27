import { NaverMap } from '@/models/Map'
import { isPanoramaVisibleAtom } from '@/store/atom/map'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useRecoilValue } from 'recoil'

interface MiniMapProps {
  map: NaverMap
  clickedLatLng: {
    lat: number
    lng: number
  }
  setClickedMarker: Dispatch<SetStateAction<naver.maps.Marker | null>>
  setIsPanoVisible: Dispatch<SetStateAction<boolean>>
}

export default function MiniMap({
  clickedLatLng,
  setClickedMarker,
  setIsPanoVisible,
  map,
}: MiniMapProps) {
  const [miniMap, setMiniMap] = useState<NaverMap | null>(null)
  const isPanoramaVisible = useRecoilValue(isPanoramaVisibleAtom)
  const initializeMiniMap = useCallback(
    (map: NaverMap) => {
      if (!map) return
      let semaphore = false
      const miniMapElement = document.getElementById('minimap')
      if (!miniMapElement) return

      const minimap = new window.naver.maps.Map(miniMapElement, {
        bounds: map.getBounds(),
        scrollWheel: false,
        scaleControl: false,
        mapDataControl: false,
        logoControl: false,
      })
      setMiniMap(minimap)
      const control: HTMLElement[] = []
      control.push(miniMapElement)
      const roadview = new window.naver.maps.StreetLayer()
      roadview.setMap(minimap)

      let marker = new window.naver.maps.Marker({
        position: {
          lat: clickedLatLng?.lat ?? 0,
          lng: clickedLatLng?.lng ?? 0,
        },
        map: minimap,
      })

      window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
        if (semaphore) return
        minimap.fitBounds(map.getBounds())
      })

      window.naver.maps.Event.addListener(minimap, 'click', (e: any) => {
        const latlng = e.coord
        marker.setPosition(latlng)
        setClickedMarker(marker)
        setIsPanoVisible(true)
        new window.naver.maps.Panorama('pano', {
          position: new window.naver.maps.LatLng(latlng._lat, latlng._lng),
          pov: {
            pan: 0,
            tilt: 0,
            fov: 100,
          },
        })
      })
    },
    [clickedLatLng, setClickedMarker, setIsPanoVisible],
  )

  useEffect(() => {
    if (map && isPanoramaVisible) {
      initializeMiniMap(map)
    }
  }, [map, initializeMiniMap, isPanoramaVisible])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        right: '0',
        zIndex: 1100,
      }}
    >
      <div
        id="minimap"
        style={{
          width: '300px',
          height: '300px',
          position: 'fixed',
          zIndex: 1100,
          bottom: '0',
          right: '0',
          display: isPanoramaVisible ? 'block' : 'none',
        }}
      />
    </div>
  )
}

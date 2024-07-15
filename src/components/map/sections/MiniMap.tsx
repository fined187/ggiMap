import { NaverMap } from '@/models/Map'
import { isPanoramaVisibleAtom } from '@/store/atom/map'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
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
  pano: naver.maps.Panorama | null
}

export default function MiniMap({
  clickedLatLng,
  setClickedMarker,
  setIsPanoVisible,
  map,
  pano,
}: MiniMapProps) {
  const [miniMap, setMiniMap] = useState<NaverMap | null>(null)
  const isPanoramaVisible = useRecoilValue(isPanoramaVisibleAtom)
  const miniMapRef = useRef<NaverMap | null>(null)
  const panoChanged = useRef(false)

  const calculatePanoPan = (angle: number) => ((angle % 360) + 360) % 360

  const getMarkerIconNumber = (radius: number, divider: number) => {
    const delta = 360 / (divider || 1)
    return (Math.round(radius / delta) % divider) + 1
  }

  const initializeMiniMap = useCallback(
    (map: NaverMap) => {
      if (!map) return
      const miniMapElement = document.getElementById('minimap')
      if (!miniMapElement) return

      const minimap = new window.naver.maps.Map(miniMapElement, {
        bounds: map.getBounds(),
        scrollWheel: true,
        scaleControl: true,
        mapDataControl: true,
        logoControl: true,
      })
      setMiniMap(minimap)
      miniMapRef.current = miniMap

      const control: HTMLElement[] = []
      control.push(miniMapElement)
      const roadview = new window.naver.maps.StreetLayer()
      roadview.setMap(minimap)

      const marker = new window.naver.maps.Marker({
        position: clickedLatLng,
        map: minimap,
        icon: {
          url: '/images/roadView/rvicon1.png',
          size: new naver.maps.Size(50, 50),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 35),
        },
      })

      const updatePanoPosition = () => {
        if (panoChanged.current) return
        const center = map.getCenter()
        const proj = pano?.getProjection()
        const lookAtPov = proj?.fromCoordToPov(center as naver.maps.LatLng)
        if (lookAtPov) {
          lookAtPov.tilt = 0
          lookAtPov.fov = 100
          pano?.setPov(lookAtPov)
        }
      }

      const updateMarkerIcon = () => {
        const panValue = calculatePanoPan(pano?.getPov().pan as number)
        marker.setIcon({
          url: `/images/roadView/rvicon${getMarkerIconNumber(
            panValue,
            16,
          )}.png`,
          size: new naver.maps.Size(50, 50),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 35),
        })
      }

      window.naver.maps.Event.addListener(
        pano,
        'position_changed',
        updatePanoPosition,
      )
      window.naver.maps.Event.addListener(pano, 'pov_changed', updateMarkerIcon)

      let semaphore = false
      window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
        if (semaphore) return
        minimap.fitBounds(map.getBounds())
      })

      window.naver.maps.Event.addListener(minimap, 'click', (e: any) => {
        const latlng = e.coord
        map?.setCenter(latlng)
        marker?.setPosition(latlng)
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
    [clickedLatLng, setClickedMarker, setIsPanoVisible, pano, map],
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

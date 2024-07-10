import { NaverMap } from '@/models/Map'
import { isPanoramaVisibleAtom } from '@/store/atom/map'
import { url } from 'inspector'
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
  let pano_changed = false

  const calculatePanoPan = (argAngle: number) => {
    var panoAngle = (360 + argAngle) % 360
    panoAngle = panoAngle < 0 ? (panoAngle += 360) : panoAngle
    return panoAngle
  }

  const getMakerIconNumber = (argRadius: number, argDivider: number) => {
    argDivider = argDivider = 0 ? 360 : argDivider
    var delta = 360 / argDivider
    return (Math.round(argRadius / delta) % argDivider) + 1
  }

  const initializeMiniMap = useCallback(
    (map: NaverMap) => {
      if (!map) return
      let semaphore = false
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
        icon: {
          url: '/images/roadView/rvicon1.png',
          size: new naver.maps.Size(50, 50),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 35),
        },
      })

      window.naver.maps.Event.addListener(pano, 'position_changed', () => {
        let center = map?.getCenter()
        let proj = pano?.getProjection()
        let lookAtPov = proj?.fromCoordToPov(center as naver.maps.LatLng)

        if (pano_changed == false) {
          if (lookAtPov) {
            lookAtPov.tilt = 0
            lookAtPov.fov = 100
            pano?.setPov(lookAtPov)
          }
        }
      })

      window.naver.maps.Event.addListener(pano, 'pov_changed', () => {
        let getPanValue = calculatePanoPan(pano?.getPov().pan as number)
        console.log(getPanValue)
        marker?.setIcon({
          url:
            '/images/roadView/rvicon' +
            getMakerIconNumber(getPanValue, 16) +
            '.png',
          size: new naver.maps.Size(50, 50),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 35),
        })
      })

      window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
        if (semaphore) return
        minimap.fitBounds(map.getBounds())
      })

      window.naver.maps.Event.addListener(minimap, 'click', (e: any) => {
        const latlng = e.coord
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

import usePostMapItems from '@/hooks/items/usePostMapItems'
import { Form } from '@/models/Form'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/store/atom/postUser'
import { Coordinates, NaverMap } from '@/models/Map'
import Script from 'next/script'
import { INITIAL_CENTER, INITIAL_ZOOM } from './hooks/useMap'
import { MapCountsResponse, MapItem } from '@/models/MapItem'
import useMapCounts from '../sideMenu/searchListBox/listBox/hooks/useMapCounts'
import { mapAtom } from '@/store/atom/map'
import useDebounce from '@/components/shared/hooks/useDebounce'
import MapType from './mapType/MapType'
import MapFunction from './MapFunc/MapFunction'
declare global {
  interface Window {
    naver: any
  }
}
interface Props {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
  setCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>
  setZoom: Dispatch<SetStateAction<number>>
  clickedMapType: {
    basic: boolean
    terrain: boolean
    satellite: boolean
    cadastral: boolean
    interest: boolean
    roadView: boolean
    current: boolean
    distance: boolean
    area: boolean
  }
  mapId?: string
  initialCenter?: Coordinates
  zoom?: number
  onLoad?: (map: NaverMap) => void
  mapCount?: MapCountsResponse[]
  setMapCount?: Dispatch<SetStateAction<MapCountsResponse[]>>
  markerClickedRef: MutableRefObject<boolean>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  setClickedMapType: Dispatch<
    SetStateAction<{
      basic: boolean
      terrain: boolean
      satellite: boolean
      cadastral: boolean
      interest: boolean
      roadView: boolean
      current: boolean
      distance: boolean
      area: boolean
    }>
  >
  center: { lat: number; lng: number }
}

export default function GGIMap({
  formData,
  setFormData,
  clickedMapType,
  mapId = 'map',
  initialCenter = INITIAL_CENTER,
  zoom = INITIAL_ZOOM,
  setOpenOverlay,
  onLoad,
  mapCount,
  setMapCount,
  markerClickedRef,
  clickedItem,
  setClickedItem,
  setCenter,
  setClickedMapType,
  center,
}: Props) {
  const [user, setUser] = useRecoilState(userAtom)
  const { mutate: getMapItems } = usePostMapItems(formData)
  const { mutate: getMapCounts } = useMapCounts(
    formData,
    setMapCount as Dispatch<SetStateAction<MapCountsResponse[]>>,
  )
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const mapRef = useRef<NaverMap | null>(null)
  const debouncedSearch = useDebounce(formData, 250)
  const panoRef = useRef<HTMLDivElement | null>(null)
  const [isPanoVisible, setIsPanoVisible] = useState(false)
  const [clickedMarker, setClickedMarker] = useState<naver.maps.Marker | null>(
    null,
  )
  const [miniMap, setMiniMap] = useState<NaverMap | null>(null)
  const [clickedLatLng, setClickedLatLng] = useState({
    lat: 0,
    lng: 0,
  })

  const searchAddrToCoord = (address: string) => {
    if (window.naver?.maps.Service?.geocode !== undefined) {
      window.naver.maps.Service?.geocode(
        {
          query: address,
        },
        (status: any, response: any) => {
          if (status === window.naver.maps?.Service?.Status?.ERROR) {
            alert('지하철 혹은 주소를 입력해주세요')
            return
          }
          const result = response.v2.addresses[0]
          const { x, y } = result ?? { point: { x: 0, y: 0 } }
          setUser({
            ...user,
            lat: Number(y),
            lng: Number(x),
          })
          mapRef.current?.setCenter({
            lat: Number(y),
            lng: Number(x),
          })
        },
      )
    }
  }

  const initializeMap = () => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(...initialCenter),
      zoom: zoom ?? 16,
      minZoom: 9,
    }
    const map = new window.naver.maps.Map(mapId, mapOptions)
    mapRef.current = map

    window.naver.maps.Event.addListener(map, 'idle', handleGetBounds)
    window.naver.maps.Event.addListener(map, 'click', (e: any) => {
      if (map.streetLayer) {
        let latlng = e.coord
        setClickedLatLng({
          lat: latlng._lat,
          lng: latlng._lng,
        })
        if (clickedMarker) {
          clickedMarker.setMap(null)
        }
        const marker = new naver.maps.Marker({
          position: latlng,
          map: miniMap ?? map,
        })
        setClickedMarker(marker)
        setIsPanoVisible(true)
        new window.naver.maps.Panorama('pano', {
          position: new window.naver.maps.LatLng(latlng._lat, latlng._lng),
          pov: {
            pan: -135,
            tilt: 29,
            fov: 100,
          },
        })
        if (miniMap) {
          new naver.maps.Marker({
            position: latlng,
            map: miniMap,
          })
        }
      }
    })

    if (onLoad) {
      onLoad(map)
    }
    setUpMiniMap(map)
  }

  const setUpMiniMap = (map: NaverMap) => {
    if (!map) return
    let semaphore = false
    const miniMapElement = document.getElementById('minimap')
    if (!miniMapElement) return

    if (
      map.controls &&
      map.controls.get(window.naver.maps.Position.BOTTOM_RIGHT)
    ) {
      map.controls
        .get(window.naver.maps.Position.BOTTOM_RIGHT)
        .push(miniMapElement)
    } else {
      console.error('Map controls are not properly initialized.')
    }
    const minimap = new window.naver.maps.Map(miniMapElement, {
      bounds: map.getBounds(),
      scrollWheel: false,
      scaleControl: false,
      mapDataControl: false,
      logoControl: false,
    })
    setMiniMap(minimap)
    const roadview = new window.naver.maps.StreetLayer()
    roadview.setMap(minimap)
    let marker = new window.naver.maps.Marker({
      position: { lat: clickedLatLng?.lat ?? 0, lng: clickedLatLng?.lng ?? 0 },
      map: minimap,
    })

    window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
      if (semaphore) return
      minimap.fitBounds(map.getBounds())
    })

    window.naver.maps.Event.addListener(minimap, 'click', (e: any) => {
      let latlng = e.coord
      marker.setPosition(latlng)
      setClickedMarker(marker)
      setIsPanoVisible(true)
      new window.naver.maps.Panorama('pano', {
        position: new window.naver.maps.LatLng(latlng._lat, latlng._lng),
        pov: {
          pan: -135,
          tilt: 29,
          fov: 100,
        },
      })
    })
  }

  const closePanorama = () => {
    setIsPanoVisible(false)
  }

  const handleGetBounds = useCallback(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds() as any
      const sw = bounds.getSW()
      const ne = bounds.getNE()
      const x1 = sw.lng()
      const y1 = sw.lat()
      const x2 = ne.lng()
      const y2 = ne.lat()
      setFormData((prev) => {
        return {
          ...prev,
          x1,
          y1,
          x2,
          y2,
        }
      })
    }
    getMapItems()
  }, [setFormData, getMapItems])

  useEffect(() => {
    return () => {
      mapRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (user.address) {
      searchAddrToCoord(user.address)
    }
  }, [user.address])

  useEffect(() => {
    if (debouncedSearch) {
      if (mapRef?.current?.getZoom()! >= 15) {
        getMapItems()
        setMapCount && setMapCount([])
      } else {
        getMapCounts()
        setMapItems([])
      }
    }
  }, [debouncedSearch, mapRef.current?.getZoom()])

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_API}&submodules=geocoder,panorama`}
        onReady={initializeMap}
      />
      <div
        id="map"
        style={{
          width: '100vw',
          height: '100vh',
        }}
        onClick={() => {
          if (markerClickedRef.current === true) {
            setOpenOverlay(false)
            markerClickedRef.current = false
            setClickedItem(null)
          } else if (
            markerClickedRef.current === false &&
            clickedItem != null
          ) {
            setOpenOverlay(true)
            markerClickedRef.current = true
          }
        }}
      />
      <div
        id="pano"
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          zIndex: 10,
          top: '0',
          display: isPanoVisible ? 'block' : 'none',
        }}
      />
      {isPanoVisible && (
        <>
          <button
            onClick={closePanorama}
            style={{
              position: 'absolute',
              zIndex: 100,
              top: '50px',
              right: '50px',
              display: 'block',
              backgroundColor: 'black',
              color: 'white',
              width: '50px',
              height: '30px',
            }}
          >
            X
          </button>
        </>
      )}
      <div
        id="minimap"
        style={{
          width: '300px',
          height: '300px',
          position: 'absolute',
          zIndex: 100,
          bottom: '0',
          left: '390px',
          display: isPanoVisible ? 'block' : 'none',
        }}
      />
      <MapType
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      />
      <MapFunction
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
        center={center}
        setCenter={setCenter}
      />
    </>
  )
}

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
import { INITIAL_CENTER } from './hooks/useMap'
import { MapCountsResponse, MapItem } from '@/models/MapItem'
import useMapCounts from '../sideMenu/searchListBox/listBox/hooks/useMapCounts'
import { mapAtom, mapItemOriginAtom } from '@/store/atom/map'
import MapType from './mapType/MapType'
import MapFunction from './MapFunc/MapFunction'
import { authInfo } from '@/store/atom/auth'
import getPolypath from '@/remote/map/selected/getPolypath'
import { debounce } from 'lodash'
import { useAuth } from '@/hooks/auth/useAuth'
import handleToken from '@/remote/map/auth/token'
import axios from 'axios'
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
  setHalfDimensions: Dispatch<SetStateAction<{ width: number; height: number }>>
  setMapOptions: (map: NaverMap) => void
  token?: string
}

export default function GGIMap({
  formData,
  setFormData,
  clickedMapType,
  mapId = 'map',
  initialCenter = INITIAL_CENTER,
  zoom = 17,
  setOpenOverlay,
  onLoad,
  setMapCount,
  markerClickedRef,
  clickedItem,
  setClickedItem,
  setCenter,
  setClickedMapType,
  center,
  setHalfDimensions,
  setMapOptions,
  token,
}: Props) {
  const [user, setUser] = useRecoilState(userAtom)
  const [auth, setAuth] = useRecoilState(authInfo)
  const { mutate: getMapItems } = usePostMapItems(formData)
  const { mutate: getMapCounts } = useMapCounts(
    formData,
    setMapCount as Dispatch<SetStateAction<MapCountsResponse[]>>,
  )
  const [path, setPath] = useState<number[][]>([])
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemOriginAtom)
  const mapRef = useRef<NaverMap | null>(null)
  const [isPanoVisible, setIsPanoVisible] = useState(false)
  const [clickedMarker, setClickedMarker] = useState<naver.maps.Marker | null>(
    null,
  )
  const [miniMap, setMiniMap] = useState<NaverMap | null>(null)
  const [clickedLatLng, setClickedLatLng] = useState({
    lat: 0,
    lng: 0,
  })

  const searchAddrToCoord = useCallback(
    (address: string) => {
      if (window.naver?.maps.Service?.geocode !== undefined) {
        window.naver.maps.Service?.geocode(
          {
            query: address,
          },
          (status: any, response: any) => {
            if (status === window.naver.maps?.Service?.Status?.ERROR) {
              return
            }
            const result = response.v2.addresses[0]
            const { x, y } = result ?? { point: { x: 0, y: 0 } }
            setUser((prev) => {
              return {
                ...prev,
                lat: Number(y),
                lng: Number(x),
              }
            })
            mapRef.current?.setCenter({
              lat: Number(y),
              lng: Number(x),
            })
          },
        )
      }
    },
    [setUser],
  )

  const updateHalfDimensions = useCallback(() => {
    const exceptFilterBox = window.innerWidth - 370
    const halfHeight = window.innerHeight / 2
    const halfWidth = exceptFilterBox / 2 + 370
    setHalfDimensions({
      width: halfWidth,
      height: halfHeight,
    })
  }, [setHalfDimensions])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateHalfDimensions()
      window.addEventListener('resize', updateHalfDimensions)
      return () => window.removeEventListener('resize', updateHalfDimensions)
    }
  }, [updateHalfDimensions])

  const debouncedGetMapItems = debounce(getMapItems, 0)
  const zoomLevel = mapRef.current?.getZoom() ?? null
  const handleGetBounds = useCallback(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds() as any
      const sw = bounds.getSW()
      const ne = bounds.getNE()
      setFormData((prev) => ({
        ...prev,
        x1: sw.lng(),
        y1: sw.lat(),
        x2: ne.lng(),
        y2: ne.lat(),
      }))
      if (mapRef.current.getZoom() >= 15) {
        debouncedGetMapItems()
      } else {
        setMapItems([])
        setMapOrigin([])
      }
    }
  }, [setFormData, debouncedGetMapItems])

  useEffect(() => {
    handleGetBounds()
  }, [
    formData.egg,
    formData.ekm,
    formData.egm,
    formData.gm,
    formData.gg,
    formData.km,
    formData.kw,
    formData.awardedMonths,
    formData.interests,
    formData.fromMinimumAmount,
    formData.fromAppraisalAmount,
    formData.toMinimumAmount,
    formData.toAppraisalAmount,
  ])

  const setUpMiniMap = useCallback(
    (map: NaverMap) => {
      if (!map) return
      let semaphore = false
      const miniMapElement = document.getElementById('minimap')
      if (!miniMapElement) return

      const controls =
        map.controls?.get(window.naver.maps.Position.BOTTOM_RIGHT) || []
      controls.push(miniMapElement)

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
            pan: -135,
            tilt: 29,
            fov: 100,
          },
        })
      })
    },
    [clickedLatLng],
  )

  const initializeMap = useCallback(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(37.497013, 127.0114263),
      zoom: zoom ?? 17,
      minZoom: 9,
      draggable: true,
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
  }, [initialCenter, zoom, onLoad, handleGetBounds, setUpMiniMap, user.role])

  const closePanorama = () => {
    setIsPanoVisible(false)
  }

  const handleGetPolyPath = useCallback(async () => {
    if (user.lat && user.lng) {
      try {
        const response = await getPolypath(
          user?.lng as number,
          user?.lat as number,
        )
        setPath(response)
      } catch (error) {
        console.error(error)
      }
    }
  }, [user.lat, user.lng])

  useEffect(() => {
    return () => {
      mapRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (user.address !== '' && auth.idCode === '') {
      searchAddrToCoord(user.address)
    } else if (user.address === '' && auth.idCode !== '') {
      mapRef.current?.setCenter({
        lat: user.lat,
        lng: user.lng,
      })
    }
  }, [user.address, auth.idCode, user.lat, user.lng, searchAddrToCoord])

  useEffect(() => {
    if (mapRef?.current?.getZoom()! >= 15) {
      setMapCount && setMapCount([])
    } else if (mapRef?.current?.getZoom()! < 15) {
      getMapCounts()
      setMapItems([])
      setMapOrigin([])
    }
  }, [getMapCounts, setMapCount, zoomLevel, formData])

  useEffect(() => {
    handleGetPolyPath()
  }, [user.lat, user.lng, handleGetPolyPath])

  useEffect(() => {
    if (mapRef.current && path.length > 0 && auth.idCode !== '') {
      const polyline = new window.naver.maps.Polyline({
        map: mapRef.current,
        path: path.map(
          (item) => new window.naver.maps.LatLng(item[0], item[1]),
        ),
        fillColor: '#ff0000',
        fillOpacity: 0.3,
        strokeColor: '#ff0000',
        strokeOpacity: 0.6,
        strokeWeight: 3,
        zIndex: 100,
      })
      polyline.setMap(mapRef.current)
    }
  }, [path, auth.idCode])

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
          right: '0',
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

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Coordinates, NaverMap } from '@/models/Map'
import Script from 'next/script'
import { INITIAL_CENTER } from './hooks/useMap'
import { MapCountsResponse } from '@/models/MapItem'
import useMapCounts from '../sideMenu/searchListBox/listBox/hooks/useMapCounts'
import {
  clickedItemAtom,
  formDataAtom,
  isPanoramaVisibleAtom,
  listOverItemAtom,
  mapItemsAtom,
} from '@/store/atom/map'
import MapType from './mapType/MapType'
import MapFunction from './mapFunc/MapFunction'
import { authInfo } from '@/store/atom/auth'
import getPolypath from '@/remote/map/selected/getPolypath'
import MiniMap from './MiniMap'
import useDebounce from '@/components/shared/hooks/useDebounce'
import CloseButton from '../icons/CloseButton'
import useGeoCode from './hooks/useGeoCode'
import fetchXY from '@/remote/map/lastXY/fetchXY'
declare global {
  interface Window {
    naver: any
  }
}

type MapType = {
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
interface Props {
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
  zoom: number
  mapId?: string
  initialCenter?: Coordinates
  onLoad?: (map: NaverMap) => void
  setMapCount?: Dispatch<SetStateAction<MapCountsResponse[]>>
  markerClickedRef: MutableRefObject<boolean>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  setClickedMapType: Dispatch<SetStateAction<MapType>>
  setHalfDimensions: Dispatch<SetStateAction<{ width: number; height: number }>>
  dragStateRef: MutableRefObject<boolean>
  openCursor: boolean
  setOpenCursor: Dispatch<SetStateAction<boolean>>
}

export default function GGIMap({
  clickedMapType,
  mapId = 'map',
  initialCenter = INITIAL_CENTER,
  setOpenOverlay,
  onLoad,
  setMapCount,
  markerClickedRef,
  setClickedMapType,
  setHalfDimensions,
  zoom,
  dragStateRef,
  openCursor,
  setOpenCursor,
}: Props) {
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [auth, setAuth] = useRecoilState(authInfo)
  const panoRef = useRef<naver.maps.Panorama | null>(null)
  const { mutate: getMapCounts } = useMapCounts(
    formData,
    setMapCount as Dispatch<SetStateAction<MapCountsResponse[]>>,
  )
  const setMapItems = useSetRecoilState(mapItemsAtom)
  const mapRef = useRef<NaverMap | null>(null)
  const [isPanoVisible, setIsPanoVisible] = useRecoilState(
    isPanoramaVisibleAtom,
  )
  const setListOver = useSetRecoilState(listOverItemAtom)
  const [clickedMarker, setClickedMarker] = useState<naver.maps.Marker | null>(
    null,
  )
  const [miniMap] = useState<NaverMap | null>(null)
  const [clickedLatLng, setClickedLatLng] = useState({
    lat: 0,
    lng: 0,
  })
  const zoomLevel = mapRef.current?.getZoom() ?? null
  const [clickedItem, setClickedItem] = useRecoilState(clickedItemAtom)
  const { handleGeoCode } = useGeoCode(auth.address, mapRef.current)
  const debouncedMapCounts = useDebounce(getMapCounts, 100)

  const updateFormDataBounds = useCallback(() => {
    if (!mapRef.current || auth.role.includes('ROLE_ANONYMOUS' || 'ROLE_FREE'))
      return
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
    console.log(mapRef.current.getCenter())
  }, [setFormData])
  const initializeMap: () => void = useCallback(() => {
    if (!window.naver?.maps) return

    const mapOptions = {
      center: { lat: auth.lat, lng: auth.lng },
      zoom: zoom ?? 17,
      minZoom: 9,
      draggable: true,
      maxBounds: new window.naver.maps.LatLngBounds(
        new window.naver.maps.LatLng(33.1, 126.16),
        new window.naver.maps.LatLng(38.614, 130.873),
      ),
    }

    const map = new window.naver.maps.Map(mapId, mapOptions)
    mapRef.current = map
    map.setCenter({
      lat: auth.lat,
      lng: auth.lng,
    })
    const listeners = [
      window.naver.maps.Event.addListener(
        map,
        'zoom_changed',
        updateFormDataBounds,
      ),
      window.naver.maps.Event.addListener(map, 'init', updateFormDataBounds),
      window.naver.maps.Event.addListener(map, 'idle', () => {
        updateFormDataBounds()
      }),
      window.naver.maps.Event.addListener(map, 'dragstart', () => {
        setOpenOverlay(false)

        dragStateRef.current = true
      }),
      window.naver.maps.Event.addListener(map, 'dragend', () => {
        dragStateRef.current = false
        setListOver((prev) => ({
          ...prev,
          isOver: false,
        }))
        updateFormDataBounds()
      }),
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
          panoRef.current = new window.naver.maps.Panorama('pano', {
            position: new window.naver.maps.LatLng(latlng._lat, latlng._lng),
            pov: {
              pan: 0,
              tilt: 0,
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
      }),
    ]

    if (onLoad) onLoad(map)
    return () => {
      listeners.forEach((listener) =>
        window.naver.maps.Event.removeListener(listener),
      )
    }
  }, [
    zoom,
    mapId,
    onLoad,
    updateFormDataBounds,
    dragStateRef,
    clickedMarker,
    miniMap,
    setIsPanoVisible,
    setOpenOverlay,
  ])

  const closePanorama = () => setIsPanoVisible(false)
  const handleLastXY = async () => {
    if (!mapRef.current || auth.idCode !== '') return
    const center = mapRef.current.getCenter()
    await fetchXY(center.x, center.y)
  }

  useEffect(() => {
    const updateHalfDimensions = () => {
      const exceptFilterBox = window.innerWidth - 370
      setHalfDimensions({
        width: exceptFilterBox / 2 + 370,
        height: window.innerHeight / 2,
      })
    }
    if (typeof window !== 'undefined') {
      updateHalfDimensions()
      window.addEventListener('resize', updateHalfDimensions)
      return () => window.removeEventListener('resize', updateHalfDimensions)
    }
  }, [setHalfDimensions])

  useEffect(() => {
    if (!mapRef.current) return
    if (mapRef.current.getZoom() < 15) {
      getMapCounts()
    }
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
    formData.ids,
    formData.interests,
  ])

  const useUnload = (func: () => void) => {
    const cb = useRef(func)
    useEffect(() => {
      cb.current = func
    }, [func])
    useEffect(() => {
      const handleBeforeUnload = () => {
        cb.current()
      }

      window.addEventListener('beforeunload', () => {
        handleBeforeUnload()
      })

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }, [])
  }
  useUnload(() => {
    handleLastXY()
  })
  useEffect(() => {
    return () => {
      mapRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (auth.address && !auth.idCode) {
      handleGeoCode()
    } else if (!auth.address && auth.idCode) {
      mapRef.current?.setCenter({ lat: auth.lat, lng: auth.lng })
    }
  }, [auth.address, auth.idCode, auth.lat, auth.lng, setAuth])

  useEffect(() => {
    if (zoomLevel && zoomLevel >= 15) {
      setMapCount && setMapCount([])
    } else if (mapRef?.current?.getZoom()! < 15) {
      debouncedMapCounts()
      setMapItems([])
    }
  }, [
    getMapCounts,
    setMapCount,
    zoomLevel,
    setMapItems,
    formData.x1,
    formData.y1,
    formData.x2,
    formData.y2,
  ])

  useEffect(() => {
    const updatePolyPath = async () => {
      if (!auth.detailLat || !auth.detailLng || !auth.idCode || !mapRef.current)
        return
      try {
        const response = await getPolypath(
          auth.detailLng as number,
          auth.detailLat as number,
        )
        if (response.length > 0 && auth.idCode) {
          console.log(response)
          new window.naver.maps.Polyline({
            map: mapRef.current,
            path: response.map(
              (item: number[][]) =>
                new window.naver.maps.LatLng(item[0], item[1]),
            ),
            fillColor: '#ff0000',
            fillOpacity: 0.3,
            strokeColor: '#ff0000',
            strokeOpacity: 0.6,
            strokeWeight: 3,
            zIndex: 100,
          })
          mapRef.current.setCenter({
            lat: auth.detailLat,
            lng: auth.detailLng,
          })
          mapRef.current.setZoom(19)
        }
      } catch (error) {
        console.error(error)
      }
    }
    updatePolyPath()
  }, [auth.detailLat, auth.detailLng, auth.idCode])

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
          if (markerClickedRef.current) {
            setOpenOverlay(false)
            markerClickedRef.current = false
            setClickedItem(null)
          } else if (clickedItem) {
            setOpenOverlay(true)
            markerClickedRef.current = true
          }
          if (openCursor) setOpenCursor(false)
        }}
      />
      <div
        id="pano"
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          zIndex: 20,
          top: '0',
          display: isPanoVisible ? 'block' : 'none',
        }}
      />
      {isPanoVisible && (
        <div
          style={{
            position: 'fixed',
            zIndex: 100,
            top: '50px',
            right: '50px',
            display: 'flex',
            cursor: 'pointer',
          }}
          onClick={closePanorama}
        >
          <CloseButton />
        </div>
      )}
      <MiniMap
        setIsPanoVisible={setIsPanoVisible}
        setClickedMarker={setClickedMarker}
        clickedLatLng={clickedLatLng}
        map={mapRef.current as NaverMap}
        pano={panoRef.current}
      />
      <MapType
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
        setOpenOverlay={setOpenOverlay}
      />
      <MapFunction
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
        setOpenOverlay={setOpenOverlay}
      />
    </>
  )
}

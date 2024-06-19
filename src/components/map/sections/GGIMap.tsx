import usePostMapItems from '@/hooks/items/usePostMapItems'
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
import { Coordinates, NaverMap } from '@/models/Map'
import Script from 'next/script'
import { INITIAL_CENTER } from './hooks/useMap'
import { MapCountsResponse } from '@/models/MapItem'
import useMapCounts from '../sideMenu/searchListBox/listBox/hooks/useMapCounts'
import {
  clickedItemAtom,
  formDataAtom,
  jusoAtom,
  mapItemsAtom,
  mapItemsOriginAtom,
} from '@/store/atom/map'
import MapType from './mapType/MapType'
import MapFunction from './MapFunc/MapFunction'
import { authInfo } from '@/store/atom/auth'
import getPolypath from '@/remote/map/selected/getPolypath'
import { usePostListItems } from '@/hooks/items/usePostListItems'
import useDebounce from '@/components/shared/hooks/useDebounce'
declare global {
  interface Window {
    naver: any
  }
}
interface Props {
  page: number
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
  setHalfDimensions: Dispatch<SetStateAction<{ width: number; height: number }>>
  searchCoordinateToAddress: (
    lat: number,
    lng: number,
    setGetGungu: Dispatch<SetStateAction<string>>,
  ) => void
}

const DEBOUNCE_DELAY = 500
const ADJUST_WIDTH = 300

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
  page,
  searchCoordinateToAddress,
}: Props) {
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [auth, setAuth] = useRecoilState(authInfo)
  const dragStateRef = useRef(false)
  const { mutate: getMapItems } = usePostMapItems(
    formData,
    dragStateRef.current,
  )
  const { mutate: getMapLists } = usePostListItems(formData, page, 10)
  const { mutate: getMapCounts } = useMapCounts(
    formData,
    setMapCount as Dispatch<SetStateAction<MapCountsResponse[]>>,
  )
  const [path, setPath] = useState<number[][]>([])
  const [mapItems, setMapItems] = useRecoilState(mapItemsAtom)
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemsOriginAtom)
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
  const zoomLevel = mapRef.current?.getZoom() ?? null
  const [getGungu, setGetGungu] = useState('')
  const [juso, setJuso] = useRecoilState(jusoAtom)
  const [clickedItem, setClickedItem] = useRecoilState(clickedItemAtom)

  const searchAddrToCoord = (
    address: string,
    map: NaverMap | null,
    setAuth: any,
  ) => {
    if (map) {
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
            setAuth((prev: any) => {
              return {
                ...prev,
                lat: Number(y),
                lng: Number(x),
              }
            })
            map?.setCenter({
              lat: Number(y),
              lng: Number(x),
            })
          },
        )
      }
    }
  }

  const updateHalfDimensions = useCallback(() => {
    const exceptFilterBox = window.innerWidth - 370
    const halfHeight = window.innerHeight / 2
    const halfWidth = exceptFilterBox / 2 + 370
    setHalfDimensions({
      width: halfWidth,
      height: halfHeight,
    })
  }, [setHalfDimensions])

  const handleCenterChanged = useCallback(() => {
    if (mapRef.current) {
      const mapCenter: naver.maps.Point = mapRef.current.getCenter()
      const centerCoords = { lat: mapCenter.y, lng: mapCenter.x }
      searchCoordinateToAddress(centerCoords.lat, centerCoords.lng, setGetGungu)
    }
  }, [mapRef.current, searchCoordinateToAddress, setJuso, setGetGungu])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateHalfDimensions()
      window.addEventListener('resize', updateHalfDimensions)
      return () => window.removeEventListener('resize', updateHalfDimensions)
    }
  }, [updateHalfDimensions])

  const debouncedGetMapItems = useDebounce(getMapItems, DEBOUNCE_DELAY)
  const debouncedGetMapLists = useDebounce(getMapLists, DEBOUNCE_DELAY)
  const debounceGetCenterChanged = useDebounce(
    handleCenterChanged,
    DEBOUNCE_DELAY,
  )
  const handleGetBounds = useCallback(() => {
    if (!mapRef.current) return
    const bounds = mapRef.current.getBounds() as any
    const projection = mapRef.current.getProjection()

    const swPixel = projection.fromCoordToOffset(bounds.getSW())
    const nePixel = projection.fromCoordToOffset(bounds.getNE())

    const adjustedSW = new naver.maps.Point(swPixel.x + ADJUST_WIDTH, swPixel.y)
    const adjustedNE = new naver.maps.Point(nePixel.x + ADJUST_WIDTH, nePixel.y)

    const adjustedSw = projection.fromOffsetToCoord(
      adjustedSW,
    ) as naver.maps.LatLng
    const adjustedNe = projection.fromOffsetToCoord(
      adjustedNE,
    ) as naver.maps.LatLng

    // const sw = bounds.getSW()
    // const ne = bounds.getNE()
    // setFormData((prev) => ({
    //   ...prev,
    //   x1: sw.lng(),
    //   y1: sw.lat(),
    //   x2: ne.lng(),
    //   y2: ne.lat(),
    // }))
    setFormData((prev) => ({
      ...prev,
      x1: adjustedSw.lng(),
      y1: adjustedSw.lat(),
      x2: adjustedNe.lng(),
      y2: adjustedNe.lat(),
    }))
    if (mapRef.current.getZoom() >= 15) {
      debouncedGetMapItems()
    } else {
      setMapItems([])
      setMapOrigin([])
    }
  }, [setFormData, debouncedGetMapItems, setMapItems, setMapOrigin])

  const handlePromiseAll = useCallback(() => {
    if (!mapRef.current || dragStateRef.current) return
    debounceGetCenterChanged()
    handleGetBounds()
    if (mapRef.current.getZoom() >= 15) {
      debouncedGetMapLists()
    }
  }, [handleGetBounds, debouncedGetMapLists])

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

    window.naver.maps.Event.addListener(map, 'idle', handlePromiseAll)
    window.naver.maps.Event.addListener(map, 'dragstart', () => {
      dragStateRef.current = true
    })
    window.naver.maps.Event.addListener(map, 'dragend', () => {
      dragStateRef.current = false
      handlePromiseAll()
    })
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
  }, [initialCenter, zoom, onLoad, setUpMiniMap])

  const closePanorama = () => {
    setIsPanoVisible(false)
  }

  useEffect(() => {
    handlePromiseAll()
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

  useEffect(() => {
    return () => {
      mapRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (auth.address && !auth.idCode) {
      searchAddrToCoord(auth.address, mapRef.current, setAuth)
    } else if (!auth.address && auth.idCode) {
      mapRef.current?.setCenter({ lat: auth.lat, lng: auth.lng })
    }
  }, [auth.address, auth.idCode, auth.lat, auth.lng, setAuth])

  useEffect(() => {
    if (zoomLevel && zoomLevel >= 15) {
      setMapCount && setMapCount([])
    } else if (mapRef?.current?.getZoom()! < 15) {
      getMapCounts()
      setMapItems([])
      setMapOrigin([])
    }
  }, [getMapCounts, setMapCount, zoomLevel, formData, zoomLevel])

  useEffect(() => {
    const updatePolyPath = async () => {
      if (auth.lat && auth.lng) {
        try {
          const response = await getPolypath(
            auth.lng as number,
            auth.lat as number,
          )
          if (response.length > 0 && auth.idCode) {
            const polyline = new window.naver.maps.Polyline({
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
            return () => {
              polyline.setMap(null)
            }
          }
        } catch (error) {
          console.error(error)
        }
      }
    }

    updatePolyPath()
  }, [auth.lat, auth.lng, auth.idCode])
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
      />
    </>
  )
}

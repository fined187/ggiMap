import usePostMapItems from '@/hooks/items/usePostMapItems'
import { Form } from '@/models/Form'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
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
  const debouncedSearch = useDebounce(formData, 500)

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
    if (onLoad) {
      onLoad(map)
    }
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
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_API}&submodules=geocoder`}
        onReady={initializeMap}
      />
      <div
        id={mapId}
        style={{ width: '100vw', height: '100vh' }}
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

import usePostMapItems from '@/hooks/items/usePostMapItems'
import { Form } from '@/models/Form'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import {
  NaverMap,
  NaverMapProps,
  useListener,
  useNavermaps,
} from 'react-naver-maps'
import { useRecoilState } from 'recoil'
import { mapAtom } from '@/store/atom/map'
import { userAtom } from '@/store/atom/postUser'
import useDebounce from '../../shared/hooks/useDebounce'
import { MapCountsResponse } from '@/models/MapItem'
import useMapCounts from '../sideMenu/searchListBox/listBox/hooks/useMapCounts'
import Clustering from './markers/Clustering'
import KmMarker from './markers/KmMarker'
import GmMarker from './markers/GmMarker'
import KwMarker from './markers/KwMarker'
import GgMarker from './markers/GgMarker'
import WinMarker from './markers/WinMarker'

interface Props {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
  center: { lat: number; lng: number }
  setCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>
  zoom: number
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
}

type PnuCount = {
  pnu: string
  type: number
  count: number
}

type pnuCounts = {
  updatedCounts: PnuCount[]
}

export default function GGMap({
  formData,
  setFormData,
  center,
  setCenter,
  zoom,
  setZoom,
  clickedMapType,
  setClickedMapType,
}: Props) {
  const naverMaps = useNavermaps()
  const [map, setMap] = useState<NaverMapProps>({})
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [pnuCounts, setPnuCounts] = useState<pnuCounts>({ updatedCounts: [] })
  const { mutate: getMapItems } = usePostMapItems(formData)
  const { mutate: getMapCounts } = useMapCounts(
    formData,
    setMapCount as Dispatch<SetStateAction<MapCountsResponse[]>>,
  )
  const [user, setUser] = useRecoilState(userAtom)
  const debouncedSearch = useDebounce(formData, 500)
  const searchAddrToCoord = (address: string) => {
    if (naverMaps?.Service?.geocode !== undefined) {
      naverMaps?.Service?.geocode(
        {
          address,
        },
        (status: any, response: any) => {
          if (status === naverMaps?.Service?.Status?.ERROR) {
            return alert('Something wrong!')
          }
          const result = response.result.items[0]
          const { point } = result
          const { x, y } = point
          setUser({
            ...user,
            lat: Number(y),
            lng: Number(x),
          })
          setCenter({
            lat: Number(y),
            lng: Number(x),
          })
        },
      )
    }
  }

  const getBounds = () => {
    if (map.bounds === undefined) {
      return
    }
    const ne = map.bounds._ne
    const sw = map.bounds._sw
    setCenter({
      lat: map.center.y,
      lng: map.center.x,
    })
    setFormData({
      ...formData,
      x1: sw._lng,
      y1: sw._lat,
      x2: ne._lng,
      y2: ne._lat,
    })
  }

  useListener(map, 'idle', getBounds)

  useEffect(() => {
    if (debouncedSearch) {
      if (formData.map.zoom! >= 15) {
        getMapItems()
        setMapCount([])
      } else {
        getMapCounts()
        setMapItems([])
      }
    }
  }, [debouncedSearch, map])

  useLayoutEffect(() => {
    if (user.address) {
      searchAddrToCoord(user.address)
    }
  }, [user.address])

  useEffect(() => {
    if (map) {
      setFormData((prev) => ({
        ...prev,
        map: map,
      }))
    }
  }, [map, setFormData])

  const handleZoomChanged = useCallback(() => {
    setZoom(map.zoom ?? 16)
  }, [map.zoom])

  const handleGetPnuCounts = useCallback(() => {
    const countsMap: {
      [pnu: string]: number
    } = {}
    mapItems.forEach((item) => {
      countsMap[item.pnu] = (countsMap[item.pnu] || 0) + 1
    })
    const maxCounts: {
      [pnu: string]: number
    } = {}
    Object.keys(countsMap).forEach((pnu) => {
      const count = countsMap[pnu]
      if (!maxCounts[pnu] || count > maxCounts[pnu]) {
        maxCounts[pnu] = count
      }
    })
    const updatedCounts = Object.keys(maxCounts).map((pnu) => ({
      pnu,
      type: mapItems.find((item) => item.pnu === pnu)?.type!,
      count: maxCounts[pnu] as number,
    }))
    setPnuCounts({ updatedCounts })
  }, [mapItems])

  useEffect(() => {
    if (mapItems) {
      setPnuCounts({ updatedCounts: [] })
      handleGetPnuCounts()
    }
  }, [mapItems])

  const handleMapTypeChange = useCallback(() => {
    if (clickedMapType.basic) {
      return naverMaps?.MapTypeId.NORMAL
    }
    if (clickedMapType.terrain) {
      return naverMaps?.MapTypeId.TERRAIN
    } else if (!clickedMapType.terrain) {
      return naverMaps?.MapTypeId.NORMAL
    }
    if (clickedMapType.satellite) {
      return naverMaps?.MapTypeId.SATELLITE
    } else if (!clickedMapType.satellite) {
      return naverMaps?.MapTypeId.NORMAL
    }
    if (clickedMapType.cadastral) {
      return naverMaps?.MapTypeId.CADASTRAL
    } else if (!clickedMapType.cadastral) {
      return naverMaps?.MapTypeId.NORMAL
    }
  }, [
    clickedMapType,
    naverMaps?.MapTypeId.NORMAL,
    naverMaps?.MapTypeId.TERRAIN,
    naverMaps?.MapTypeId.SATELLITE,
    naverMaps?.MapTypeId.CADASTRAL,
  ])

  return (
    <NaverMap
      center={center}
      zoom={zoom}
      ref={setMap}
      onZoomChanged={handleZoomChanged}
      mapTypeId={handleMapTypeChange()}
    >
      {mapCount && mapCount.length > 0
        ? mapCount.map(
            (item, index) =>
              item.count > 0 && (
                <Clustering
                  key={index}
                  formData={formData}
                  item={{
                    sd: item.sd,
                    sgg: item.sgg,
                    umd: item.umd,
                    count: item.count,
                    x: item.x,
                    y: item.y,
                  }}
                  map={map}
                  setCenter={setCenter}
                  setZoom={setZoom}
                />
              ),
          )
        : mapItems
        ? mapItems.map((item, index) =>
            item.winYn === 'Y' ? (
              <WinMarker
                key={index}
                item={item}
                formData={formData}
                pnuCounts={pnuCounts}
              />
            ) : item.winYn !== 'Y' && item.type === 3 ? (
              <GgMarker
                key={index}
                item={item}
                formData={formData}
                pnuCounts={pnuCounts}
              />
            ) : item.winYn !== 'Y' && item.type === 2 ? (
              <GmMarker
                key={index}
                item={item}
                formData={formData}
                pnuCounts={pnuCounts}
              />
            ) : item.winYn !== 'Y' && item.type === 4 ? (
              <KwMarker
                key={index}
                item={item}
                formData={formData}
                pnuCounts={pnuCounts}
              />
            ) : item.winYn !== 'Y' && item.type === 1 ? (
              <KmMarker
                key={index}
                item={item}
                formData={formData}
                pnuCounts={pnuCounts}
              />
            ) : null,
          )
        : null}
    </NaverMap>
  )
}

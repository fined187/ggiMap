import usePostMapItems from '@/hooks/items/usePostMapItems'
import { Form } from '@/models/Form'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import {
  Marker,
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

interface Props {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
  center: { lat: number; lng: number }
  setCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>
  zoom: number
  setZoom: Dispatch<SetStateAction<number>>
}

export default function GGMap({
  formData,
  setFormData,
  center,
  setCenter,
  zoom,
  setZoom,
}: Props) {
  const naverMaps = useNavermaps()
  const [map, setMap] = useState<NaverMapProps>({})
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const [mapCount, setMapCount] = useState<MapCountsResponse[] | null>(null)

  const param = {
    ids:
      formData.ids.length === 12 ? '0' : formData.ids.map((id) => id).join(','),
    fromAppraisalAmount: formData.fromAppraisalAmount,
    toAppraisalAmount: formData.toAppraisalAmount,
    fromMinimumAmount: formData.fromMinimumAmount,
    toMinimumAmount: formData.toMinimumAmount,
    interests: formData.interests,
    x1: formData.x1,
    y1: formData.y1,
    x2: formData.x2,
    y2: formData.y2,
    awardedMonths: formData.awardedMonths,
    userId: formData.userId,
    km: formData.km,
    kw: formData.kw,
    gg: formData.gg,
    gm: formData.gm,
    ekm: formData.ekm,
    egm: formData.egm,
    egg: formData.egg,
  }

  const countParam = {
    ids:
      formData.ids.length === 12 ? '0' : formData.ids.map((id) => id).join(','),
    km: formData.km,
    kw: formData.kw,
    gm: formData.gm,
    gg: formData.gg,
    x1: formData.x1,
    y1: formData.y1,
    x2: formData.x2,
    y2: formData.y2,
    level: formData.map.zoom as number,
  }

  const { mutate: getMapItems } = usePostMapItems(param)
  const { mutate: getMapCounts } = useMapCounts(countParam, setMapCount)

  const [user, setUser] = useRecoilState(userAtom)

  const debouncedSearch = useDebounce(formData, 100)

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
        setMapCount(null)
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
  // 50m => 17
  // 100m => 16
  // 300m => 15
  // 500m => 14
  // 1km => 13
  // 3km => 12
  const handleZoomChanged = useCallback(() => {
    setZoom(map.zoom ?? 16)
  }, [map.zoom])
  return (
    <NaverMap
      center={center}
      zoom={zoom}
      ref={setMap}
      onZoomChanged={handleZoomChanged}
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
            item.type === 1 ? (
              <KmMarker key={index} item={item} formData={formData} />
            ) : item.type === 2 ? (
              <GmMarker key={index} item={item} formData={formData} />
            ) : item.type === 3 ? (
              <GgMarker key={index} item={item} formData={formData} />
            ) : (
              <KwMarker key={index} item={item} formData={formData} />
            ),
          )
        : null}
    </NaverMap>
  )
}

import usePostMapItems from '@/hooks/items/usePostMapItems'
import { Form } from '@/models/Form'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  NaverMap,
  NaverMapProps,
  useListener,
  useNavermaps,
} from 'react-naver-maps'
import Markers from './Markers'
import { useRecoilState } from 'recoil'
import { loadingAtom, mapAtom } from '@/store/atom/map'
import { userAtom } from '@/store/atom/postUser'
import useDebounce from '../shared/hocs/useDebounce'

interface Props {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
}

export default function GGMap({ formData, setFormData }: Props) {
  const naverMaps = useNavermaps()
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const [map, setMap] = useState<NaverMapProps>({})
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
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
  const { mutate, isLoading } = usePostMapItems(param)

  const [user, setUser] = useRecoilState(userAtom)
  const [center, setCenter] = useState({
    lat: user.lat,
    lng: user.lng,
  })
  const debouncedSearch = useDebounce(formData, 100)
  const searchAddrToCoord = (address: string) => {
    if (naverMaps.Service.geocode !== undefined) {
      naverMaps.Service?.geocode(
        {
          address,
        },
        (status: any, response: any) => {
          if (status === naverMaps.Service.Status.ERROR) {
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
    if (map) {
      if (map.bounds === undefined) {
        return
      }
      const ne = map.bounds._ne
      const sw = map.bounds._sw
      setFormData({
        ...formData,
        x1: sw._lng,
        y1: sw._lat,
        x2: ne._lng,
        y2: ne._lat,
      })
    }
  }

  useEffect(() => {
    if (debouncedSearch) {
      mutate()
    }
  }, [debouncedSearch, map])

  useListener(map, 'idle', getBounds)

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
  }, [map])

  return (
    <div
      id="naver-map"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap center={center} defaultZoom={16} ref={setMap}>
        <Markers />
      </NaverMap>
    </div>
  )
}

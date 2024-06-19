import { NaverMap } from '@/models/Map'
import useSWR from 'swr'
import { MAP_KEY } from './useMap'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  formDataAtom,
  jusoAtom,
  mapItemsAtom,
  mapItemsOriginAtom,
} from '@/store/atom/map'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { MapCountsResponse, MapItem } from '@/models/MapItem'
import { authInfo } from '@/store/atom/auth'

type PnuCount = {
  pnu: string
  type: number
  count: number
  includeYn: boolean
}

type pnuCounts = {
  updatedCounts: PnuCount[]
}

interface CountMap {
  [pnu: string]: number
}

const useMapUtils = (
  token: string,
  type: string,
  idCode: string,
  setGetGungu: Dispatch<SetStateAction<string>>,
  handleParameters: (
    params1?: string,
    params2?: string,
    params3?: string,
    map?: NaverMap,
  ) => void,
) => {
  const { data: map } = useSWR(MAP_KEY)
  const [mapItems, setMapItems] = useRecoilState(mapItemsAtom) // Map 마커 만드는 리스트
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemsOriginAtom) //  Map 마커 원본 리스트
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [juso, setJuso] = useRecoilState(jusoAtom)
  const auth = useRecoilValue(authInfo)

  const [pnuCounts, setPnuCounts] = useState<pnuCounts>({
    updatedCounts: [],
  })
  const [originPnuCounts, setOriginPnuCounts] = useState<pnuCounts>({
    updatedCounts: [],
  })
  const [duplicatedItems, setDuplicatedItems] = useState<MapItem[]>([])
  const [mapCount, setMapCount] = useState<MapCountsResponse[]>([])
  const [openOverlay, setOpenOverlay] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  const [clickedMapType, setClickedMapType] = useState({
    basic: true,
    terrain: false,
    satellite: false,
    cadastral: false,
    interest: false,
    roadView: false,
    current: false,
    distance: false,
    area: false,
  })

  const handleSyncMap = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      interests: clickedMapType.interest,
    }))
  }, [clickedMapType.interest, setFormData])

  const searchCoordinateToAddress = useCallback(
    async (
      lat: number,
      lng: number,
      setGetGungu: Dispatch<SetStateAction<string>>,
    ) => {
      if (window.naver?.maps?.Service?.reverseGeocode) {
        try {
          const result: any = await new Promise((resolve, reject) => {
            window.naver.maps.Service.reverseGeocode(
              { location: new window.naver.maps.LatLng(lat, lng) },
              (status: any, response: any) => {
                if (status !== window.naver.maps.Service.Status.OK) {
                  reject('주소를 찾을 수 없습니다.')
                } else {
                  resolve(response.result.items[0].addrdetail)
                }
              },
            )
          })
          setJuso((prev) => {
            return {
              ...prev,
              topSido: result.sido,
              topGungu:
                result.sigugun.split(' ')[0] === ''
                  ? '세종시'
                  : result.sigugun.split(' ')[0],
              topDong: result.dongmyun,
            }
          })
          if (
            result.sigugun.split(' ')[0].match(/시$/) &&
            !result.sigugun.split(' ')[1]
          ) {
            setGetGungu(result.sigugun.split(' ')[0])
          } else if (
            result.sigugun.split(' ')[1] &&
            result.sigugun.split(' ')[1].match(/구$/)
          ) {
            setGetGungu(result.sigugun.split(' ')[1])
          }
        } catch (error) {
          alert(error)
        }
      }
    },
    [],
  )

  const createPnuCounts = (items: MapItem[]) => {
    const countsMap: CountMap = items.reduce((map, item) => {
      // items의 pnu를 key로 하는 객체 생성
      map[item.pnu as string] = (map[item.pnu as string] || 0) + 1 // pnu가 같은 아이템이 있을 때마다 count 증가
      return map // { pnu: count } 형태의 객체 반환
    }, {} as CountMap)

    const maxCounts: CountMap = Object.keys(countsMap).reduce((map, pnu) => {
      //  pnu가 같은 아이템 중 가장 큰 count를 가진 아이템만 남기기
      if (!map[pnu] || countsMap[pnu] > map[pnu]) {
        // map에 pnu가 없거나 countsMap의 pnu가 map의 pnu보다 크면
        map[pnu] = countsMap[pnu] // map의 pnu에 countsMap의 pnu를 할당
      }
      return map
    }, {} as CountMap)

    const updatedCounts: PnuCount[] = Object.keys(maxCounts).map((pnu) => {
      const foundItem = items.find((item) => item.pnu === pnu) //  pnu가 같은 아이템 중 가장 큰 count를 가진 아이템 찾기
      return {
        //  pnu, type, count, includeYn을 updatedCounts에 추가
        pnu,
        type: foundItem?.type as number,
        count: maxCounts[pnu],
        includeYn: items.some((item) => item.pnu === pnu && item.winYn === 'Y'), //  pnu가 같은 아이템 중 winYn이 'Y'인 아이템이 있는지 확인
      }
    })
    return updatedCounts
  }

  const usePnuCountHandler = (
    mapItems: MapItem[],
    mapOrigin: MapItem[],
    setPnuCounts: React.Dispatch<
      React.SetStateAction<{ updatedCounts: PnuCount[] }>
    >,
    setOriginPnuCounts: React.Dispatch<
      React.SetStateAction<{ updatedCounts: PnuCount[] }>
    >,
  ) => {
    const handleGetPnuCounts = useCallback(() => {
      setPnuCounts({ updatedCounts: createPnuCounts(mapItems) })
    }, [mapItems, setPnuCounts])

    const handleGetOriginMapPnuCounts = useCallback(() => {
      setOriginPnuCounts({ updatedCounts: createPnuCounts(mapOrigin) })
    }, [mapOrigin, setOriginPnuCounts])

    return {
      handleGetPnuCounts,
      handleGetOriginMapPnuCounts,
    }
  }

  const handleDuplicatedItems = useCallback(() => {
    if (mapItems) {
      const seen = new Set()
      let filteredMarkers = mapItems.filter((item) => {
        const key = `${item.pnu}-${item.type}`
        if (seen.has(key)) {
          return false
        } else {
          seen.add(key)
          return true
        }
      })
      // type === 1, 2, 3이면서 winYn !== 'Y'인 아이템들과 pnu가 같은 item.winYn === 'Y' 아이템들을 걸러내기
      filteredMarkers = mapItems.filter(
        (item) =>
          mapItems.findIndex(
            (item2) => item2.pnu === item.pnu && item2.winYn !== item.winYn,
          ) !== -1,
      )
      const duplicatedKwItems = mapItems.filter(
        (item) =>
          item.type === 4 &&
          mapItems.some(
            (item2) =>
              (item2.type === 1 || item2.type === 2 || item2.type === 3) &&
              item2.pnu === item.pnu,
          ),
      )

      if (formData.ekm || formData.egm || formData.egg) {
        if (duplicatedItems.length > 0) {
          setDuplicatedItems(duplicatedItems)
          // winYn이 'Y'인 아이템의 x, y 좌표 리스트 만들기
          const duplicatedYItems = duplicatedItems
            .filter((item) => item.winYn === 'Y')
            .map((item) => ({
              pnu: item.pnu,
            }))
          const filteredItems = mapItems.filter((item) => {
            const isDuplicatedYItem = duplicatedYItems.some(
              (dupItem) => item.pnu === dupItem.pnu,
            )
            if (isDuplicatedYItem) {
              // winYn === 'Y' 인 아이템과 item.type === 4인 아이템이 좌표가 같을 경우
              const hasType4 = mapItems.some(
                (otherItem) =>
                  otherItem.pnu === item.pnu && otherItem.type === 4,
              )
              if (item.winYn !== 'Y' && hasType4) {
                return false // type === 4인 아이템 제거
              }
              // winYn === 'Y' 인 아이템과 item.type === 1 || 2 || 3 이면서 winYn !== 'Y' 아이템이 좌표가 같은 경우
              const hasType1Or2Or3NonY = mapItems.some(
                (otherItem) =>
                  otherItem.pnu === item.pnu &&
                  (otherItem.type === 1 ||
                    otherItem.type === 2 ||
                    otherItem.type === 3) &&
                  otherItem.winYn !== 'Y',
              )
              if (hasType1Or2Or3NonY && item.winYn === 'Y') {
                return false // winYn === 'Y'인 아이템 제거
              }
            }
            return true // 유지
          })
          setMapItems(filteredItems)
        }
      }
      if (formData.kw) {
        if (duplicatedKwItems.length > 0) {
          const filteredItems = mapItems.filter((item) => {
            const isDuplicatedKwItem = duplicatedKwItems.some(
              (dupItem) =>
                item.pnu === dupItem.pnu && item.type === dupItem.type,
            )
            if (isDuplicatedKwItem) {
              // type === 4인 아이템 제거
              return false
            }
            return true
          })
          setMapItems(filteredItems)
        }
      }
    }
  }, [mapItems, setMapItems, setDuplicatedItems, formData])

  const handleFilterMarkers = useCallback(() => {
    if (mapItems) {
      const seen = new Set()
      const filteredMarkers = mapItems.filter((item) => {
        const key = `${item.pnu}-${item.type}`
        if (seen.has(key)) {
          return false
        } else {
          seen.add(key)
          return true
        }
      })
      return filteredMarkers
    }
  }, [mapItems])

  const { handleGetPnuCounts, handleGetOriginMapPnuCounts } =
    usePnuCountHandler(mapItems, mapOrigin, setPnuCounts, setOriginPnuCounts)

  useEffect(() => {
    if (map) {
      handleParameters(token, type, idCode, map as NaverMap)
    }
  }, [map, idCode, type, token])

  useEffect(() => {
    handleSyncMap()
  }, [clickedMapType])

  useEffect(() => {
    if (mapItems?.length > 0) {
      handleGetPnuCounts()
    }
    if (mapOrigin?.length > 0) {
      handleGetOriginMapPnuCounts()
    }
  }, [mapItems, mapOrigin])

  useEffect(() => {
    if (mapItems) {
      handleDuplicatedItems()
    }
  }, [formData.ekm, formData.kw, mapItems])

  useEffect(() => {
    searchCoordinateToAddress(auth.lat, auth.lng, setGetGungu)
  }, [auth.lat, auth.lng, auth.address, searchCoordinateToAddress])
  return {
    pnuCounts,
    originPnuCounts,
    mapCount,
    setMapCount,
    openOverlay,
    setOpenOverlay,
    isOpen,
    setIsOpen,
    clickedMapType,
    setClickedMapType,
    handleFilterMarkers,
    searchCoordinateToAddress,
  }
}

export default useMapUtils

import { GetServerSidePropsContext } from 'next'
import { useCallback, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import MapSection from '@/components/map/sections/MapSection'
import { authInfo } from '@/store/atom/auth'
import {
  getGgItem,
  getGmItem,
  getKmItem,
  getKwItem,
} from '@/remote/map/selectedItem/getItem'
import {
  formDataAtom,
  jusoAtom,
  mapItemsAtom,
  mapListAtom,
  selectedItemAtom,
} from '@/store/atom/map'
import { getPosition } from '@/remote/map/auth/getPosition'
import { NaverMap } from '@/models/Map'
import handleToken from '@/remote/map/auth/token'
import { GetItemResponse, MapItem, MapItems, PageInfo } from '@/models/MapItem'
import useSessionStorage from '@/hooks/useSessionStorage'
import { useRouter } from 'next/router'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { UseQueryResult, useQuery } from 'react-query'

declare global {
  interface Window {
    naver: any
  }
}
interface Props {
  data?: {
    userId: string | null
    authorities: string[] | null
  }
  token?: string | null
  type?: string | null
  idCode?: string | null
}

function MapComponent({ token, type, idCode }: Props) {
  const setAuth = useSetRecoilState(authInfo)
  const setMapList = useSetRecoilState(mapListAtom)
  const setMapItems = useSetRecoilState(mapItemsAtom)
  const setJuso = useSetRecoilState(jusoAtom)
  const setSelectedData = useSetRecoilState(selectedItemAtom)
  const setFormData = useSetRecoilState(formDataAtom)
  const router = useRouter()
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })
  const [tokenValue, setTokenValue] = useSessionStorage({
    key: 'token',
    initialValue: token as string,
  })
  const [typeCode, setTypeCode] = useSessionStorage({
    key: 'type',
    initialValue: type as string,
  })
  const [idCodeValue, setIdCodeValue] = useSessionStorage({
    key: 'idCode',
    initialValue: idCode as string,
  })
  const [refreshValue, setRefreshValue] = useSessionStorage({
    key: 'isRefresh',
    initialValue: 'false',
  })
  const setMapOptions = useCallback((map: NaverMap) => {
    if (!map) return
    map.setOptions({
      scrollWheel: false,
      disableDoubleClickZoom: true,
      draggable: false,
    })
  }, [])

  let ok = false
  console.log('테스트 중')
  const handleGetPosition = useCallback(
    async (type: string) => {
      if (idCode) return
      try {
        const { x, y } = await getPosition(type)
        if (x && y) {
          setAuth((prev) => ({
            ...prev,
            lat: y,
            lng: x,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    [setAuth],
  )

  const handleItemType = useCallback((type: string) => {
    switch (type) {
      case '1':
        return 'kmItem'
      case '2':
        return 'gmItem'
      case '3':
        return 'gmItem'
      case '4':
        return 'kwItem'
    }
  }, [])

  const handleDataFetching = async (type: string, idCode: string) => {
    try {
      let response: GetItemResponse | null = null
      switch (type) {
        case '1':
          response = (await getKmItem(idCode)) || null
          setFormData((prev) => ({
            ...prev,
            km: true,
          }))
          setAuth((prev) => ({
            ...prev,
            idCode: idCode,
            id: response?.data?.id ? response?.data.id : '',
          }))
          break
        case '2':
          response = (await getGmItem(idCode)) || null
          setFormData((prev) => ({
            ...prev,
            gm: true,
            gg: true,
          }))
          setAuth((prev) => ({
            ...prev,
            idCode: idCode,
            id: response?.data?.goodsId ? response?.data.goodsId : '',
          }))
          break
        case '3':
          response = (await getGgItem(idCode)) || null
          setFormData((prev) => ({
            ...prev,
            gm: true,
            gg: true,
          }))
          setAuth((prev) => ({
            ...prev,
            idCode: idCode,
            id: response?.data?.goodsId ? response?.data.goodsId : '',
          }))
          break
        case '4':
          response = (await getKwItem(idCode)) || null
          setFormData((prev) => ({
            ...prev,
            kw: true,
          }))
          setAuth((prev) => ({
            ...prev,
            idCode: idCode,
            id: response?.data?.id ? response?.data.id : '',
          }))
          break
      }

      if (response && response.success) {
        const { data } = response

        setSelectedData((prev) => ({
          ...prev,
          [`${handleItemType(type)}`]: data,
        }))

        setAuth((prev) => ({
          ...prev,
          lat: data.y,
          lng: data.x,
          detailLat: data.y,
          detailLng: data.x,
          type: type,
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleParameters = useCallback(
    async (token: string, type: string, idCode?: string, map?: NaverMap) => {
      const delayExecution = (callback: () => void, delay: number) => {
        setTimeout(callback, delay)
      }
      const runDelayedConfirm = async () => {
        if (!ok && window) {
          ok = true
          delayExecution(() => {
            alert('지도 검색은 유료서비스 입니다.')
            window.close()
          }, 500)
        }
      }

      try {
        const response = await handleToken(token, type)
        if (response?.success) {
          const handleAuthenticated = async () => {
            setAuth((prev) => ({
              ...prev,
              isLogin: true,
              isAuth: true,
              role: response.data.authorities,
              isInitialized: true,
            }))
            setFormData((prev) => ({
              ...prev,
              km: type === '1',
              kw: type === '4',
              gm: type === '2' || type === '3',
              gg: type === '3' || type === '2',
              role: response.data.authorities[0],
            }))
            if (!idCode) {
              handleGetPosition(type as string)
            } else {
              await handleDataFetching(type, idCode)
            }
          }
          const handleAnonymous = () => {
            setMapOptions(map as NaverMap)
            setAuth((prev) => ({
              ...prev,
              isLogin: false,
              isAuth: true,
              role: response.data.authorities,
            }))
            setFormData((prev) => ({
              ...prev,
              km: type === '1',
              kw: type === '4',
              gm: type === '2' || type === '3',
              gg: type === '3' || type === '2',
            }))
            runDelayedConfirm()
          }
          if (
            response.data.authorities.includes('ROLE_ANONYMOUS') ||
            response.data.authorities.includes('ROLE_FREE')
          ) {
            setJuso((prev) => ({
              ...prev,
              topSido: '서울특별시',
              topGungu: '서초구',
              topDong: '서초동',
            }))
            handleAnonymous()
            setMapItems(response.data.mapItems as MapItem[])
            setMapList({
              contents: response.data.contents?.contents as MapItems[],
              paging: response.data.contents?.paging as PageInfo,
            })
          } else {
            handleAuthenticated()
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    [setAuth, setFormData, setJuso, setMapItems, setMapList, setMapOptions],
  )

  useEffect(() => {
    const handleRefresh = async () => {
      if (refreshValue === 'false') {
        setRefreshValue('true')
        return
      }
      if (typeCode && !idCodeValue && idCode) {
        if (typeCode !== type) {
          setTypeCode(type as string)
          const url = `/map?token=${tokenValue}&type=${type}&idCode=${idCode}`
          router.push(url)
        }
        const url = `/map?token=${tokenValue}&type=${typeCode}&idCode=${idCode}`
        router.push(url)
      } else if (typeCode && !idCodeValue && !idCode) {
        if (typeCode !== type) {
          setTypeCode(type as string)
          const url = `/map?token=${tokenValue}&type=${type}`
          router.push(url)
        }
        const url = `/map?token=${tokenValue}&type=${typeCode}`
        router.push(url)
      } else if (typeCode && idCodeValue && idCode) {
        if (typeCode !== type) {
          setTypeCode(type as string)
          const url = `/map?token=${tokenValue}&type=${type}&idCode=${idCode}`
          router.push(url)
        }
        const url = `/map?token=${tokenValue}&type=${typeCode}&idCode=${idCode}`
        router.push(url)
      } else if (typeCode && idCodeValue && !idCode) {
        if (typeCode !== type) {
          setTypeCode(type as string)
          const url = `/map?token=${tokenValue}&type=${type}`
          router.push(url)
        }
        const url = `/map?token=${tokenValue}&type=${typeCode}`
        router.push(url)
      }
      setTimeout(() => {
        window.history.replaceState({}, '', '/map')
      }, 1000)
    }
    handleRefresh()
  }, [typeCode, idCodeValue, refreshValue])

  useEffect(() => {
    if (!map) return
    handleParameters(token as string, type as string, idCode as string, map)
  }, [map, token, type, idCode, handleParameters])

  return <MapSection />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { token, type, idCode } = context.query

  return {
    props: {
      token: token ?? null,
      type: type ?? null,
      idCode: idCode ?? null,
    },
  }
}

export default MapComponent

import getAddress from '@/remote/map/auth/getAddress'
import { GetServerSidePropsContext } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import MapSection from '@/components/map/sections/MapSection'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { authInfo } from '@/store/atom/auth'
import {
  getGmItem,
  getKmItem,
  getKwItem,
} from '@/remote/map/selectedItem/getItem'
import {
  SelectedGgItem,
  SelectedGmItem,
  SelectedKmItem,
  SelectedKwItem,
} from '@/models/SelectedItem'
import {
  formDataAtom,
  jusoAtom,
  mapItemsAtom,
  mapListAtom,
} from '@/store/atom/map'
import { getPosition } from '@/remote/map/auth/getPosition'
import { NaverMap } from '@/models/Map'
import handleToken from '@/remote/map/auth/token'
import { getSampleItems } from '@/remote/map/auth/getSampleItems'
import { GetItemResponse } from '@/models/MapItem'
interface Props {
  data?: {
    userId: string | null
    authorities: string[] | null
  }
  token?: string | null
  type?: string | null
  idCode?: string | null
}
declare global {
  interface Window {
    naver: any
  }
}

function MapComponent({ token, type, idCode }: Props) {
  const { data: map } = useSWR(MAP_KEY)
  const [auth, setAuth] = useRecoilState(authInfo)
  const [mapList, setMapList] = useRecoilState(mapListAtom)
  const [mapItems, setMapItems] = useRecoilState(mapItemsAtom)
  const [juso, setJuso] = useRecoilState(jusoAtom)
  const [selectedData, setSelectedData] = useState<
    SelectedKmItem | SelectedGmItem | SelectedGgItem | SelectedKwItem | null
  >(null)
  const [formData, setFormData] = useRecoilState(formDataAtom)

  const setMapOptions = useCallback((map: NaverMap) => {
    if (!map) return
    map.setOptions({
      scrollWheel: false,
      disableDoubleClickZoom: true,
      draggable: false,
    })
  }, [])

  const handleGetPosition = useCallback(
    async (addr: string) => {
      try {
        const response = await getPosition(addr, setAuth)
        if (response) {
          setAuth((prev) => ({
            ...prev,
            lat: response.data.data.y,
            lng: response.data.data.x,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    [setAuth],
  )

  const handleGetAddress = useCallback(async () => {
    try {
      const response = await getAddress()
      if (response) {
        setAuth((prev) => {
          return {
            ...prev,
            address: response.address,
          }
        })
        handleGetPosition(response.address)
      }
    } catch (error) {
      console.error(error)
    }
  }, [setAuth, handleGetPosition])

  const handleDataFetching = async (type: string, idCode: string) => {
    try {
      let response: GetItemResponse | null = null
      switch (type) {
        case '1':
          response = (await getKmItem(idCode)) || null
          if (response?.success) {
            setFormData((prev) => ({
              ...prev,
              km: true,
              ekm: response?.data.winAmt! > 0,
              awardedMonths: 60,
            }))
            setAuth((prev) => {
              return {
                ...prev,
                detailLng: response?.data.x || 0, // Assign a default value of 0 if undefined
                detailLat: response?.data.y || 0, // Assign a default value of 0 if undefined
              }
            })
          }
          break
        case '2':
        case '3':
          response = (await getGmItem(idCode)) || null
          if (response?.success) {
            setFormData((prev) => ({
              ...prev,
              gm: type === '2',
              gg: type === '3',
              egm: (type === '2' && response?.data.winAmt! > 0) || false,
              egg: (type === '3' && response?.data.winAmt! > 0) || false,
              awardedMonths: 60,
            }))
            setAuth((prev) => {
              return {
                ...prev,
                detailLng: response?.data.x || 0, // Assign a default value of 0 if undefined
                detailLat: response?.data.y || 0, // Assign a default value of 0 if undefined
              }
            })
          }
          break
        case '4':
          response = (await getKwItem(idCode)) || null
          if (response?.success) {
            setFormData((prev) => ({
              ...prev,
              kw: true,
            }))
            setAuth((prev) => {
              return {
                ...prev,
                detailLng: response?.data.x ?? 0, // Assign a default value of 0 if undefined
                detailLat: response?.data.y ?? 0, // Assign a default value of 0 if undefined
              }
            })
          }
          break
      }

      if (response?.success) {
        setSelectedData(response?.data as any)
        setAuth((prev) => ({
          ...prev,
          type,
          lng: response.data.x || 0, // Assign a default value of 0 if undefined
          lat: response.data.y || 0, // Assign a default value of 0 if undefined
          idCode: response.data.idCode ?? '', // Assign a default value of '' if undefined
          goodsId: response.data.goodsId ?? '', // Assign a default value of '' if undefined
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  let ok = false
  const handleParameters = useCallback(
    async (token: string, type: string, idCode?: string, map?: NaverMap) => {
      const delayExecution = (callback: () => void, delay: number) => {
        setTimeout(callback, delay)
      }
      const runDelayedConfirm = () => {
        delayExecution(async () => {
          if (!ok && window) {
            await getSampleItems(parseInt(type!), setMapItems, setMapList)
            ok = true
            delayExecution(() => {
              alert('지도 검색은 유료서비스 입니다.')
              window.close()
            }, 500)
          }
        }, 1000)
      }

      try {
        const response = await handleToken(token)
        if (response?.data.success) {
          const handleAuthenticated = async () => {
            setAuth((prev) => ({
              ...prev,
              isLogin: true,
              isAuth: true,
              role: response.data.data.authorities,
            }))
            setFormData((prev) => ({
              ...prev,
              km: type === '1',
              kw: type === '4',
              gm: type === '2',
              gg: type === '3',
            }))

            if (!idCode) {
              handleGetAddress()
            } else {
              await handleDataFetching(type, idCode)
            }
          }

          const handleAnonymous = () => {
            setMapOptions(map as NaverMap)
            setAuth((prev) => ({
              ...prev,
              role: response.data.data.authorities,
            }))
            setJuso((prev) => ({
              ...prev,
              topSido: '서울특별시',
              topGungu: '서초구',
              topDong: '서초동',
            }))
            setFormData((prev) => ({
              ...prev,
              km: type === '1',
              kw: type === '4',
              gm: type === '2',
              gg: type === '3',
            }))
            runDelayedConfirm()
          }

          if (response.data.data.authorities.includes('ROLE_USER')) {
            await handleAuthenticated()
          } else if (
            response.data.data.authorities.includes('ROLE_ANONYMOUS')
          ) {
            handleAnonymous()
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    [
      handleGetAddress,
      setAuth,
      setFormData,
      setJuso,
      setMapItems,
      setMapList,
      setMapOptions,
    ],
  )

  useEffect(() => {
    if (window) {
      window.history.pushState({}, '', '/map')
    }
  }, [token, map, idCode, type])

  return (
    <MapSection
      token={token as string}
      idCode={idCode as string}
      type={type as string}
      handleParameters={handleParameters}
    />
  )
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

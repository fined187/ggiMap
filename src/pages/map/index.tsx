import getAddress from '@/remote/map/auth/getAddress'
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
import { getSampleItems } from '@/remote/map/auth/getSampleItems'
import { GetItemResponse } from '@/models/MapItem'
import useSessionStorage from '@/hooks/useSessionStorage'
import { useRouter } from 'next/router'

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
  const setAuth = useSetRecoilState(authInfo)
  const setMapList = useSetRecoilState(mapListAtom)
  const setMapItems = useSetRecoilState(mapItemsAtom)
  const setJuso = useSetRecoilState(jusoAtom)
  const setSelectedData = useSetRecoilState(selectedItemAtom)
  const setFormData = useSetRecoilState(formDataAtom)
  const router = useRouter()
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
            ekm: response?.data?.winAmt ? response?.data.winAmt > 0 : false,
            awardedMonths:
              response?.data?.winAmt && response?.data.winAmt > 0 ? 60 : 0,
          }))
          setAuth((prev) => ({
            ...prev,
            idCode: response?.data?.id ? response?.data.id : '',
          }))
          break
        case '2':
          response = (await getGmItem(idCode)) || null
          setFormData((prev) => ({
            ...prev,
            gm: true,
            gg: true,
            egg: response?.data?.winAmt ? response?.data.winAmt > 0 : false,
            egm: response?.data?.winAmt ? response?.data.winAmt > 0 : false,
            awardedMonths:
              response?.data?.winAmt && response?.data.winAmt > 0 ? 60 : 0,
          }))
          setAuth((prev) => ({
            ...prev,
            idCode: response?.data?.goodsId ? response?.data.goodsId : '',
          }))
          break
        case '3':
          response = (await getGgItem(idCode)) || null
          setFormData((prev) => ({
            ...prev,
            gm: true,
            gg: true,
            egg: response?.data?.winAmt ? response?.data.winAmt > 0 : false,
            egm: response?.data?.winAmt ? response?.data.winAmt > 0 : false,
            awardedMonths:
              response?.data?.winAmt && response?.data.winAmt > 0 ? 60 : 0,
          }))
          setAuth((prev) => ({
            ...prev,
            idCode: response?.data?.goodsId ? response?.data.goodsId : '',
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
            idCode: response?.data?.id ? response?.data.id : '',
          }))
          break
      }

      if (response && response.success) {
        const { data } = response

        setSelectedData((prev: any) => ({
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

  let ok = false
  const handleParameters = useCallback(
    async (token: string, type: string, idCode?: string, map?: NaverMap) => {
      const delayExecution = (callback: () => void, delay: number) => {
        setTimeout(callback, delay)
      }
      const runDelayedConfirm = async () => {
        await getSampleItems(parseInt(type!), setMapItems, setMapList)
        delayExecution(() => {
          if (!ok && window) {
            ok = true
            delayExecution(() => {
              alert('지도 검색은 유료서비스 입니다.')
              window.close()
            }, 500)
          }
        }, 500)
      }

      try {
        if (token) {
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
                gm: type === '2' || type === '3',
                gg: type === '3' || type === '2',
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
                isLogin: false,
                isAuth: true,
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
                gm: type === '2' || type === '3',
                gg: type === '3' || type === '2',
              }))
              runDelayedConfirm()
            }
            if (
              response.data.data.authorities.includes(
                'ROLE_ANONYMOUS' || 'ROLE_FREE',
              )
            ) {
              handleAnonymous()
            } else {
              handleAuthenticated()
            }
          }
          setTimeout(() => {
            window.history.replaceState({}, '', '/map')
          }, 500)
        } else if (!token) {
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
    const handleRefresh = async () => {
      if (typeCode && idCodeValue) {
        const url = `/map?token=${tokenValue}&type=${typeCode}&idCode=${idCodeValue}`
        router.push(url)
      } else if (typeCode && !idCodeValue) {
        const url = `/map?token=${tokenValue}&type=${typeCode}`
        router.push(url)
      }
      setTimeout(() => {
        window.history.replaceState({}, '', '/map')
      }, 1000)
    }
    handleRefresh()
  }, [typeCode, idCodeValue])
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

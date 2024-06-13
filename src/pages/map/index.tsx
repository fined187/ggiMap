import { Form } from '@/models/Form'
import getAddress from '@/remote/map/auth/getAddress'
import { userAtom } from '@/store/atom/postUser'
import { GetServerSidePropsContext } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import axios from 'axios'
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
import { mapListAtom } from '@/store/atom/map'
import { getPosition } from '@/remote/map/auth/getPosition'
import { NaverMap } from '@/models/Map'
import { useAuth } from '@/hooks/auth/useAuth'
import handleToken from '@/remote/map/auth/token'
type jusoProps = {
  sido: string
  gungu: string
  dong: string
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
declare global {
  interface Window {
    naver: any
  }
}

function MapComponent({ token, type, idCode }: Props) {
  const { data: map } = useSWR(MAP_KEY)
  const [user, setUser] = useRecoilState(userAtom)
  const [auth, setAuth] = useRecoilState(authInfo)
  const [mapList, setMapList] = useRecoilState(mapListAtom)
  const [topJuso, setTopJuso] = useState<jusoProps>({
    sido: '',
    gungu: '',
    dong: '',
  })
  const [bottomJuso, setBottomJuso] = useState<jusoProps>({
    sido: '',
    gungu: '',
    dong: '',
  })
  const [getGungu, setGetGungu] = useState<string>('')
  const [selectedData, setSelectedData] = useState<
    SelectedKmItem | SelectedGmItem | SelectedGgItem | SelectedKwItem | null
  >(null)
  const [formData, setFormData] = useState<Form>({
    usageCodes: '',
    ids: ['2', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14'],
    fromAppraisalAmount: 0,
    toAppraisalAmount: 0,
    fromMinimumAmount: 0,
    toMinimumAmount: 0,
    interests: false,
    x1: 1,
    y1: 1,
    x2: 1,
    y2: 1,
    awardedMonths: 0,
    km: false,
    kw: false,
    gm: false,
    gg: false,
    gk: false,
    isSubFilterBoxOpen: false,
    lastFilter: 1,
    ekm: false,
    egm: false,
    egg: false,
    map: {},
    keyword: '',
  })

  const setMapOptions = useCallback((map: NaverMap) => {
    if (!map) return
    map.setOptions({
      scrollWheel: false,
      disableDoubleClickZoom: true,
      draggable: false,
    })
  }, [])

  const handleGetAddress = useCallback(async () => {
    try {
      const response = await getAddress()
      if (response) {
        setUser((prev) => {
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
  }, [setUser])

  const handleDataFetching = async (type: string, idCode: string) => {
    try {
      let response: any
      switch (type) {
        case '1':
          response = await getKmItem(idCode)
          if (response?.data.success) {
            setFormData((prev) => ({
              ...prev,
              km: true,
              ekm: response.data.data.winAmt > 0,
              awardedMonths: 60,
            }))
          }
          break
        case '2':
        case '3':
          response = await getGmItem(idCode)
          if (response?.data.success) {
            setFormData((prev) => ({
              ...prev,
              gm: type === '2',
              gg: type === '3',
              egm: type === '2' && response.data.data.winAmt > 0,
              egg: type === '3' && response.data.data.winAmt > 0,
              awardedMonths: 60,
            }))
          }
          break
        case '4':
          response = await getKwItem(idCode)
          if (response?.data.success) {
            setFormData((prev) => ({
              ...prev,
              kw: true,
            }))
          }
          break
      }

      if (response?.data.success) {
        setSelectedData(response.data.data)
        setAuth((prev) => ({
          ...prev,
          idCode,
          type,
        }))
        setUser((prev) => ({
          ...prev,
          lng: response.data.data.x,
          lat: response.data.data.y,
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetPosition = useCallback(
    async (addr: string) => {
      try {
        const response = await getPosition(addr, setUser)
        if (response) {
          setUser((prev: any) => ({
            ...prev,
            lat: response.data.data.y,
            lng: response.data.data.x,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    [setUser],
  )

  let ok = false
  const handleParameters = useCallback(
    async (token?: string, type?: string, idCode?: string) => {
      const delayExecution = (callback: () => void, delay: number) => {
        setTimeout(callback, delay)
      }

      const runDelayedConfirm = () => {
        delayExecution(() => {
          if (
            !ok &&
            window &&
            window.confirm('지도검색은 유료서비스 입니다. 로그인후 이용하세요')
          ) {
            ok = true
            window.close()
          } else {
            ok = true
          }
        }, 1000)
      }

      try {
        if (token) {
          const response = await handleToken(token)
          if (response?.data.success) {
            if (response?.data.data.authorities.includes('ROLE_USER')) {
              setAuth((prev) => ({
                ...prev,
                isLogin: true,
                isAuth: true,
                role: response.data.data.authorities,
              }))
              setUser((prev) => ({
                ...prev,
                role: response.data.data.authorities,
              }))
              handleGetAddress()
            } else {
              setUser((prev) => {
                return {
                  ...prev,
                  role: response.data.data.authorities,
                }
              })
              setMapOptions(map)
              setTopJuso({
                sido: '서울특별시',
                gungu: '서초구',
                dong: '서초동',
              })
              runDelayedConfirm()
            }
          } else {
            alert('사용자 정보를 가져오는데 실패했습니다.')
          }
          if (type && !idCode) {
            setFormData((prev) => ({
              ...prev,
              km: type === '1',
              kw: type === '4',
              gm: type === '2',
              gg: type === '3',
            }))
          } else if (type && idCode) {
            await handleDataFetching(type, idCode)
          }
        } else if (auth.role.includes('ROLE_USER') && idCode && type) {
          await handleDataFetching(type, idCode)
        } else {
          setTopJuso({
            sido: '서울특별시',
            gungu: '서초구',
            dong: '서초동',
          })
          runDelayedConfirm()
        }
      } catch (error) {
        console.error(error)
      }
    },
    [handleGetAddress, auth.role],
  )

  useEffect(() => {
    handleParameters(token as string, type as string, idCode as string)
    if (window) {
      window.history.pushState({}, '', '/map')
    }
  }, [token, map, idCode, type])

  return (
    <>
      <MapSection
        formData={formData}
        setFormData={setFormData}
        topJuso={topJuso}
        setTopJuso={setTopJuso}
        bottomJuso={bottomJuso}
        setBottomJuso={setBottomJuso}
        getGungu={getGungu}
        setGetGungu={setGetGungu}
        setMapOptions={setMapOptions}
      />
    </>
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

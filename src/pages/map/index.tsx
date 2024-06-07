import { Form } from '@/models/Form'
import getAddress from '@/remote/map/auth/getAddress'
import { userAtom } from '@/store/atom/postUser'
import { GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'
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
import getPolypath from '@/remote/map/selected/getPolypath'

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

  const handleGetAddress = async () => {
    try {
      const response = await getAddress()
      if (response) {
        setUser((prev) => {
          return {
            ...prev,
            address: response.address,
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleParameters = async (
    token?: string,
    type?: string,
    idCode?: string,
  ) => {
    try {
      if (token) {
        const response = await axios.post(
          `/ggi/api/auth/asp`,
          {},
          {
            headers: {
              'Content-Type': 'Application/json',
              Api_Key: 'iyv0Lk8v.GMiSXcZDDSRLquqAm7M9YHVwTF4aY8zr',
              Authorization: token,
            },
          },
        )
        if (token && type && !idCode) {
          setFormData((prev) => {
            return {
              ...prev,
              km: type === '1' ? true : false,
              kw: type === '4' ? true : false,
              gm: type === '2' ? true : false,
              gg: type === '3' ? true : false,
            }
          })
          if (response.data.success === true) {
            if (response.data.data.authorities[0] === 'ROLE_USER') {
              setAuth((prev) => {
                return {
                  ...prev,
                  isLogin: true,
                  isAuth: true,
                  role: response.data.data.authorities,
                }
              })
              handleGetAddress()
            } else {
              if (
                window &&
                window.confirm(
                  '지도검색은 유료서비스 입니다. 로그인후 이용하세요',
                )
              ) {
                window.close()
              }
            }
          } else {
            alert('사용자 정보를 가져오는데 실패했습니다.')
          }
        } else if (token && type && idCode) {
          try {
            if (type === '1') {
              const response = await getKmItem(idCode)
              if (response?.data.success) {
                setFormData((prev) => {
                  return {
                    ...prev,
                    km: true,
                    ekm: response.data.data.winAmt > 0 ? true : false,
                    awardedMonths: 60,
                  }
                })
                setSelectedData(response.data.data)
                setAuth((prev) => {
                  return {
                    ...prev,
                    idCode: idCode,
                    type: type,
                  }
                })
                setUser((prev) => {
                  return {
                    ...prev,
                    lng: response.data.data.x,
                    lat: response.data.data.y,
                  }
                })
              }
            } else if (type === '2' || type === '3') {
              const response = await getGmItem(idCode)
              if (response?.data.success) {
                setFormData((prev) => {
                  return {
                    ...prev,
                    gm: response.data.data.type === 2 ? true : false,
                    gg: response.data.data.type === 3 ? true : false,
                    egm:
                      response.data.data.type === 2 &&
                      response.data.data.winAmt > 0
                        ? true
                        : false,
                    egg:
                      response.data.data.type === 3 &&
                      response.data.data.winAmt > 0
                        ? true
                        : false,
                    awardedMonths: 60,
                  }
                })
                setSelectedData(response.data.data)
                setAuth((prev) => {
                  return {
                    ...prev,
                    idCode: idCode,
                    type: type,
                  }
                })
                setUser((prev) => {
                  return {
                    ...prev,
                    lng: response.data.data.x,
                    lat: response.data.data.y,
                  }
                })
              }
            } else if (type === '4') {
              const response = await getKwItem(idCode)
              if (response?.data.success) {
                setFormData((prev) => {
                  return {
                    ...prev,
                    kw: true,
                  }
                })
                setSelectedData(response.data.data)
                setAuth((prev) => {
                  return {
                    ...prev,
                    idCode: idCode,
                    type: type,
                  }
                })
                setUser((prev) => {
                  return {
                    ...prev,
                    lng: response.data.data.x,
                    lat: response.data.data.y,
                  }
                })
              }
            }
          } catch (error) {
            console.error(error)
          }
        }
      } else {
        if (auth.role[0] === 'ROLE_USER') {
          if (idCode) {
            try {
              if (type === '1') {
                const response = await getKmItem(idCode)
                if (response?.data.success) {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      km: true,
                      ekm: response.data.data.winAmt > 0 ? true : false,
                      awardedMonths: 60,
                    }
                  })
                  setSelectedData(response.data.data)
                  setAuth((prev) => {
                    return {
                      ...prev,
                      idCode: idCode,
                      type: type,
                    }
                  })
                  setUser((prev) => {
                    return {
                      ...prev,
                      lng: response.data.data.x,
                      lat: response.data.data.y,
                    }
                  })
                }
              } else if (type === '2' || type === '3') {
                const response = await getGmItem(idCode)
                if (response?.data.success) {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      gm: response.data.data.type === 2 ? true : false,
                      gg: response.data.data.type === 3 ? true : false,
                      egm:
                        response.data.data.type === 2 &&
                        response.data.data.winAmt > 0
                          ? true
                          : false,
                      egg:
                        response.data.data.type === 3 &&
                        response.data.data.winAmt > 0
                          ? true
                          : false,
                      awardedMonths: 60,
                    }
                  })
                  setSelectedData(response.data.data)
                  setAuth((prev) => {
                    return {
                      ...prev,
                      idCode: idCode,
                      type: type,
                    }
                  })
                  setUser((prev) => {
                    return {
                      ...prev,
                      lng: response.data.data.x,
                      lat: response.data.data.y,
                    }
                  })
                }
              } else if (type === '4') {
                const response = await getKwItem(idCode)
                if (response?.data.success) {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      kw: true,
                    }
                  })
                  setSelectedData(response.data.data)
                  setAuth((prev) => {
                    return {
                      ...prev,
                      idCode: idCode,
                      type: type,
                    }
                  })
                  setUser((prev) => {
                    return {
                      ...prev,
                      lng: response.data.data.x,
                      lat: response.data.data.y,
                    }
                  })
                }
              } else {
                switch (type) {
                  case '1':
                    setFormData((prev) => {
                      return {
                        ...prev,
                        km: true,
                      }
                    })
                    break
                  case '2':
                    setFormData((prev) => {
                      return {
                        ...prev,
                        gm: true,
                      }
                    })
                    break
                  case '3':
                    setFormData((prev) => {
                      return {
                        ...prev,
                        gg: true,
                      }
                    })
                    break
                  case '4':
                    setFormData((prev) => {
                      return {
                        ...prev,
                        kw: true,
                      }
                    })
                    break
                  default:
                    break
                }
              }
            } catch (error) {
              console.error(error)
            }
          }
        } else {
          if (
            window &&
            window.confirm('지도검색은 유료서비스 입니다. 로그인후 이용하세요')
          ) {
            window.close()
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleParameters(token as string, type as string, idCode as string)
    if (window) {
      window.history.pushState({}, '', '/map')
    }
  }, [token, map])

  return (
    <>
      <MapSection formData={formData} setFormData={setFormData} />
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

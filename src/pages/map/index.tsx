import Map from '@/components/map/sections/MapSection'
import { Form } from '@/models/Form'
import { mapItem } from '@/models/api/mapItem'
import getAddress from '@/remote/map/auth/getAddress'
import { userAtom } from '@/store/atom/postUser'
import { GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import MapSection from '@/components/map/sections/MapSection'

interface Props {
  data?: {
    userId: string | null
    authorities: string[] | null
  }
  token: string | null
}
declare global {
  interface Window {
    naver: any
  }
}

function MapComponent({ token }: Props) {
  const [user, setUser] = useRecoilState(userAtom)
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
    km: true,
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

  async function handleToken(token: string) {
    try {
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
      if (response.data.success === true) {
        setUser((prev) => {
          return {
            ...prev,
            aesUserId: response?.data?.data?.userId ?? '',
            authorities: response?.data?.data?.authorities ?? [],
          }
        })
        handleGetAddress()
        return response.data.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleToken(token as string)
    if (window) {
      window.history.pushState({}, '', '/map')
    }
    handleGetAddress()
  }, [token])

  return (
    <>
      <MapSection formData={formData} setFormData={setFormData} />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.query.token as string
  return {
    props: {
      token: token ?? null,
    },
  }
}

export default MapComponent

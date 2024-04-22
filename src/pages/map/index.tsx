import Map from '@/components/map/sections/Map'
import { Form } from '@/models/Form'
import { mapItem } from '@/models/api/mapItem'
import getAddress from '@/remote/map/auth/getAddress'
import { userAtom } from '@/store/atom/postUser'
import { GetServerSidePropsContext, GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import handleToken from '@/remote/map/auth/token'

interface Props {
  data: {
    userId: string | null
    authorities: string[] | null
  }
}

function MapComponent({ data }: Props) {
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
    userId: 'best',
    km: true,
    kw: true,
    gm: true,
    gg: true,
    gk: true,
    isSubFilterBoxOpen: false,
    lastFilter: 1,
    ekm: false,
    egm: false,
    egg: false,
    map: {},
    keyword: '',
  })
  const mapData: mapItem = {
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
    gm: formData.gm,
    gg: formData.gg,
    ekm: formData.ekm,
    egm: formData.egm,
    egg: formData.egg,
  }

  const handleGetAddress = async () => {
    try {
      const response = await getAddress()
      console.log(response)
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

  useEffect(() => {
    if (window) {
      window.history.pushState({}, '', '/map')
    }
    handleGetAddress()
    setUser((prev) => {
      return {
        ...prev,
        aesUserId: data?.userId ?? '',
        authorities: data?.authorities ?? [],
      }
    })
  }, [data])

  return (
    <>
      <Map formData={formData} setFormData={setFormData} />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.query.token as string
  const data = await handleToken(token)
  return {
    props: {
      data: data ?? null,
    },
  }
}

export default MapComponent

import Map from '@/components/sections/Map'
import BoxGuard from '@/components/shared/BoxGuard'
import SearchBox from '@/components/sideMenu/searchBox'
import ListBox from '@/components/sideMenu/searchListBox/listBox/ListBox'
import useUser from '@/hooks/auth/useUser'
import usePostMapItems from '@/hooks/items/usePostMapItems'
import { Form } from '@/models/Form'
import { mapItem } from '@/models/api/mapItem'
import { useEffect, useState } from 'react'

export default function Home() {
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

  const [items, setItems] = useState([])

  const { mutate } = useUser()
  useEffect(() => {
    mutate()
  }, [])
  return (
    <>
      <Map formData={formData} setFormData={setFormData} />
      <BoxGuard>
        <SearchBox formData={formData} setFormData={setFormData} />
        <ListBox formData={formData} setFormData={setFormData} />
      </BoxGuard>
    </>
  )
}

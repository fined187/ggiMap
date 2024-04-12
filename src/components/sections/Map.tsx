import { Form } from '@/models/Form'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import {
  Container,
  Container as MapDiv,
  NaverMapProps,
  useMap,
  useNavermaps,
} from 'react-naver-maps'
import GGMap from './GGMap'
import BoxGuard from '../shared/BoxGuard'
import SearchBox from '../sideMenu/searchBox'
import ListBox from '../sideMenu/searchListBox/listBox/ListBox'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/store/atom/postUser'

declare global {
  interface Window {
    naver: any
  }
}

interface Props {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
}

export default function Map({ formData, setFormData }: Props) {
  const user = useRecoilValue(userAtom)
  const [center, setCenter] = useState({
    lat: user.lat,
    lng: user.lng,
  })
  return (
    <Container>
      <MapDiv
        style={{
          width: '100vw',
          height: '100vh',
        }}
      >
        <BoxGuard>
          <SearchBox
            formData={formData}
            setFormData={setFormData}
            center={center}
            setCenter={setCenter}
          />
          <ListBox formData={formData} setFormData={setFormData} />
        </BoxGuard>
        <GGMap
          formData={formData}
          setFormData={setFormData}
          center={center}
          setCenter={setCenter}
        />
      </MapDiv>
    </Container>
  )
}

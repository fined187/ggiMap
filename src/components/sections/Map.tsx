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
import TopBar from '../top'
import TopAddress from '../top/TopAddress'

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
        <TopBar>
          <TopAddress SidoAddr="서울특별시" isEnd={false} />
          <TopAddress SidoAddr="강남구" isEnd={false} />
          <TopAddress SidoAddr="대치동" isEnd={true} />
        </TopBar>
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

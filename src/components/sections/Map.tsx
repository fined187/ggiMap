import { Form } from '@/models/Form'
import { Dispatch, SetStateAction, useState } from 'react'
import { Container, Container as MapDiv, NaverMapProps } from 'react-naver-maps'
import GGMap from './GGMap'
import BoxGuard from '../shared/BoxGuard'
import SearchBox from '../sideMenu/searchBox'
import ListBox from '../sideMenu/searchListBox/listBox/ListBox'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/store/atom/postUser'
import TopBar from '../top'
import TopAddress from '../top/TopAddress'
import Sigungu from '@/constants/Sigungu.json'

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
  const siDoNameArray = Sigungu.map((item) => item.SiDoName)
  const siDoSet = new Set(siDoNameArray)
  const user = useRecoilValue(userAtom)
  const [center, setCenter] = useState({
    lat: user.lat,
    lng: user.lng,
  })
  const [windowCenter, setWindowCenter] = useState({
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
          <TopAddress
            SidoAddr={true}
            GunguAddr={false}
            DongAddr={false}
            isEnd={false}
            center={windowCenter}
            setCenter={setWindowCenter}
          />
          <TopAddress
            SidoAddr={false}
            GunguAddr={true}
            DongAddr={false}
            isEnd={false}
            center={windowCenter}
            setCenter={setWindowCenter}
          />
          <TopAddress
            SidoAddr={false}
            GunguAddr={false}
            DongAddr={true}
            isEnd={true}
            center={windowCenter}
            setCenter={setWindowCenter}
          />
        </TopBar>
        <GGMap
          formData={formData}
          setFormData={setFormData}
          center={center}
          setCenter={setCenter}
          setWindowCenter={setWindowCenter}
        />
      </MapDiv>
    </Container>
  )
}

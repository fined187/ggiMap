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
import BottomAddress from '../top/BottomAddress'
import Flex from '../shared/Flex'

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
  const [nowJuso, setNowJuso] = useState({
    sido: '',
    gungu: '',
    dong: '',
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
        <Flex direction="column">
          <TopBar>
            <TopAddress
              SidoAddr={true}
              GunguAddr={false}
              DongAddr={false}
              isEnd={false}
              center={center}
              setCenter={setCenter}
              nowJuso={nowJuso}
              setNowJuso={setNowJuso}
            />
            <TopAddress
              SidoAddr={false}
              GunguAddr={true}
              DongAddr={false}
              isEnd={false}
              center={center}
              setCenter={setCenter}
              nowJuso={nowJuso}
              setNowJuso={setNowJuso}
            />
            <TopAddress
              SidoAddr={false}
              GunguAddr={false}
              DongAddr={true}
              isEnd={true}
              center={center}
              setCenter={setCenter}
              nowJuso={nowJuso}
              setNowJuso={setNowJuso}
            />
          </TopBar>
          <BottomAddress />
        </Flex>
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

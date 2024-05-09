import { Form } from '@/models/Form'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Container, Container as MapDiv, NaverMapProps } from 'react-naver-maps'
import GGMap from './GGMap'
import BoxGuard from '../../shared/BoxGuard'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/store/atom/postUser'
import Flex from '../../shared/Flex'
import SearchBox from '../sideMenu/searchBox'
import ListBox from '../sideMenu/searchListBox/listBox/ListBox'
import TopBar from '../top'
import TopAddress from '../top/TopAddress'
import BottomAddress from '../top/BottomAddress'
import MapType from './mapType/MapType'
import MapFunction from './MapFunc/MapFunction'
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
  const [zoom, setZoom] = useState<number>(16)
  const [clickedMapType, setClickedMapType] = useState({
    basic: true,
    terrain: false,
    satellite: false,
    cadastral: false,
    interest: false,
    roadView: false,
    current: false,
    distance: false,
    area: false,
  })
  const [center, setCenter] = useState({
    lat: user.lat,
    lng: user.lng,
  })
  const [topJuso, setTopJuso] = useState({
    sido: '',
    gungu: '',
    dong: '',
  })
  const [bottomJuso, setBottomJuso] = useState({
    sido: '',
    gungu: '',
    dong: '',
  })
  const [openCursor, setOpenCursor] = useState(false)
  const [range, setRange] = useState(0)

  const handleSyncMap = () => {
    setFormData((prev) => {
      return {
        ...prev,
        interests: clickedMapType.interest,
      }
    })
  }
  useEffect(() => {
    handleSyncMap()
  }, [clickedMapType])

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
              topJuso={topJuso}
              setTopJuso={setTopJuso}
              openCursor={openCursor}
              setOpenCursor={setOpenCursor}
              range={range}
              setRange={setRange}
              bottomJuso={bottomJuso}
              setBottomJuso={setBottomJuso}
            />
            <TopAddress
              SidoAddr={false}
              GunguAddr={true}
              DongAddr={false}
              isEnd={false}
              center={center}
              setCenter={setCenter}
              topJuso={topJuso}
              setTopJuso={setTopJuso}
              openCursor={openCursor}
              setOpenCursor={setOpenCursor}
              range={range}
              setRange={setRange}
              bottomJuso={bottomJuso}
              setBottomJuso={setBottomJuso}
            />
            <TopAddress
              SidoAddr={false}
              GunguAddr={false}
              DongAddr={true}
              isEnd={true}
              center={center}
              setCenter={setCenter}
              topJuso={topJuso}
              setTopJuso={setTopJuso}
              openCursor={openCursor}
              setOpenCursor={setOpenCursor}
              range={range}
              setRange={setRange}
              bottomJuso={bottomJuso}
              setBottomJuso={setBottomJuso}
            />
          </TopBar>
          {openCursor ? (
            <BottomAddress
              center={center}
              setCenter={setCenter}
              zoom={zoom}
              setZoom={setZoom}
              range={range}
              setRange={setRange}
              setOpenCursor={setOpenCursor}
              topJuso={topJuso}
              setTopJuso={setTopJuso}
              bottomJuso={bottomJuso}
              setBottomJuso={setBottomJuso}
            />
          ) : null}
        </Flex>
        <Flex
          style={{
            width: 'calc(100vw - 400px)',
            height: '100vh',
          }}
        >
          <GGMap
            formData={formData}
            setFormData={setFormData}
            center={center}
            setCenter={setCenter}
            zoom={zoom}
            setZoom={setZoom}
            clickedMapType={clickedMapType}
            setClickedMapType={setClickedMapType}
          />
        </Flex>
        <MapType
          clickedMapType={clickedMapType}
          setClickedMapType={setClickedMapType}
        />
        <MapFunction
          clickedMapType={clickedMapType}
          setClickedMapType={setClickedMapType}
          center={center}
          setCenter={setCenter}
        />
      </MapDiv>
    </Container>
  )
}

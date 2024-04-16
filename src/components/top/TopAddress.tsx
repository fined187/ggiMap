import { css } from '@emotion/react'
import Flex from '../shared/Flex'
import Text from '../shared/Text'
import AddressArrow from '../icons/AddressArrow'
import AddressCursorArrow from '../icons/AddressCursorArrow'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useNavermaps } from 'react-naver-maps'
import BottomAddress from './BottomAddress'

interface AddressProps {
  SidoAddr: boolean
  GunguAddr: boolean
  DongAddr: boolean
  isEnd: boolean
  center: {
    lat: number
    lng: number
  }
  setCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>
  nowJuso: {
    sido: string
    gungu: string
    dong: string
  }
  setNowJuso: Dispatch<
    SetStateAction<{
      sido: string
      gungu: string
      dong: string
    }>
  >
}

function TopAddress({
  SidoAddr,
  GunguAddr,
  DongAddr,
  isEnd,
  center,
  setCenter,
  nowJuso,
  setNowJuso,
}: AddressProps) {
  const naverMaps = useNavermaps()
  const [openCursor, setOpenCursor] = useState(false)

  const centerToAddr = useCallback(() => {
    if (naverMaps?.Service?.reverseGeocode !== undefined) {
      naverMaps.Service.reverseGeocode(
        {
          location: new naverMaps.LatLng({
            lat: center.lat,
            lng: center.lng,
          }),
        },
        (status: any, response: any) => {
          if (status === naverMaps.Service.Status.ERROR) {
            return
          }
          const result = response.v2.address
          if (result.jibunAddress) {
            setNowJuso({
              sido: result.jibunAddress.match(/(\S+?[시도])/)[0],
              gungu: nowJuso.sido.match(/.*시$/)
                ? result.jibunAddress.match(/(\S+?[군구])/)[0]
                : result.jibunAddress.match(/(\S+?[시])/)[0],
              dong: nowJuso.gungu.match(/.*$시/)
                ? result.jibunAddress.match(/(\S+?[군구])/)[0]
                : result.jibunAddress.match(/(\S+?[동])/)[0],
            })
          }
        },
      )
    }
  }, [center, naverMaps, nowJuso.gungu, nowJuso.sido])

  useEffect(() => {
    centerToAddr()
  }, [center, centerToAddr])

  return (
    <>
      <Flex css={ContainerStyle}>
        <Flex
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: `${DongAddr ? 'none' : 'flex'}`,
            width: '100%',
          }}
        >
          <Text css={TextStyle}>
            {SidoAddr ? nowJuso.sido : GunguAddr ? nowJuso.gungu : ''}
          </Text>
        </Flex>
        {isEnd ? (
          <Flex
            onClick={() => {
              setOpenCursor(!openCursor)
            }}
            style={{
              justifyContent: 'end',
              alignItems: 'center',
              display: 'flex',
              width: '100%',
              gap: '20px',
            }}
          >
            <Text css={TextStyle}>{DongAddr ? nowJuso.dong : ''}</Text>
            <AddressCursorArrow
              openCursor={openCursor}
              setOpenCursor={setOpenCursor}
            />
          </Flex>
        ) : (
          <AddressArrow />
        )}
      </Flex>
    </>
  )
}

const ContainerStyle = css`
  display: inline-flex;
  height: 40px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  min-width: 120px;
`

const TextStyle = css`
  color: #000001;
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.16px;
`

export default TopAddress

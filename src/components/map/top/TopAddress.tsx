import { css } from '@emotion/react'
import AddressArrow from '../icons/AddressArrow'
import AddressCursorArrow from '../icons/AddressCursorArrow'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { useNavermaps } from 'react-naver-maps'
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'

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
  openCursor: boolean
  setOpenCursor: Dispatch<SetStateAction<boolean>>
  range: number
  setRange: Dispatch<SetStateAction<number>>
  juso: {
    sido: string
    gungu: string
    dong: string
  }
  setJuso: Dispatch<
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
  openCursor,
  setOpenCursor,
  range,
  setRange,
  juso,
  setJuso,
}: AddressProps) {
  const naverMaps = useNavermaps()
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
            const addrToList = result.jibunAddress.split(' ')
            setNowJuso({
              sido: addrToList[0],
              gungu: addrToList[1],
              dong: addrToList[2],
            })
          }
        },
      )
    }
  }, [center, naverMaps, setNowJuso])

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
            marginLeft: `${SidoAddr ? '10px' : '0px'}`,
            marginRight: `${SidoAddr ? '10px' : '0px'}`,
          }}
          onClick={() => {
            if (SidoAddr) {
              setRange(0)
              setOpenCursor(!openCursor)
              setJuso({
                sido: '',
                gungu: '',
                dong: '',
              })
            } else if (GunguAddr) {
              setRange(1)
              setOpenCursor(!openCursor)
              setJuso((prev) => {
                return {
                  ...prev,
                  gungu: '',
                  dong: '',
                }
              })
            } else if (DongAddr) {
              setRange(2)
              setOpenCursor(!openCursor)
              setJuso((prev) => {
                return {
                  ...prev,
                  dong: '',
                }
              })
            }
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
              minWidth: '100px',
              gap: '15px',
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
  min-width: 80px;
  max-width: 160px;
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

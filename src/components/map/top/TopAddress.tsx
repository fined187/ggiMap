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
  topJuso: {
    sido: string
    gungu: string
    dong: string
  }
  setTopJuso: Dispatch<
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
  bottomJuso: {
    sido: string
    gungu: string
    dong: string
  }
  setBottomJuso: Dispatch<
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
  topJuso,
  setTopJuso,
  openCursor,
  setOpenCursor,
  range,
  setRange,
  bottomJuso,
  setBottomJuso,
}: AddressProps) {
  const naverMaps = useNavermaps()
  const centerToAddr = useCallback(() => {
    if (naverMaps?.Service?.reverseGeocode !== undefined) {
      naverMaps?.Service?.reverseGeocode(
        {
          location: new naverMaps.LatLng({
            lat: center.lat,
            lng: center.lng,
          }) as any,
        },
        (status: any, response: any) => {
          console.log(response)
          if (status === naverMaps.Service.Status.ERROR) {
            alert('주소 혹은 지하철명을 입력해주세요')
          }
          const result = response.v2.address
          if (result.jibunAddress) {
            const addrToList = result.jibunAddress.split(' ')
            setTopJuso({
              sido: addrToList[0],
              gungu: addrToList[1],
              dong: addrToList[2],
            })
          }
        },
      )
    }
  }, [center, naverMaps, setTopJuso])

  useEffect(() => {
    centerToAddr()
  }, [center, centerToAddr])

  const handleTopBottomSync = () => {
    let newSido: string[] = []
    if (
      topJuso.sido.match(/시$/) ||
      topJuso.sido.match(/경기도$/) ||
      topJuso.sido.match(/강원특별자치도$/) ||
      topJuso.sido.match(/제주도$/)
    ) {
      newSido.push(topJuso.sido.slice(0, 2))
    } else if (topJuso.sido.match(/도$/)) {
      newSido.push(topJuso.sido.slice(0, 1) + topJuso.sido.slice(2, 3))
    }
    return newSido
  }
  useEffect(() => {
    handleTopBottomSync()
  }, [topJuso])
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
              setBottomJuso({
                sido: '',
                gungu: '',
                dong: '',
              })
            } else if (GunguAddr) {
              setRange(1)
              setOpenCursor(!openCursor)
              setBottomJuso((prev) => {
                return {
                  sido: prev.sido === '' ? handleTopBottomSync()[0] : prev.sido,
                  gungu: '',
                  dong: '',
                }
              })
            } else if (DongAddr) {
              setRange(2)
              setOpenCursor(!openCursor)
              setBottomJuso((prev) => {
                return {
                  ...prev,
                  dong: '',
                }
              })
            }
          }}
        >
          <Text css={TextStyle}>
            {SidoAddr ? topJuso.sido : GunguAddr ? topJuso.gungu : ''}
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
              gap: DongAddr
                ? topJuso.dong.length > 3
                  ? '10px'
                  : topJuso.dong.length > 4
                  ? '5px'
                  : '15px'
                : '0px',
            }}
          >
            <Text css={TextStyle}>{DongAddr ? topJuso.dong : ''}</Text>
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

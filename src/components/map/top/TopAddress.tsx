/* eslint-disable react-hooks/rules-of-hooks */
import { css } from '@emotion/react'
import AddressArrow from '../icons/AddressArrow'
import AddressCursorArrow from '../icons/AddressCursorArrow'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import useSWR from 'swr'
import { MAP_KEY } from '../sections/hooks/useMap'

declare global {
  interface Window {
    naver: any
  }
}
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
  const { data: map } = useSWR(MAP_KEY)
  const [getGungu, setGetGungu] = useState<string[]>([])
  function searchCoordinateToAddress(lat: number, lng: number) {
    if (window.naver.maps?.Service?.geocode !== undefined) {
      window.naver.maps?.Service?.reverseGeocode(
        {
          location: new window.naver.maps.LatLng(lat, lng),
        },
        (status: any, response: any) => {
          if (status === window.naver.maps?.Service?.Status?.ERROR) {
            alert('주소를 찾을 수 없습니다.')
            return
          }
          const result = response.result.items[0].addrdetail
          setTopJuso({
            sido: result.sido,
            gungu: result.sigugun.split(' ')[0],
            dong: result.dongmyun,
          })
          setGetGungu(result.sigugun.split(' ')[1])
        },
      )
    }
  }

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

  const handleTopBottomSyncGungu = () => {
    if (!topJuso.gungu) return []
    let newGungu = []
    if (
      topJuso.gungu.slice(topJuso.gungu.length - 1, topJuso.gungu.length) ===
      '시'
    ) {
      newGungu.push(topJuso.gungu + ' ' + getGungu)
      return newGungu
    }
    newGungu.push(topJuso.gungu)
    return newGungu
  }

  const handleControlTopBar = () => {
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
          ...prev,
          sido: handleTopBottomSync()[0],
          gungu: '',
          dong: '',
        }
      })
    } else {
      setRange(2)
      setOpenCursor(!openCursor)
      setBottomJuso({
        sido: handleTopBottomSync()[0],
        gungu: handleTopBottomSyncGungu()[0] as string,
        dong: '',
      })
    }
  }
  useEffect(() => {
    if (map) {
      const mapCenter = map.getCenter()
      const center: { lat: number; lng: number } = {
        lat: mapCenter.lat(),
        lng: mapCenter.lng(),
      }
      searchCoordinateToAddress(center.lat, center.lng)
    }
  }, [map && map.center])

  if (!map) return null
  return (
    <>
      <Flex css={ContainerStyle}>
        <Flex
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            width: '100%',
            padding: '0 5px',
            marginLeft: '5px',
          }}
          onClick={() => {
            handleControlTopBar()
          }}
        >
          <Text css={TextStyle}>
            {SidoAddr ? topJuso.sido : GunguAddr ? topJuso.gungu : ''}
          </Text>
        </Flex>
        {isEnd ? (
          <Flex
            css={ContainerStyle}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Text
              css={TextStyle}
              onClick={() => {
                setOpenCursor(!openCursor)
                handleControlTopBar()
              }}
            >
              {DongAddr ? topJuso.dong : ''}
            </Text>
            <AddressCursorArrow
              openCursor={openCursor}
              setOpenCursor={setOpenCursor}
              setBottomJuso={setBottomJuso}
              setRange={setRange}
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

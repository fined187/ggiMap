import { css } from '@emotion/react'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import NextArrow from '../icons/NextArrow'
import SidoList from './DetailAddrList/SidoList'
import GunguList from './DetailAddrList/GunguList'
import dynamic from 'next/dynamic'
import getSubway from '@/remote/map/subway/getSubway'
import DongList from './DetailAddrList/DongList'
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import Spacing from '@/components/shared/Spacing'
import useSWR from 'swr'
import { MAP_KEY } from '../sections/hooks/useMap'

interface BottomAddressProps {
  center?: {
    lat: number
    lng: number
  }
  setCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>
  zoom: number
  setZoom: Dispatch<SetStateAction<number>>
  range: number
  setRange: Dispatch<SetStateAction<number>>
  setOpenCursor?: Dispatch<SetStateAction<boolean>>
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
  openCursor?: boolean
}

function BottomAddress({
  setCenter,
  zoom,
  setZoom,
  range,
  setRange,
  setOpenCursor,
  topJuso,
  setTopJuso,
  bottomJuso,
  setBottomJuso,
  openCursor,
  center,
}: BottomAddressProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedGunguIndex, setSelectedGunguIndex] = useState<number | null>(
    null,
  )
  const [selectedDongIndex, setSelectedDongIndex] = useState<number | null>(
    null,
  )
  const searchAddrToCoord = useCallback(
    (address: string) => {
      if (window.naver.maps?.Service?.geocode !== undefined) {
        window.naver.maps?.Service?.geocode(
          {
            query: address,
          },
          (status: any, response: any) => {
            if (status === window.naver.maps?.Service?.Status?.ERROR) {
              alert('지하철 혹은 주소를 입력해주세요')
              return
            }
            const result = response.v2.addresses[0]
            const { x, y } = result ?? { point: { x: 0, y: 0 } }
            map.setCenter({
              lat: Number(y),
              lng: Number(x),
            })
          },
        )
      }
    },
    [map.center, setCenter],
  )

  const addrToCenter = async (addr: string) => {
    if (range === 1 && bottomJuso.sido !== '' && bottomJuso.gungu !== '') {
      try {
        const response = await getSubway(bottomJuso.sido + addr + '청')
        if (response.documents.length === 0) {
          return
        } else {
          const { x, y } = response.documents[0]
          map.setCenter({
            lat: Number(y),
            lng: Number(x),
          })
        }
      } catch (error) {
        console.error(error)
      }
    } else if (range === 2 && bottomJuso.gungu !== '') {
      searchAddrToCoord(addr)
    }
  }

  return (
    <Flex direction="column" css={ContainerStyle}>
      <Flex
        direction="row"
        style={{
          height: '20px',
          width: '100%',
          justifyContent: 'start',
          alignItems: 'start',
          display: 'flex',
        }}
      >
        <Text
          css={TextStyle}
          style={{
            color:
              range === 0 || bottomJuso.sido !== '' || topJuso.sido !== ''
                ? '#000001'
                : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            setRange(0)
          }}
        >
          {bottomJuso.sido === '' ? '시 / 도' : bottomJuso.sido}
        </Text>
        <NextArrow />
        <Text
          css={TextStyle}
          style={{
            color: bottomJuso.gungu !== '' ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (bottomJuso.sido === '') {
              alert('시 / 도를 먼저 선택해주세요.')
              return
            }
            setRange(1)
          }}
        >
          {bottomJuso.gungu === '' ? '시 / 군 / 구' : bottomJuso.gungu}
        </Text>
        <NextArrow />
        <Text
          css={TextStyle}
          style={{
            color: bottomJuso.dong !== '' ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (bottomJuso.gungu === '' || selectedGunguIndex === null) {
              alert('시 / 군 / 구를 먼저 선택해주세요.')
              return
            }
            setRange(2)
          }}
        >
          {bottomJuso.dong === '' ? '읍 / 면 / 동' : bottomJuso.dong}
        </Text>
      </Flex>
      <Spacing size={20} />
      {range === 0 && (
        <SidoList
          bottomJuso={bottomJuso}
          setBottomJuso={setBottomJuso}
          range={range}
          setRange={setRange}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
      {range === 1 && (
        <GunguList
          bottomJuso={bottomJuso}
          setBottomJuso={setBottomJuso}
          range={range}
          setRange={setRange}
          selectedGunguIndex={selectedGunguIndex}
          setSelectedGunguIndex={setSelectedGunguIndex}
          addrToCenter={addrToCenter}
        />
      )}
      {range === 2 && (
        <DongList
          bottomJuso={bottomJuso}
          setBottomJuso={setBottomJuso}
          selectedDongIndex={selectedDongIndex}
          setSelectedDongIndex={setSelectedDongIndex}
          addrToCenter={addrToCenter}
        />
      )}
    </Flex>
  )
}

const ContainerStyle = css`
  background-color: #fff;
  width: 360px;
  max-height: 400px;
  display: flex;
  left: calc(50% + 100px);
  transform: translateX(-50%);
  top: 75px;
  position: absolute;
  border-radius: 10px;
  padding: 10px;
  align-items: start;
  z-index: 100;
`

const TextStyle = css`
  text-align: center;
  min-width: 100px;
  max-width: 120px;
  font-family: SUIT;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.15px;
`

export default BottomAddress

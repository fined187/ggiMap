import { css } from '@emotion/react'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import NextArrow from '../icons/NextArrow'
import SidoList from './DetailAddrList/SidoList'
import GunguList from './DetailAddrList/GunguList'
import dynamic from 'next/dynamic'
import getSubway from '@/remote/map/subway/getSubway'
import DongList from './DetailAddrList/DongList'
import { useMap, useNavermaps } from 'react-naver-maps'
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import Spacing from '@/components/shared/Spacing'

const FixedInBoxButton = dynamic(
  () => import('@/components/shared/FixedInBoxButton'),
)

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
  center,
}: BottomAddressProps) {
  const naverMaps = useNavermaps()

  const searchAddrToCoord = useCallback(
    (address: string) => {
      if (naverMaps?.Service?.geocode !== undefined) {
        naverMaps?.Service?.geocode(
          {
            address,
          },
          (status: any, response: any) => {
            console.log(response)
            if (status === naverMaps?.Service?.Status?.ERROR) {
              alert('지하철 혹은 주소를 입력해주세요')
              return
            }
            const result = response.result.items[0]
            const { point } = result ?? { point: { x: 0, y: 0 } }
            const { x, y } = point
            setCenter({
              lat: Number(y),
              lng: Number(x),
            })
          },
        )
      }
    },
    [naverMaps, setCenter],
  )

  const addrToCenter = async (addr: string) => {
    if (
      range >= 1 &&
      bottomJuso.sido !== '' &&
      bottomJuso.gungu !== '' &&
      bottomJuso.dong === ''
    ) {
      try {
        const response = await getSubway(bottomJuso.sido + addr + '청')
        if (response.documents.length === 0) {
          return
        } else {
          const { x, y } = response.documents[0]
          setCenter({
            lat: Number(y),
            lng: Number(x),
          })
        }
      } catch (error) {
        console.error(error)
      }
    } else if (range === 2 && bottomJuso.gungu !== '') {
      searchAddrToCoord(bottomJuso.sido + addr)
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
            color:
              bottomJuso.gungu !== '' || topJuso.gungu !== ''
                ? '#000001'
                : '#9d9999',
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
            color:
              bottomJuso.dong !== '' || topJuso.dong !== ''
                ? '#000001'
                : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (bottomJuso.gungu === '') {
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
        />
      )}
      {range === 1 && (
        <GunguList
          bottomJuso={bottomJuso}
          setBottomJuso={setBottomJuso}
          range={range}
          setRange={setRange}
        />
      )}
      {range === 2 && (
        <DongList bottomJuso={bottomJuso} setBottomJuso={setBottomJuso} />
      )}
      {bottomJuso.gungu !== '' && bottomJuso.dong === '' && (
        <>
          <Spacing direction="vertical" size={50} />
          <FixedInBoxButton
            label={`${bottomJuso.gungu} 지도 보기`}
            onClick={() => {
              addrToCenter(bottomJuso.gungu)
              setZoom(14)
              setOpenCursor && setOpenCursor(false)
            }}
          />
        </>
      )}
      {bottomJuso.dong !== '' && (
        <>
          <Spacing direction="vertical" size={50} />
          <FixedInBoxButton
            label={`${bottomJuso.dong} 지도 보기`}
            onClick={() => {
              addrToCenter(bottomJuso.gungu + bottomJuso.dong)
              setZoom(17)
              setOpenCursor && setOpenCursor(false)
            }}
          />
        </>
      )}
    </Flex>
  )
}
//  24a10950974a42238f83 892966514bba4216a627

//  ab7a0fbd-9d5a-49b0-b56f-f5d6b51859e5
const ContainerStyle = css`
  background-color: #fff;
  width: 360px;
  max-height: 400px;
  display: flex;
  left: calc(50% + 180px);
  transform: translateX(-50%);
  top: 75px;
  position: absolute;
  border-radius: 10px;
  padding: 10px;
  align-items: center;
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

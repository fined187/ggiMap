import { css } from '@emotion/react'
import { Dispatch, SetStateAction, useState } from 'react'
import NextArrow from '../icons/NextArrow'
import SidoList from './DetailAddrList/SidoList'
import GunguList from './DetailAddrList/GunguList'
import dynamic from 'next/dynamic'
import getSubway from '@/remote/map/subway/getSubway'
import DongList from './DetailAddrList/DongList'
import { useMap } from 'react-naver-maps'
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

function BottomAddress({
  setCenter,
  zoom,
  setZoom,
  range,
  setRange,
  setOpenCursor,
  nowJuso,
  setNowJuso,
  juso,
  setJuso,
}: BottomAddressProps) {
  const map = useMap()

  const addrToCenter = async (addr: string) => {
    if (range === 1) {
      try {
        const response = await getSubway(juso.sido + addr + '청')
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
    } else {
      try {
        const response = await getSubway(addr)
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
              range === 0 || juso.sido !== '' || nowJuso.sido !== ''
                ? '#000001'
                : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            setRange(0)
          }}
        >
          {juso.sido === '' ? '시 / 도' : juso.sido}
        </Text>
        <NextArrow />
        <Text
          css={TextStyle}
          style={{
            color:
              juso.gungu !== '' || nowJuso.gungu !== '' ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (juso.sido === '') {
              alert('시 / 도를 먼저 선택해주세요.')
              return
            }
            setRange(1)
          }}
        >
          {juso.gungu === '' ? '시 / 군 / 구' : juso.gungu}
        </Text>
        <NextArrow />
        <Text
          css={TextStyle}
          style={{
            color:
              juso.dong !== '' || nowJuso.dong !== '' ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (juso.gungu === '') {
              alert('시 / 군 / 구를 먼저 선택해주세요.')
              return
            }
            setRange(2)
          }}
        >
          {juso.dong === '' ? '읍 / 면 / 동' : juso.dong}
        </Text>
      </Flex>
      <Spacing size={20} />
      {range === 0 && (
        <SidoList
          juso={juso}
          setJuso={setJuso}
          range={range}
          setRange={setRange}
        />
      )}
      {range === 1 && (
        <GunguList
          juso={juso}
          setJuso={setJuso}
          range={range}
          setRange={setRange}
        />
      )}
      {range === 2 && <DongList juso={juso} setJuso={setJuso} />}
      {juso.gungu !== '' && juso.dong === '' && (
        <>
          <Spacing direction="vertical" size={50} />
          <FixedInBoxButton
            label={`${juso.gungu} 지도 보기`}
            onClick={() => {
              addrToCenter(juso.gungu)
              setZoom(14)
              setOpenCursor && setOpenCursor(false)
            }}
          />
        </>
      )}
      {juso.dong !== '' && (
        <>
          <Spacing direction="vertical" size={50} />
          <FixedInBoxButton
            label={`${juso.dong} 지도 보기`}
            onClick={() => {
              addrToCenter(juso.gungu + juso.dong)
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

import { css } from '@emotion/react'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import NextArrow from '../icons/NextArrow'
import SidoList from './DetailAddrList/SidoList'
import GunguList from './DetailAddrList/GunguList'
import DongList from './DetailAddrList/DongList'
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import Spacing from '@/components/shared/Spacing'
import useSWR from 'swr'
import { MAP_KEY } from '../sections/hooks/useMap'
import { useRecoilState } from 'recoil'
import { jusoAtom } from '@/store/atom/map'

interface BottomAddressProps {
  range: number
  setRange: Dispatch<SetStateAction<number>>
}

function BottomAddress({ range, setRange }: BottomAddressProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [juso, setJuso] = useRecoilState(jusoAtom)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedGunguIndex, setSelectedGunguIndex] = useState<number | null>(
    null,
  )
  const [selectedDongIndex, setSelectedDongIndex] = useState<number | null>(
    null,
  )

  const addrToCenter = useCallback(
    async (x: number, y: number) => {
      if (map) {
        map.setCenter({
          lat: y,
          lng: x,
        })
      }
    },
    [map],
  )
  console.log(juso)
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
              range === 0 || juso.bottomSido !== '' || juso.topSido !== ''
                ? '#000001'
                : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            setRange(0)
          }}
        >
          {juso.bottomSido === '' ? '시 / 도' : juso.bottomSido}
        </Text>
        <NextArrow />
        <Text
          css={TextStyle}
          style={{
            color: juso.bottomGungu !== '' ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (juso.bottomSido === '') {
              alert('시 / 도를 먼저 선택해주세요.')
              return
            }
            setRange(1)
          }}
        >
          {juso.bottomGungu === '' ? '시 / 군 / 구' : juso.bottomGungu}
        </Text>
        <NextArrow />
        <Text
          css={TextStyle}
          style={{
            color: juso.bottomDong !== '' ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (juso.bottomGungu === '') {
              alert('시 / 군 / 구를 먼저 선택해주세요.')
              return
            }
            setRange(2)
          }}
        >
          {juso.bottomDong === '' ? '읍 / 면 / 동' : juso.bottomDong}
        </Text>
      </Flex>
      <Spacing size={20} />
      {range === 0 && (
        <SidoList
          setRange={setRange}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          addrToCenter={addrToCenter}
        />
      )}
      {range === 1 && (
        <GunguList
          setRange={setRange}
          selectedGunguIndex={selectedGunguIndex}
          setSelectedGunguIndex={setSelectedGunguIndex}
          addrToCenter={addrToCenter}
        />
      )}
      {range === 2 && (
        <DongList
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

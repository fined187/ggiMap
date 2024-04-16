import { css } from '@emotion/react'
import Flex from '../shared/Flex'
import { useState } from 'react'
import Text from '../shared/Text'
import NextArrow from '../icons/NextArrow'
import Spacing from '../shared/Spacing'
import SidoList from './DetailAddrList/SidoList'
import GunguList from './DetailAddrList/GunguList'
import dynamic from 'next/dynamic'

function BottomAddress() {
  const [range, setRange] = useState(0)
  const [juso, setJuso] = useState({
    sido: '',
    gungu: '',
    dong: '',
  })
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
            color: juso.sido !== '' ? '#000001' : '#9d9999',
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
            color: juso.gungu !== '' ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            setRange(1)
          }}
        >
          {juso.gungu === '' ? '시/군/구' : juso.gungu}
        </Text>
        <NextArrow />
        <Text
          css={TextStyle}
          style={{
            color: range === 2 ? '#000001' : '#9d9999',
            cursor: 'pointer',
          }}
          onClick={() => {
            setRange(2)
          }}
        >
          {'읍/면/동'}
        </Text>
      </Flex>
      <Spacing size={20} />
      {range === 0 && <SidoList juso={juso} setJuso={setJuso} />}
      {range === 1 && <GunguList juso={juso} setJuso={setJuso} />}
    </Flex>
  )
}

const ContainerStyle = css`
  background-color: #fff;
  width: 350px;
  height: 300px;
  display: flex;
  left: calc(50% + 180px);
  transform: translateX(-50%);
  top: 80px;
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

import { css } from '@emotion/react'
import Flex from '../shared/Flex'
import Text from '../shared/Text'
import AddressArrow from '../icons/AddressArrow'
import AddressCursorArrow from '../icons/AddressCursorArrow'
import { useState } from 'react'
import getAddress from '@/remote/address/getAddress'

interface AddressProps {
  SidoAddr?: string
  GunguAddr?: string
  DongAddr?: string
  isEnd: boolean
}

function TopAddress({ SidoAddr, GunguAddr, DongAddr, isEnd }: AddressProps) {
  const [openCursor, setOpenCursor] = useState(false)
  getAddress('서울특별시')
  return (
    <Flex css={ContainerStyle}>
      <Flex
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <Text css={TextStyle}>
          {SidoAddr ? SidoAddr : GunguAddr ? GunguAddr : null}
        </Text>
      </Flex>
      {isEnd ? (
        <Flex
          onClick={() => {
            setOpenCursor(!openCursor)
          }}
        >
          <Text css={TextStyle}>{DongAddr}</Text>
          <AddressCursorArrow
            openCursor={openCursor}
            setOpenCursor={setOpenCursor}
          />
        </Flex>
      ) : (
        <AddressArrow />
      )}
    </Flex>
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

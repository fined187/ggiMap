/* eslint-disable react-hooks/rules-of-hooks */
import { css } from '@emotion/react'
import AddressArrow from '../icons/AddressArrow'
import AddressCursorArrow from '../icons/AddressCursorArrow'
import { Dispatch, SetStateAction, useCallback } from 'react'
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import useSWR from 'swr'
import { MAP_KEY } from '../sections/hooks/useMap'

declare global {
  interface Window {
    naver: any
  }
}
type jusoProps = {
  sido: string
  gungu: string
  dong: string
}
interface AddressProps {
  SidoAddr: boolean
  GunguAddr: boolean
  DongAddr: boolean
  isEnd: boolean
  topJuso: jusoProps
  setTopJuso: Dispatch<SetStateAction<jusoProps>>
  openCursor: boolean
  setOpenCursor: Dispatch<SetStateAction<boolean>>
  range: number
  setRange: Dispatch<SetStateAction<number>>
  setBottomJuso: Dispatch<
    SetStateAction<{
      sido: string
      gungu: string
      dong: string
    }>
  >
  getGungu: string
}

function TopAddress({
  SidoAddr,
  GunguAddr,
  DongAddr,
  isEnd,
  topJuso,
  setTopJuso,
  openCursor,
  setOpenCursor,
  setRange,
  setBottomJuso,
  getGungu,
}: AddressProps) {
  const { data: map } = useSWR(MAP_KEY)
  const handleTopBottomSyncSido = useCallback(() => {
    let newSido = ''
    if (
      topJuso.sido.match(/시$/) ||
      [
        '경기도',
        '강원특별자치도',
        '제주도',
        '제주특별자치도',
        '전북특별자치도',
      ].includes(topJuso.sido)
    ) {
      newSido = topJuso.sido.slice(0, 2)
    } else if (topJuso.sido.endsWith('도')) {
      newSido = topJuso.sido.slice(0, 1) + topJuso.sido.slice(2, 3)
    } else if (topJuso.sido === '세종특별자치시') {
      newSido = '세종'
      setTopJuso((prev) => {
        return {
          ...prev,
          sido: '세종시',
        }
      })
    }
    return newSido
  }, [topJuso.sido, setTopJuso])

  const handleTopBottomSyncGungu = useCallback(() => {
    let newGungu = ''
    if (!topJuso.gungu) return []
    if (topJuso.gungu.endsWith('시') && getGungu.endsWith('구')) {
      newGungu = topJuso.gungu + ' ' + getGungu
    } else {
      newGungu = topJuso.gungu
    }
    return newGungu
  }, [topJuso.gungu, getGungu])

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
      setBottomJuso({
        sido: handleTopBottomSyncSido(),
        gungu: '',
        dong: '',
      })
    } else {
      setRange(2)
      setOpenCursor(!openCursor)
      setBottomJuso({
        sido: handleTopBottomSyncSido(),
        gungu: handleTopBottomSyncGungu() as string,
        dong: '',
      })
    }
  }

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

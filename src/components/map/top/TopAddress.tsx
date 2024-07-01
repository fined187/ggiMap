/* eslint-disable react-hooks/rules-of-hooks */
import { css } from '@emotion/react'
import AddressArrow from '../icons/AddressArrow'
import AddressCursorArrow from '../icons/AddressCursorArrow'
import { Dispatch, SetStateAction, useCallback } from 'react'
import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import useSWR from 'swr'
import { MAP_KEY } from '../sections/hooks/useMap'
import { jusoProps } from '@/models/Juso'
import { useRecoilState } from 'recoil'
import { jusoAtom } from '@/store/atom/map'

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
  openCursor: boolean
  setOpenCursor: Dispatch<SetStateAction<boolean>>
  range: number
  setRange: Dispatch<SetStateAction<number>>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  openOverlay: boolean
}

function TopAddress({
  SidoAddr,
  GunguAddr,
  DongAddr,
  isEnd,
  openCursor,
  setOpenCursor,
  setRange,
  setOpenOverlay,
  openOverlay,
}: AddressProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [juso, setJuso] = useRecoilState<jusoProps>(jusoAtom)
  const handleTopBottomSyncSido = useCallback(() => {
    let newSido = ''
    if (
      juso.topSido.match(/시$/) ||
      [
        '경기도',
        '강원특별자치도',
        '제주도',
        '제주특별자치도',
        '전북특별자치도',
      ].includes(juso.topSido)
    ) {
      newSido = juso.topSido.slice(0, 2)
    } else if (juso.topSido.endsWith('도')) {
      newSido = juso.topSido.slice(0, 1) + juso.topSido.slice(2, 3)
    } else if (juso.topSido === '세종특별자치시') {
      newSido = '세종'
      setJuso((prev) => {
        return {
          ...prev,
          sido: '세종시',
        }
      })
    }
    return newSido
  }, [juso.topSido, setJuso])

  const handleTopBottomSyncGungu = useCallback(() => {
    let newGungu = ''
    if (!juso.topGungu) return []
    if (juso.topGungu.endsWith('시') && juso.topGungu.endsWith('구')) {
      newGungu = juso.topGungu + ' ' + juso.topGungu
    } else {
      newGungu = juso.topGungu
    }
    return newGungu
  }, [juso.topGungu, juso.topGungu])

  const handleControlTopBar = () => {
    if (SidoAddr) {
      setRange(0)
      setOpenCursor(!openCursor)
      setJuso((prev) => {
        return {
          ...prev,
          bottomSido: '',
          bottomGungu: '',
          bottomDong: '',
        }
      })
    } else if (GunguAddr) {
      setRange(1)
      setOpenCursor(!openCursor)
      setJuso((prev) => {
        return {
          ...prev,
          bottomSido: handleTopBottomSyncSido() as string,
          bottomGungu: '',
          bottomDong: '',
        }
      })
    } else {
      setRange(2)
      setOpenCursor(!openCursor)
      setJuso((prev) => {
        return {
          ...prev,
          bottomSido: handleTopBottomSyncSido() as string,
          bottomGungu: handleTopBottomSyncGungu() as string,
          bottomDong: '',
        }
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
            setOpenOverlay(false)
            handleControlTopBar()
          }}
        >
          <Text css={TextStyle}>
            {SidoAddr ? juso.topSido : GunguAddr ? juso.topGungu : ''}
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
            onClick={() => {
              setOpenOverlay(false)
            }}
          >
            <Text
              css={TextStyle}
              onClick={() => {
                setOpenCursor(!openCursor)
                handleControlTopBar()
              }}
            >
              {DongAddr ? juso.topDong : ''}
            </Text>
            <AddressCursorArrow
              openCursor={openCursor}
              setOpenCursor={setOpenCursor}
              setRange={setRange}
              setJuso={setJuso}
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

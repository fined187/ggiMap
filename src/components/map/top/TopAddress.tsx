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
import { useRecoilState, useRecoilValue } from 'recoil'
import { jusoAtom } from '@/store/atom/map'
import { authInfo } from '@/store/atom/auth'
import { UseQueryResult, useQuery } from 'react-query'
import { NaverMap } from '@/models/Map'

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
}: AddressProps) {
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })
  const [juso, setJuso] = useRecoilState<jusoProps>(jusoAtom)
  const auth = useRecoilValue(authInfo)
  const handleTopBottomSyncSido = useCallback(() => {
    const specialSido = [
      '경기도',
      '강원특별자치도',
      '제주도',
      '제주특별자치도',
      '전북특별자치도',
      '세종특별자치시',
    ]
    let newSido = ''

    if (juso.topSido.match(/시$/) || specialSido.includes(juso.topSido)) {
      newSido = juso.topSido.slice(0, 2)
    } else if (juso.topSido.endsWith('도')) {
      newSido = juso.topSido[0] + juso.topSido[2]
    } else if (juso.topSido === '세종특별자치시') {
      newSido = '세종'
      setJuso((prev) => ({
        ...prev,
        sido: '세종시',
      }))
    }
    return newSido
  }, [juso.topSido, setJuso])

  const handleTopBottomSyncGungu = useCallback(() => {
    if (!juso.topGungu) return ''
    return juso.topGungu.endsWith('시') && juso.topGungu.endsWith('구')
      ? `${juso.topGungu} ${juso.topGungu}`
      : juso.topGungu
  }, [juso.topGungu])

  const handleControlTopBar = useCallback(() => {
    const newJuso = { bottomSido: '', bottomGungu: '', bottomDong: '' }
    if (auth.role.includes('ROLE_ANONYMOUS' || 'ROLE_FREE')) return
    switch (true) {
      case SidoAddr:
        setRange(0)
        setOpenCursor(!openCursor)
        setJuso((prev) => ({
          ...prev,
          ...newJuso,
        }))
        break
      case GunguAddr:
        setRange(1)
        setOpenCursor(!openCursor)
        setJuso((prev) => ({
          ...prev,
          ...newJuso,
          bottomSido: handleTopBottomSyncSido(),
        }))
        break
      case DongAddr:
        setRange(2)
        setOpenCursor(!openCursor)
        setJuso((prev) => ({
          ...prev,
          ...newJuso,
          bottomSido: handleTopBottomSyncSido(),
          bottomGungu: handleTopBottomSyncGungu(),
        }))
        break
    }
  }, [
    SidoAddr,
    GunguAddr,
    openCursor,
    setRange,
    setOpenCursor,
    setJuso,
    handleTopBottomSyncSido,
    handleTopBottomSyncGungu,
  ])
  if (!map) return null
  return (
    <>
      <Flex css={ContainerStyle}>
        <Flex
          css={innerContainerStyle}
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
              gap: '5px',
            }}
            onClick={() => {
              setOpenOverlay(false)
            }}
          >
            <Text
              css={TextStyle}
              onClick={() => {
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

const innerContainerStyle = css`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  padding: 0 5px;
  margin-left: 5px;
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

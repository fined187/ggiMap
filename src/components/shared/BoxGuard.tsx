import { css } from '@emotion/react'
import Flex from './Flex'
import { UseQueryResult, useQuery } from 'react-query'
import { NaverMap } from '@/models/Map'
import { MAP_KEY } from '../map/sections/hooks/useMap'
import { useCallback } from 'react'

export default function BoxGuard({
  children,
  isOpen,
}: {
  children: React.ReactNode
  isOpen: boolean
}) {
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })

  const handleCalcHeight = useCallback(() => {
    if (isOpen) {
      if (map && map.getZoom() >= 15) {
        return '98%'
      }
      if (map && map.getZoom() < 15) {
        return ''
      }
    }
    return ''
  }, [isOpen, map])

  return (
    <Flex
      justify="start"
      align="center"
      direction="column"
      css={ContainerStyle}
      style={{
        height: handleCalcHeight(),
        gap: map && map.getZoom() < 15 ? '10px' : isOpen ? '0px' : '10px',
      }}
    >
      {children}
    </Flex>
  )
}

const ContainerStyle = css`
  top: 1%;
  left: 1%;
  z-index: 10;
  background-color: none;
  position: fixed;
`

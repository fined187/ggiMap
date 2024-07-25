import { css } from '@emotion/react'
import Flex from './Flex'
import { UseQueryResult, useQuery } from 'react-query'
import { NaverMap } from '@/models/Map'
import { MAP_KEY } from '../map/sections/hooks/useMap'
import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { mapListAtom } from '@/store/atom/map'

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
  const mapListItems = useRecoilValue(mapListAtom)
  const handleCalcHeight = useCallback(() => {
    if (isOpen) {
      if (map && map.getZoom() >= 15) {
        if (mapListItems?.contents?.length === 0) {
          return ''
        }
        return '98%'
      }
      if (map && map.getZoom() < 15) {
        return ''
      }
    }
    return ''
  }, [isOpen, map, mapListItems])

  return (
    <Flex
      justify="start"
      align="center"
      direction="column"
      css={ContainerStyle}
      style={{
        height: handleCalcHeight(),
        gap:
          (map && map.getZoom() < 15) ||
          mapListItems?.contents?.length === 0 ||
          !isOpen
            ? '19px'
            : '10px',
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

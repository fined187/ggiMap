import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Dispatch, SetStateAction, useCallback } from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'

interface MapTypeProps {
  clickedMapType: {
    basic: boolean
    terrain: boolean
    satellite: boolean
    cadastral: boolean
    interest: boolean
    roadView: boolean
    current: boolean
    distance: boolean
    area: boolean
  }
  setClickedMapType: Dispatch<
    SetStateAction<{
      basic: boolean
      terrain: boolean
      satellite: boolean
      cadastral: boolean
      interest: boolean
      roadView: boolean
      current: boolean
      distance: boolean
      area: boolean
    }>
  >
}

export default function MapType({
  clickedMapType,
  setClickedMapType,
}: MapTypeProps) {
  const { data: map } = useSWR(MAP_KEY)
  const handleMapTypeChange = useCallback(
    (type: string) => {
      if (type === 'basic') {
        setClickedMapType((prev) => {
          return {
            ...prev,
            basic: true,
            terrain: false,
            satellite: false,
            cadastral: false,
          }
        })
        map?.setMapTypeId(window.naver.maps?.MapTypeId.NORMAL)
      }
      if (type === 'terrain') {
        setClickedMapType((prev) => {
          return {
            ...prev,
            basic: false,
            terrain: true,
            satellite: false,
            cadastral: false,
          }
        })
        map?.setMapTypeId(window.naver.maps?.MapTypeId.TERRAIN)
      }
      if (type === 'satellite') {
        setClickedMapType((prev) => {
          return {
            ...prev,
            basic: false,
            terrain: false,
            satellite: true,
            cadastral: false,
          }
        })
        map?.setMapTypeId(window.naver.maps?.MapTypeId.HYBRID)
      }
    },
    [map, setClickedMapType],
  )
  return (
    <Flex css={ContainerStyle}>
      <MapTypeBox
        mapType={clickedMapType.basic}
        onClick={() => {
          handleMapTypeChange('basic')
        }}
      >
        <TextStyle mapType={clickedMapType.basic}>기본지도</TextStyle>
      </MapTypeBox>
      <MapTypeBox
        mapType={clickedMapType.terrain}
        onClick={() => {
          handleMapTypeChange('terrain')
        }}
      >
        <TextStyle mapType={clickedMapType.terrain}>지형도</TextStyle>
      </MapTypeBox>
      <MapTypeBox
        mapType={clickedMapType.satellite}
        onClick={() => {
          handleMapTypeChange('satellite')
        }}
      >
        <TextStyle mapType={clickedMapType.satellite}>위성지도</TextStyle>
      </MapTypeBox>
    </Flex>
  )
}

const ContainerStyle = css`
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  width: 150px;
  height: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: #fbfbfb;
  flex-direction: row;
`

const MapTypeBox = styled.div<{
  mapType: boolean
}>`
  background: ${({ mapType }) => (mapType ? '#F0F0FF' : 'white')};
  border: ${({ mapType }) =>
    mapType ? '1px solid #332EFC' : '1px solid #333333'};
  width: 50px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const TextStyle = styled.span<{ mapType: boolean }>`
  color: ${({ mapType }) => (mapType ? '#332EFC' : '#333333')};
  text-align: center;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.11px;
`

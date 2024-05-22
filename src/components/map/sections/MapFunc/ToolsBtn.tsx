import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Dispatch, SetStateAction } from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { Measure } from './Measure'

declare global {
  interface Window {
    naver: any
  }
}

interface ToolsBtnProps {
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

export default function ToolsBtn({
  clickedMapType,
  setClickedMapType,
}: ToolsBtnProps) {
  const { data: map } = useSWR(MAP_KEY)

  return (
    <Measure
      clickedMapType={clickedMapType}
      setClickedMapType={setClickedMapType}
    />
  )
}

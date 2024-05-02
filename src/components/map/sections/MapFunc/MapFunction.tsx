import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'
import InterestBtn from './InterestBtn'
import CadastralBtn from './CadastralBtn'

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

export default function MapFunction({
  clickedMapType,
  setClickedMapType,
}: MapTypeProps) {
  return (
    <Flex css={ContainerStyle}>
      <InterestBtn
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      />
      <CadastralBtn
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  width: 45px;
  height: 330px;
  background-color: white;
  flex-direction: column;
  position: absolute;
  top: 20%;
  right: 20px;
  gap: 5px;
`

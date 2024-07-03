import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'
import InterestBtn from './InterestBtn'
import CadastralBtn from './CadastralBtn'
import RoadviewBtn from './RoadviewBtn'
import CurrentBtn from './CurrentBtn'
import ToolsBtn from './ToolsBtn'

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
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
}

export default function MapFunction({
  clickedMapType,
  setClickedMapType,
  setOpenOverlay,
}: MapTypeProps) {
  return (
    <Flex
      css={ContainerStyle}
      onClick={() => {
        setOpenOverlay(false)
      }}
    >
      <InterestBtn
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      />
      <CadastralBtn
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      />
      <RoadviewBtn
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      />
      <CurrentBtn />
      {/* <ToolsBtn
        clickedMapType={clickedMapType}
        setClickedMapType={setClickedMapType}
      /> */}
    </Flex>
  )
}

const ContainerStyle = css`
  width: 45px;
  height: 330px;
  flex-direction: column;
  position: absolute;
  top: 20%;
  right: 20px;
  gap: 5px;
`

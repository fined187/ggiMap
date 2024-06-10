/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Top from './Top'
import Bottom from './Bottom'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
import { useRecoilState } from 'recoil'
import { mapItemOriginAtom, markerPositionAtom } from '@/store/atom/map'
import { useGetDetail } from './hooks/useGetDetail'

type PositionSet = {
  top: number
  left: number
  right: number
  bottom: number
}
interface OverlayProps {
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  openOverlay: boolean
  style: any
  setIncludeWinYn: Dispatch<SetStateAction<boolean>>
  positionSet: PositionSet
  setPositionSet: Dispatch<SetStateAction<PositionSet>>
}

export default function Overlay({
  clickedItem,
  setClickedItem,
  style,
  setIncludeWinYn,
  positionSet,
  setPositionSet,
}: OverlayProps) {
  const [clickedInfo, setClickedInfo] = useState<ItemDetail[] | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemOriginAtom)
  const [markerPosition, setMarkerPosition] = useRecoilState(markerPositionAtom)
  const [nowIndex, setNowIndex] = useState<number>(0)
  const [screenNum, setScreenNum] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
  })

  const [halfDimensions, setHalfDimensions] = useState({
    width: 0,
    height: 0,
  })

  const handleGetIds = useCallback(
    (pnu: string) => {
      let ids: string[] = []
      for (const pnus of mapOrigin ?? []) {
        if (pnus.pnu === pnu) {
          ids.push(pnus.id)
        }
      }
      return ids
    },
    [mapOrigin],
  )

  const calculateScreenNum = () => {
    let position = {
      first: false,
      second: false,
      third: false,
      fourth: false,
    }

    if (
      markerPosition[0] < halfDimensions.width &&
      markerPosition[1] < halfDimensions.height
    ) {
      position.first = true
      position.second = false
      position.third = false
      position.fourth = false
    } else if (
      markerPosition[0] > halfDimensions.width &&
      markerPosition[1] < halfDimensions.height
    ) {
      position.second = true
      position.first = false
      position.third = false
      position.fourth = false
    }

    if (
      markerPosition[1] < halfDimensions.height &&
      markerPosition[0] > halfDimensions.width
    ) {
      position.fourth = false
      position.first = false
      position.second = false
      position.third = true
    } else if (
      markerPosition[1] > halfDimensions.height &&
      markerPosition[0] < halfDimensions.width
    ) {
      position.first = false
      position.second = false
      position.fourth = true
      position.third = false
    }

    setScreenNum(position)
  }

  useEffect(() => {
    calculateScreenNum()
  }, [markerPosition, halfDimensions])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateHalfDimensions = () => {
        const exceptFilterBox = window.innerWidth - 350
        const halfHeight = window.innerHeight / 2
        const halfWidth = exceptFilterBox / 2
        setHalfDimensions({
          width: halfWidth,
          height: halfHeight,
        })
      }
      updateHalfDimensions()
      window.addEventListener('resize', updateHalfDimensions)
      return () => window.removeEventListener('resize', updateHalfDimensions)
    }
  }, [])

  const handleGetType = useCallback(
    (pnu: string) => {
      let type: number[] = []
      for (const pnus of mapOrigin ?? []) {
        if (pnus.pnu === pnu) {
          type.push(pnus.type)
        }
      }
      return type
    },
    [mapOrigin],
  )

  const handleCalcLeftTop = useCallback(() => {
    if (screenNum.first) {
      return {
        left: markerPosition[0] + 245,
        top: markerPosition[1] + 250,
      }
    } else if (screenNum.second) {
      return {
        left: markerPosition[0],
        top: markerPosition[1],
      }
    } else if (screenNum.third) {
      return {
        left: markerPosition[0],
        top: markerPosition[1],
      }
    } else if (screenNum.fourth) {
      return {
        left: markerPosition[0],
        top: markerPosition[1],
      }
    }
  }, [markerPosition])
  console.log(screenNum)
  useGetDetail(
    handleGetIds(clickedItem?.pnu as string),
    handleGetType(clickedItem?.pnu as string),
    setClickedInfo,
    clickedItem,
  )
  return (
    <Flex
      css={Overlaytop}
      ref={ref}
      style={{
        left: handleCalcLeftTop()?.left + 'px',
        top: handleCalcLeftTop()?.top + 'px',
        position: 'absolute',
      }}
    >
      <Top
        clickedInfo={clickedInfo}
        setClickedInfo={setClickedInfo}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        nowIndex={nowIndex}
        setNowIndex={setNowIndex}
      />
      <Bottom
        clickedInfo={clickedInfo}
        clickedItem={clickedItem}
        nowIndex={nowIndex}
      />
    </Flex>
  )
}

const Overlaytop = css`
  width: 300px;
  height: 326px;
  border-radius: 8px 8px 8px 8px;
  border: 0.5px solid #9d9999;
  z-index: 10;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  flex-direction: column;
`

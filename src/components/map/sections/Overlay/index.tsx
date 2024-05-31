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
import { mapItemOriginAtom } from '@/store/atom/map'
import { useGetDetail } from './hooks/useGetDetail'

interface OverlayProps {
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  openOverlay: boolean
  style: any
  setIncludeWinYn: Dispatch<SetStateAction<boolean>>
}

export default function Overlay({
  clickedItem,
  setClickedItem,
  style,
  setIncludeWinYn,
}: OverlayProps) {
  const [clickedInfo, setClickedInfo] = useState<ItemDetail[] | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemOriginAtom)
  const [nowIndex, setNowIndex] = useState<number>(0)
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
        left: style.left,
        top: style.top,
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

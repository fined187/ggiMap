/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react'
import Top from './Top'
import Bottom from './Bottom'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
import { useRecoilState } from 'recoil'
import { mapAtom } from '@/store/atom/map'
import { useGetDetail } from './hooks/useGetDetail'

interface OverlayProps {
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  openOverlay: boolean
}

export default function Overlay({ clickedItem, setClickedItem }: OverlayProps) {
  const [clickedInfo, setClickedInfo] = useState<ItemDetail[] | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const [nowIndex, setNowIndex] = useState<number>(0)
  const handleGetIds = (pnu: string) => {
    let ids: string[] = []
    for (const pnus of mapItems ?? []) {
      if (pnus.pnu === pnu) {
        ids.push(pnus.id)
      }
    }
    return ids
  }
  const data = useGetDetail(
    handleGetIds(clickedItem?.pnu as string),
    clickedItem?.type as number,
    setClickedInfo,
  )

  return (
    <Flex css={Overlaytop} ref={ref}>
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
        setClickedInfo={setClickedInfo}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        nowIndex={nowIndex}
        setNowIndex={setNowIndex}
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

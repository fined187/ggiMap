/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Top from './Top'
import Bottom from './Bottom'
import {
  getGgDetail,
  getGmDetail,
  getKmDetail,
  getKwDetail,
} from '@/remote/map/info/getDetail'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'

interface OverlayProps {
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
}

export default function Overlay({ clickedItem, setClickedItem }: OverlayProps) {
  const [clickedInfo, setClickedInfo] = useState<ItemDetail | null>(null)

  const handleCallApi = async () => {
    // Make the function async
    if (clickedItem?.type === 1) {
      const data = await getKmDetail(clickedItem?.id)
      setClickedInfo(data)
    } else if (clickedItem?.type === 2) {
      const data = await getGmDetail(clickedItem?.id)
      setClickedInfo(data)
    } else if (clickedItem?.type === 3) {
      const data = await getGgDetail(clickedItem?.id)
      setClickedInfo(data)
    } else if (clickedItem?.type === 4) {
      const data = await getKwDetail(clickedItem?.id)
      setClickedInfo(data)
    }
  }

  useEffect(() => {
    handleCallApi()
  }, [clickedItem])

  return (
    <Flex css={Overlaytop}>
      <Top
        clickedInfo={clickedInfo}
        setClickedInfo={setClickedInfo}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
      />
      <Bottom
        clickedInfo={clickedInfo}
        setClickedInfo={setClickedInfo}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
      />
    </Flex>
  )
}

const Overlaytop = css`
  width: 300px;
  height: 326px;
  flex-shrink: 0;
  border-radius: 8px 8px 8px 8px;
  border: 0.5px solid #9d9999;
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  flex-direction: column;
`

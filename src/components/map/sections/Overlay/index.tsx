/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
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
import { useRecoilState } from 'recoil'
import { mapAtom } from '@/store/atom/map'

interface OverlayProps {
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  openOverlay: boolean
}

export default function Overlay({
  clickedItem,
  setClickedItem,
  setOpenOverlay,
  markerClickedRef,
  openOverlay,
}: OverlayProps) {
  const [clickedInfo, setClickedInfo] = useState<ItemDetail | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const [imagesUrl, setImagesUrl] = useState<string[]>([])
  const [idArr, setIdArr] = useState<string[]>([])
  const handleGetIds = (pnu: string) => {
    let ids: string[] = []
    for (const pnus of mapItems) {
      if (pnus.pnu === pnu) {
        ids.push(pnus.id)
      }
    }
    return ids
  }

  console.log(clickedInfo)

  const handleCallApi = async () => {
    if (clickedItem?.type === 1) {
      // const data = await Promise.all(
      //   handleGetIds(clickedItem?.pnu || '').map(
      //     async (id) => await getKmDetail(id),
      //   ),
      // )
      // setClickedInfo(data)
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
    <Flex css={Overlaytop} ref={ref}>
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
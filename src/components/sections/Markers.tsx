import { useRef, useState } from 'react'
import {
  Listener,
  Marker,
  Overlay,
  useListener,
  useNavermaps,
} from 'react-naver-maps'

export default function Markers({ item }: { item: any }) {
  console.log(item)
  const naverMaps = useNavermaps()
  return <>hi</>
}

import { MapItem } from '@/models/MapItem'
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import Markers from './Markers'

interface MarkerClusterProps {
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
}

export default function MarkerCluster({
  markerClickedRef,
  openOverlay,
  setOpenOverlay,
}: MarkerClusterProps) {
  return (
    <>
      <Markers
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        markerClickedRef={markerClickedRef}
      />
    </>
  )
}

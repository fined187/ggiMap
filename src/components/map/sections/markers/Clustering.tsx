import { Form } from '@/models/Form'
import { Dispatch, SetStateAction, useRef } from 'react'
import { Marker, MarkerProps, NaverMapProps } from 'react-naver-maps'

interface ClusteringProps {
  formData: Form
  item: {
    sd: string
    sgg: string
    umd: string
    count?: number
    x: number
    y: number
  }
  map: NaverMapProps
  setCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>
  setZoom: Dispatch<SetStateAction<number>>
}

export default function Clustering({
  formData,
  item,
  map,
  setCenter,
  setZoom,
}: ClusteringProps) {
  const markerRef = useRef<MarkerProps>(null)
  return (
    <Marker
      ref={markerRef}
      position={{
        lat: item.y,
        lng: item.x,
      }}
      title={
        formData.map.zoom! >= 13
          ? item.umd
          : formData.map.zoom! > 10 && formData.map.zoom! < 13
          ? item.sgg
          : item.sd
      }
      icon={{
        content: `
          <div style="position: absolute; display: flex; width: 80px; height: 50px; justify-content:center; align-items:center; flex-direction:column;">
            <div style="display:flex; width:100%; height:50%; background:#332EFC; justify-content:center; align-items:center; border-radius: 12px 12px 0px 0px;">
              <h1 style="font-size: 12px; margin-bottom: 5px; text-align: center; color:white; font-family: SUIT; font-style: normal; font-weight: 600; line-height: 100%; letter-spacing: -0.24px;">${
                formData.map.zoom! >= 13
                  ? item.umd
                  : formData.map.zoom! > 10 && formData.map.zoom! < 13
                  ? item.sgg
                  : item.sd
              }</h1>
            </div>
            <div style="display:flex; width:100%; height:50%; background:#fff; justify-content:center; align-items:center; border-radius: 0px 0px 12px 12px;">
              <h1 style="font-size: 16px; margin-bottom: 5px; color:black; text-align: center; font-family: SUIT; font-style: normal; font-weight: 600; line-height: 100%; letter-spacing: -0.24px;">${
                item.count
              }</h1>
            </div>
          </div>
        `,
      }}
      onClick={() => {
        setCenter({ lat: item.y, lng: item.x })
        setZoom(map.zoom! + 1)
      }}
    />
  )
}

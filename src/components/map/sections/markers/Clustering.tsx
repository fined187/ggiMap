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
  const cityRegex = /^/
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
          ? item.sgg.replace(/시$/, '')
          : item.sd
      }
      icon={{
        content: `
          <div style="display: flex; width: 80px; height: 50px; justify-content:center; align-items:center; flex-direction:column;">
            <div style="display:flex; width:100%; height: 25px; background: #332EFC; justify-content: center; align-items: center; border-radius: 12px 12px 0px 0px; border-left: 1px solid #332EFC; border-top: 1px solid #332EFC; border-right: 1px solid #332EFC;">
              <span style="font-size: 12px; text-align: center; color:white; font-family: SUIT; font-style: normal; font-weight: 600; line-height: 100%; letter-spacing: -0.24px;">${
                formData.map.zoom! >= 13
                  ? item.umd
                  : formData.map.zoom! > 10 && formData.map.zoom! < 13
                  ? item.sgg
                      .replace(/^창원시\s*/, '')
                      .replace(/^고양시\s*/, '')
                      .replace(/^성남시\s*/, '')
                      .replace(/^용인시\s*/, '')
                      .replace(/^안양시\s*/, '')
                      .replace(/^안산시\s*/, '')
                      .replace(/^수원시\s*/, '')
                      .replace(/^천안시\s*/, '')
                      .replace(/^청주시\s*/, '')
                      .replace(/^전주시\s*/, '')
                      .replace(/^포항시\s*/, '')
                  : item.sd
              }</span>
            </div>
            <div style="display:flex; width:100%; height:50%; background:#fff; justify-content:center; align-items:center; border-radius: 0px 0px 12px 12px; border-left: 1px solid #332EFC; border-bottom: 1px solid #332EFC; border-right: 1px solid #332EFC; ">
              <span style="font-size: 16px; color:black; text-align: center; font-family: SUIT; font-style: normal; font-weight: 600; line-height: 100%; letter-spacing: -0.24px;">${
                item.count
              }</span>
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

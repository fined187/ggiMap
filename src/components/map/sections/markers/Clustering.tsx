import { useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'

interface ClusteringProps {
  item: {
    sd: string
    sgg: string
    umd: string
    count?: number
    x: number
    y: number
  }
}

export default function Clustering({ item }: ClusteringProps) {
  const { data: map } = useSWR(MAP_KEY)
  const markerContent = useMemo(() => {
    const placeName =
      map?.getZoom() >= 13
        ? item.umd
        : map?.getZoom() > 10 && map?.getZoom() < 13
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
            .replace(/^부천시\s*/, '')
        : item.sd
    return `
      <div style="display: flex; width: 80px; height: 50px; justify-content: center; align-items: center; flex-direction: column;">
        <div style="display: flex; width: 100%; height: 25px; background: #332EFC; justify-content: center; align-items: center; border-radius: 12px 12px 0px 0px; border-left: 1px solid #332EFC; border-top: 1px solid #332EFC; border-right: 1px solid #332EFC;">
          <span style="font-size: 12px; text-align: center; color: white; font-family: SUIT; font-style: normal; font-weight: 600; line-height: 100%; letter-spacing: -0.24px;">
            ${placeName}
          </span>
        </div>
        <div style="display: flex; width: 100%; height: 50%; background: #fff; justify-content: center; align-items: center; border-radius: 0px 0px 12px 12px; border-left: 1px solid #332EFC; border-bottom: 1px solid #332EFC; border-right: 1px solid #332EFC;">
          <span style="font-size: 16px; color: black; text-align: center; font-family: SUIT; font-style: normal; font-weight: 600; line-height: 100%; letter-spacing: -0.24px;">
            ${item.count}
          </span>
        </div>
      </div>
    `
  }, [map?.getZoom, item])

  const handleMarkerClick = useCallback(() => {
    if (map) {
      map.setCenter(new naver.maps.LatLng(item.y, item.x))
      map.setZoom(map.getZoom() + 1, true)
    }
  }, [map, item.x, item.y])

  useEffect(() => {
    if (!map) return
    let marker: naver.maps.Marker | null = null
    marker = new naver.maps.Marker({
      map: map,
      position: new naver.maps.LatLng(item.y, item.x),
      icon: {
        content: markerContent,
        anchor: new naver.maps.Point(12, 12),
      },
    })
    naver.maps.Event.addListener(marker, 'click', handleMarkerClick)
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [map, item.x, item.y, markerContent, handleMarkerClick])
  return null
}

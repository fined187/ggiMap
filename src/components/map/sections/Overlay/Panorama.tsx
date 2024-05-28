import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { NaverMap } from '@/models/Map'
import { useEffect } from 'react'

export default function Panorama({
  latlng,
}: {
  latlng: { _lat: number; _lng: number }
}) {
  const { data: map } = useSWR<NaverMap>(MAP_KEY)
  useEffect(() => {
    if (map) {
      new window.naver.maps.Panorama('pano', {
        position: new window.naver.maps.LatLng(latlng._lat, latlng._lng),
        pov: {
          pan: -135,
          tilt: 29,
          fov: 100,
        },
      })
    }
  }, [map, latlng])
  return (
    <div
      id="pano"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}

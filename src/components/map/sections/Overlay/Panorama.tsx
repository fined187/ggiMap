import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { NaverMap } from '@/models/Map'

export default function Panorama() {
  const { data: map } = useSWR<NaverMap>(MAP_KEY)
  return (
    <div>
      <h1>Panorama</h1>
    </div>
  )
}

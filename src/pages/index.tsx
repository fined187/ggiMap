import MapComponent from './map'
import { User } from '@/models/User'

export default function Home({ data }: { data: User }) {
  return <MapComponent data={data} />
}

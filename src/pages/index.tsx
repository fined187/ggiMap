import handleToken from '@/remote/auth/token'
import MapComponent from './map'
import { User } from '@/models/User'
import { GetServerSidePropsContext } from 'next'

export default function Home({ token }: { token: string }) {
  return <MapComponent token={token} />
}

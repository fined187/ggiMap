import { useEffect } from 'react'
import MapComponent from './map'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/store/atom/postUser'
import { GetServerSidePropsContext } from 'next'
import getUser from '@/remote/auth/user'
import { User } from '@/models/User'

export default function Home({ data }: { data: User }) {
  return <MapComponent data={data} />
}

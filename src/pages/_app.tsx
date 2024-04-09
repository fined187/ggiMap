import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { NavermapsProvider } from 'react-naver-maps'
import globalSteyls from '@styles/globalStyles'
import Layout from '@shared/Layout'
import Map from '@/components/sections/Map'
import { useEffect, useState } from 'react'
import useUser from '@/hooks/auth/useUser'
import { Form } from '@/models/Form'
import { RecoilRoot } from 'recoil'

const client = new QueryClient({})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <NavermapsProvider
        ncpClientId={`${process.env.NEXT_PUBLIC_NAVER_MAP_API}`}
        submodules={['geocoder']}
      >
        <Layout>
          <Global styles={globalSteyls} />
          <QueryClientProvider client={client}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </Layout>
      </NavermapsProvider>
    </RecoilRoot>
  )
}

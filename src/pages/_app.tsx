import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { NavermapsProvider } from 'react-naver-maps'
import globalSteyls from '@styles/globalStyles'
import Layout from '@shared/Layout'
import { RecoilRoot } from 'recoil'
import '@/styles/globals.css'

const client = new QueryClient({})

export default function App({ Component, pageProps }: AppProps) {
  const lastPathPart = pageProps.lastPathPart
  return (
    <RecoilRoot>
      <Layout lastPathPart={lastPathPart}>
        <Global styles={globalSteyls} />
        <QueryClientProvider client={client}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Layout>
    </RecoilRoot>
  )
}

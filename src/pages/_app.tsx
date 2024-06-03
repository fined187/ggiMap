import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import { QueryClientProvider, QueryClient, Hydrate } from 'react-query'
import { NavermapsProvider } from 'react-naver-maps'
import globalSteyls from '@styles/globalStyles'
import Layout from '@shared/Layout'
import { RecoilRoot } from 'recoil'
import '@/styles/globals.css'
import InterestContextProvider from '@/contexts/useModalContext'

const client = new QueryClient({})

export default function App({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppProps) {
  const lastPathPart = pageProps.lastPathPart
  return (
    <RecoilRoot>
      <Layout lastPathPart={lastPathPart}>
        <Global styles={globalSteyls} />
        <QueryClientProvider client={client}>
          <Hydrate state={dehydratedState}>
            <InterestContextProvider>
              <Component {...pageProps} />
            </InterestContextProvider>
          </Hydrate>
        </QueryClientProvider>
      </Layout>
    </RecoilRoot>
  )
}

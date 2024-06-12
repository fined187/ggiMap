import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import { QueryClientProvider, QueryClient, Hydrate } from 'react-query'
import globalSteyls from '@styles/globalStyles'
import { RecoilRoot } from 'recoil'
import '@/styles/globals.css'
import InterestContextProvider from '@/contexts/useModalContext'
import { useRouter } from 'next/router'
import Layout from '@/components/shared/Layout'

const client = new QueryClient({})

export default function App({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppProps) {
  const router = useRouter()
  const lastPathPart = router.pathname.split('/').pop()
  return (
    <RecoilRoot>
      <Layout lastPathPart={lastPathPart as string}>
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

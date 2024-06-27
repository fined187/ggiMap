import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`
  return (
    <Html lang="en">
      <Head>
        <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
        <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/static/woff2/SUIT.css"
          rel="stylesheet"
        />
      </Head>
      <meta
        name="viewport"
        content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width, minimum-scale=1.0"
      />
      <body>
        <Main />
        <NextScript />
        <div id="root-portal" />
        <div id="portal" />
        <div id="portal-root" />
      </body>
    </Html>
  )
}

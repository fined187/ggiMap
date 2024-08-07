import MapComponent from './map'
import BidFormProps from './bid-form'
import { ChakraProvider } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import Layout from '@/components/bidForm/Layout'
import { GetServerSidePropsContext } from 'next'

export default function Home({ lastPathPart }: { lastPathPart: string }) {
  const [isCheck, setIsCheck] = useState(false)
  const errorCode400Regex = /^400\d{2}$/
  const errorCode200Regex = /^200\d{2}$/
  function handleErrorResponse(code: string) {
    if (errorCode400Regex.test(code)) {
      // 사용자에게 알리고 창을 닫음
      const confirmed = window.confirm(
        '허용접속시간이 초과하여 종료합니다. 메뉴의 고객라운지 - 물건관리 - 입찰표관리에서 저장된 내용을 확인하세요.',
      )
      if (confirmed) {
        window.close()
      }
    }
    // 사용자에게 알리고 창을 닫음
    const confirmed = window.confirm(
      '허용접속시간이 초과하여 종료합니다. 메뉴의 고객라운지 - 물건관리 - 입찰표관리에서 저장된 내용을 확인하세요.',
    )
    if (confirmed) {
      window.close()
    }
    if (errorCode200Regex.test(code)) {
      const ipchalMsg = window.confirm(
        '해당 물건은 입찰진행중이 아니므로 시작 화면으로 이동합니다.',
      )
      if (ipchalMsg) {
        window.close()
      }
    }
  }

  axios.interceptors.response.use(
    function (response) {
      setIsCheck(true)
      handleErrorResponse(response.data.code.toString())
      return response
    },
    function (error) {
      console.log(error)
      return null
    },
  )
  return (
    <>
      <Layout>
        <ChakraProvider>
          <BidFormProps />
        </ChakraProvider>
      </Layout>
      <MapComponent />
    </>
  )
}

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { req } = context
  const pathParts = req.url?.split('/') || []
  const lastPathPart = pathParts[pathParts.length - 1]
  return {
    props: {
      lastPathPart,
    },
  }
}

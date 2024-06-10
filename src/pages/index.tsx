import MapComponent from './map'
import BidFormProps from './bid-form'
import { ChakraProvider } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import Layout from '@/components/bidForm/Layout'

export default function Home() {
  const [isCheck, setIsCheck] = useState(false)

  function handleErrorResponse() {
    // 사용자에게 알리고 창을 닫음
    const confirmed = window.confirm(
      '허용접속시간이 초과하여 종료합니다. 메뉴의 고객라운지 - 물건관리 - 입찰표관리에서 저장된 내용을 확인하세요.',
    )
    if (confirmed) {
      window.close()
    }
  }

  function handleIpchalMsg() {
    const ipchalMsg = window.confirm(
      '해당 물건은 입찰진행중이 아니므로 시작 화면으로 이동합니다.',
    )
    if (ipchalMsg) {
      window.close()
    }
  }
  axios.interceptors.response.use(
    function (response) {
      if (!isCheck && response.data.code === 40005) {
        setIsCheck(true)
        handleErrorResponse()
      }
      if (!isCheck && response.data.code === 20100) {
        setIsCheck(true)
        handleIpchalMsg()
      }
      return response
    },
    function (error) {
      handleErrorResponse()
      console.log(error)
      return null
    },
  )
  return (
    <>
      <ChakraProvider>
        <Layout>
          <BidFormProps />
        </Layout>
      </ChakraProvider>
      <MapComponent />
    </>
  )
}

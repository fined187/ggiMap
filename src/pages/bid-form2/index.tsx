import { stepState } from '@/store/atom/bidForm'
import { handleSessionMsg } from '@/utils/bidForm/useError'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import { useRecoilState } from 'recoil'

interface BidFormProps {
  idcode: string | null
  token: string | null
  mstSeq: string | null
  lastPathPart: string | null
}

let isCheck = false

function BidFormPage({ idcode, token, mstSeq, lastPathPart }: BidFormProps) {
  axios.interceptors.response.use(
    function (response) {
      if (!isCheck && response.data.code === 40005) {
        isCheck = true
        handleSessionMsg()
      }
      return response
    },
    function (error) {
      handleSessionMsg()
      console.log(error)
      return null
    },
  )
  const [stateNum, setStateNum] = useRecoilState(stepState)
  return <div></div>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { mstSeq } = context.query
  const { idcode } = context.query
  const { token } = context.query
  const { req } = context
  const { url } = req
  const pathname = new URL(url ?? '', 'http://example.com').pathname
  const pathParts = pathname.split('/').filter(Boolean)
  const lastPathPart = pathParts[pathParts.length - 1]

  return {
    props: {
      mstSeq: mstSeq ?? null,
      idcode: idcode ?? null,
      token: token ?? null,
      lastPathPart: lastPathPart ?? null,
    },
  }
}

export default BidFormPage

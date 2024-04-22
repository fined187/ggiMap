import MapComponent from './map'
import BidFormProps from './bid-form'
import Layout from '@/components/bidForm/Layout'
import { ChakraProvider } from '@chakra-ui/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

interface ServerSideProps {
  data?: {
    userId: string | null
    authorities: string[] | null
  }
  idcode?: string | null
  token: string | null
  mstSeq?: string | null
  lastPathPart: string | null
}

export default function Home({
  data,
  idcode,
  token,
  mstSeq,
  lastPathPart,
}: ServerSideProps) {
  return (
    <>
      <ChakraProvider>
        <BidFormProps
          token={token as string}
          idcode={idcode as string}
          mstSeq={mstSeq as string}
          lastPathPart={lastPathPart as string}
        />
      </ChakraProvider>
      <MapComponent data={data as { userId: string; authorities: string[] }} />
    </>
  )
}

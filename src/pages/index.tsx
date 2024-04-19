import MapComponent from './map'
import BidFormProps from './bid-form'
import Layout from '@/components/bidForm/Layout'
import { ChakraProvider } from '@chakra-ui/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
interface Props {
  idcode?: string | null
  token: string | null
  mstSeq?: string | null
  lastPathPart: string | null
}

export default function Home({ token, idcode, mstSeq, lastPathPart }: Props) {
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
      <MapComponent token={token as string} />
    </>
  )
}

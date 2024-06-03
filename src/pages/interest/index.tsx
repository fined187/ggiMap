import InterestProps from '@/components/interest'
import { interest } from '@/models/Interest'
import { getAuth } from '@/remote/auth/getAuth'
import {
  getGmInterest,
  getKmInterest,
  getKwInterest,
} from '@/remote/interest/getInterest'
import { GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'

interface Props {
  data: {
    id: string
    type: string
    token: string
  }
}

const InterestPage = ({ data }: Props) => {
  const [interestData, setInterestData] = useState<interest | null>(null)
  const handleGetData = async (type: string, id: string, token: string) => {
    try {
      const response = await getAuth(
        token as string,
        'iyv0Lk8v.GMiSXcZDDSRLquqAm7M9YHVwTF4aY8zr',
      )
      if (response?.data?.success) {
        let data
        switch (type) {
          case '1':
            data = await getKmInterest(id)
            setInterestData(data)
            break
          case '2':
            data = await getGmInterest(id)
            setInterestData(data)
            break
          case '4':
            data = await getKwInterest(id)
            setInterestData(data)
            break
          default:
            return { notFound: true }
        }
      } else {
        return { notFound: true }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    if (data) {
      handleGetData(data?.type as string, data.id, data.token)
    }
  }, [data])
  return (
    <div>
      <InterestProps data={interestData as interest} />
    </div>
  )
}

export default InterestPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id as string
  const type = context.query.type as string
  const token = context.query.token as string
  const data = { id, type, token }
  return {
    props: {
      data: data ?? null,
    },
  }
}

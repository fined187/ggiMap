import InterestProps from '@/components/interest'
import { interest } from '@/models/Interest'
import { getKmInterest } from '@/remote/interest/getInterest'
import { GetServerSidePropsContext } from 'next'

const InterestPage = ({ data }: { data: interest }) => {
  return (
    <div>
      <InterestProps data={data} />
    </div>
  )
}

export default InterestPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { type, id } = context.query
    // id가 없는 경우에 대한 처리
    if (!id || Array.isArray(id)) {
      return { notFound: true }
    }

    if (type === '1') {
      const data = await getKmInterest(id)
      const safeData = data === undefined ? null : data
      return {
        props: {
          data: safeData,
        },
      }
    } else {
      return { notFound: true }
    }
  } catch (error) {
    // 에러 발생 시 로그 출력 및 적절한 에러 처리
    console.error('Error fetching data:', error)
    return { notFound: true }
  }
}

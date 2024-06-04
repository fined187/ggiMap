import Image from 'next/image'
import Flex from '../shared/Flex'
import TitlePage from './Title'
import { useInterestContext } from '@/contexts/useModalContext'

export default function UpdateResult() {
  const { open } = useInterestContext()
  return (
    <Flex justify="space-between">
      <TitlePage title="관심물건이 등록되었습니다" />
      <Image
        src={
          'https://cdn3.iconfinder.com/data/icons/user-interface-169/32/cross-512.png'
        }
        alt="close"
        width={30}
        height={30}
        onClick={() => {}}
        style={{
          cursor: 'pointer',
        }}
      />
    </Flex>
  )
}

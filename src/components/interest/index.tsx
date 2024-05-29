import styled from '@emotion/styled'
import TitlePage from './Title'
import TableFrame from './TableFrame'
import Spacing from '../shared/Spacing'
import TopLine from './TopLine'

export default function InterestProps() {
  return (
    <Container>
      <TitlePage />
      <Spacing size={40} />
      <TopLine />
      <TableFrame title="사건번호" contents="2021-1234" />
      <Spacing size={65} />
      <TableFrame title="중요도" contents="hi" background="#F9F9F9" />
    </Container>
  )
}

const Container = styled.div`
  width: 95%;
  height: 100%;
  padding: 20px 20px;
  flex-direction: column;
  position: relative;
`

import styled from '@emotion/styled'
import TitlePage from './Title'
import TableFrame from './TableFrame'
import Spacing from '../shared/Spacing'
import TopLine from './TopLine'
import TextField from '../shared/TextField'
import { useState } from 'react'
import GroupElements from './Group'

export default function InterestProps() {
  const [formData, setFormData] = useState({
    title: '',
    importance: '',
    group: '',
    memo: '',
    SnsAlert: false,
  })
  return (
    <Container>
      <TitlePage title="관심물건 등록" />
      <Spacing size={40} />
      <TopLine />
      <TableFrame title="사건번호" contents="2021-1234" />
      <Spacing size={65} />
      <TableFrame
        title="중요도"
        contents={<GroupElements />}
        background="#F9F9F9"
      />
      <Spacing size={65} />
      <TableFrame
        title="등록그룹"
        contents="hi"
        background="#F9F9F9"
        height="107"
      />
      <Spacing size={107} />
      <TableFrame
        title="메모"
        contents={<TextField />}
        height="96"
        background="#F9F9F9"
      />
      <Spacing size={130} />
      <TitlePage title="SNS 알림 서비스" />
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

import styled from '@emotion/styled'
import { useState } from 'react'

export default function NoGroupBtn() {
  const [isFocus, setIsFocus] = useState(false)
  return <ContainerStyle></ContainerStyle>
}

const ContainerStyle = styled.div`
  width: 100%;
  height: 50%;
  padding: 20px 10px;
  flex-direction: row;
  position: relative;
`

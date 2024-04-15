import styled from '@emotion/styled'
import { useState } from 'react'

function TopBar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return <Container isOpen={isOpen}>{children}</Container>
}

const Container = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 30px;
  left: calc(50% + 180px);
  transform: translateX(-50%);
  z-index: 10;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #fff;
  border: ${({ isOpen }) =>
    isOpen ? '1px solid #332EFC' : '1px solid #000001'};
  min-width: 360px;
`

export default TopBar

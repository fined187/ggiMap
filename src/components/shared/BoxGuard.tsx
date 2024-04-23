import { css } from '@emotion/react'
import Flex from './Flex'

export default function BoxGuard({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      justify="start"
      align="center"
      direction="column"
      css={ContainerStyle}
    >
      {children}
    </Flex>
  )
}

const ContainerStyle = css`
  height: 98vh;
  top: 1%;
  left: 1%;
  z-index: 10;
  background-color: none;
  position: absolute;
  transition: all 0.5s ease-in-out;
`

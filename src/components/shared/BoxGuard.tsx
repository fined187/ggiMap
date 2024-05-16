import { css } from '@emotion/react'
import Flex from './Flex'

export default function BoxGuard({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Flex
      justify="start"
      align="center"
      direction="column"
      css={ContainerStyle}
      style={{
        height: isOpen ? '98%' : '',
        gap: isOpen ? '10px' : '19px',
      }}
    >
      {children}
    </Flex>
  )
}

const ContainerStyle = css`
  top: 1%;
  left: 1%;
  z-index: 10;
  background-color: none;
  position: absolute;
`

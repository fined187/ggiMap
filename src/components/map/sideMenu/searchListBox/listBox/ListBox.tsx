import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { useState } from 'react'
import Result from './Result'

interface ListBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function ListBox({ formData, setFormData }: ListBoxProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Flex
      css={ContainerStyle}
      direction="column"
      style={{
        height: isOpen
          ? formData.lastFilter === 1 && formData.isSubFilterBoxOpen
            ? '520px'
            : formData.lastFilter === 2 && formData.isSubFilterBoxOpen
            ? '470px'
            : formData.lastFilter === 3 && formData.isSubFilterBoxOpen
            ? '530px'
            : formData.lastFilter === 4 && formData.isSubFilterBoxOpen
            ? '530px'
            : '740px'
          : '70px',
      }}
    >
      <Result
        formData={formData}
        setFormData={setFormData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  width: 370px;
  z-index: 10;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  background-color: white;
  position: relative;
  top: 1%;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
`

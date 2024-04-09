import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import Header from './Header'
import Result from './Result'
import { useRecoilState } from 'recoil'
import { mapAtom } from '@/store/atom/map'
import Spacing from '@/components/shared/Spacing'
import { colors } from '@/styles/colorPalette'

interface ListBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function ListBox({ formData, setFormData }: ListBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mapItem, setMapItem] = useRecoilState(mapAtom)
  return (
    <Flex
      css={ContainerStyle}
      direction="column"
      style={{
        height: isOpen
          ? formData.lastFilter === 1 && formData.isSubFilterBoxOpen
            ? '490px'
            : formData.lastFilter === 2 && formData.isSubFilterBoxOpen
            ? '440px'
            : formData.lastFilter === 3 && formData.isSubFilterBoxOpen
            ? '500px'
            : formData.lastFilter === 4 && formData.isSubFilterBoxOpen
            ? '500px'
            : '710px'
          : '70px',
      }}
    >
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formData={formData}
        setFormData={setFormData}
      />
      {mapItem.map((item, index) => (
        <Result
          key={index}
          formData={formData}
          setFormData={setFormData}
          item={item}
        />
      ))}
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
  position: relative;
`

import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import { useState } from 'react'
import Result from './Result'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { MapItems } from '@/models/MapItem'
import { useRecoilState } from 'recoil'
import { mapListAtom } from '@/store/atom/map'

interface ListBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ListBox({
  formData,
  setFormData,
  isOpen,
  setIsOpen,
}: ListBoxProps) {
  const [listItems, setListItems] = useRecoilState(mapListAtom)
  const { data: map } = useSWR(MAP_KEY)
  return (
    <Flex
      css={ContainerStyle}
      direction="column"
      style={{
        height: isOpen
          ? formData.lastFilter === 1 && formData.isSubFilterBoxOpen
            ? 'calc(100vh - 390px)'
            : formData.lastFilter === 2 && formData.isSubFilterBoxOpen
            ? 'calc(100vh - 440px)'
            : formData.lastFilter === 3 && formData.isSubFilterBoxOpen
            ? 'calc(100vh - 380px)'
            : formData.lastFilter === 4 && formData.isSubFilterBoxOpen
            ? 'calc(100vh - 380px)'
            : map && map.zoom! >= 15 && listItems?.length! > 0
            ? 'calc(100vh - 150px)'
            : '150px'
          : '59px',
      }}
    >
      <Result formData={formData} isOpen={isOpen} setIsOpen={setIsOpen} />
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

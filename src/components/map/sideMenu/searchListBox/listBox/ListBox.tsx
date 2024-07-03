import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import Result from './Result'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formDataAtom, mapListAtom } from '@/store/atom/map'
import { authInfo } from '@/store/atom/auth'

interface ListBoxProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  dragStateRef: React.MutableRefObject<boolean>
}

export default function ListBox({
  isOpen,
  setIsOpen,
  dragStateRef,
}: ListBoxProps) {
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [mapListItems, setMapListItems] = useRecoilState(mapListAtom)
  const { data: map } = useSWR(MAP_KEY)
  const auth = useRecoilValue(authInfo)
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
            : map && map.zoom! >= 15 && mapListItems?.contents?.length! > 0
            ? 'calc(100vh - 150px)'
            : auth.idCode !== '' &&
              map &&
              map.zoom >= 15 &&
              mapListItems?.contents?.length! > 0
            ? 'calc(100vh - 150px)'
            : auth.idCode !== '' &&
              map &&
              map.zoom >= 15 &&
              mapListItems?.contents?.length! === 0
            ? 'calc(100vh - 150px)'
            : '150px'
          : '59px',
      }}
    >
      <Result
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dragStateRef={dragStateRef}
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
  z-index: 100;
`

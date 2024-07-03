import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import Result from './Result'
import useSWR from 'swr'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formDataAtom, mapListAtom } from '@/store/atom/map'
import { authInfo } from '@/store/atom/auth'
import { useCallback } from 'react'

interface ListBoxProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  dragStateRef: React.MutableRefObject<boolean>
  setOpenOverlay: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ListBox({
  isOpen,
  setIsOpen,
  dragStateRef,
  setOpenOverlay,
}: ListBoxProps) {
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [mapListItems, setMapListItems] = useRecoilState(mapListAtom)
  const { data: map } = useSWR(MAP_KEY)
  const auth = useRecoilValue(authInfo)

  const handleCalcHeight = useCallback(() => {
    if (isOpen) {
      if (formData.lastFilter === 1 && formData.isSubFilterBoxOpen) {
        return 'calc(100vh - 390px)'
      }

      if (formData.lastFilter === 2 && formData.isSubFilterBoxOpen) {
        if (map && map.zoom >= 15) {
          return 'calc(100vh - 440px)'
        }
        if (map?.zoom < 15) {
          return '150px'
        }
      }

      if (formData.lastFilter === 3 && formData.isSubFilterBoxOpen) {
        return 'calc(100vh - 380px)'
      }

      if (formData.lastFilter === 4 && formData.isSubFilterBoxOpen) {
        return 'calc(100vh - 380px)'
      }

      if (map && map.zoom! >= 15 && mapListItems?.contents?.length! > 0) {
        return 'calc(100vh - 150px)'
      }

      if (auth?.idCode !== '' && map && map.zoom! >= 15) {
        if (mapListItems?.contents?.length! > 0) {
          return 'calc(100vh - 150px)'
        }
        return 'calc(100vh - 150px)'
      }

      return '150px'
    }

    return '59px'
  }, [
    auth.idCode,
    formData.isSubFilterBoxOpen,
    formData.lastFilter,
    isOpen,
    map,
    mapListItems,
  ])
  return (
    <Flex
      css={ContainerStyle}
      direction="column"
      style={{
        height: handleCalcHeight(),
      }}
      onClick={() => {
        setOpenOverlay(false)
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

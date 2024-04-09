import BigArrow from '@/components/icons/BigArrow'
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Skeleton from '@/components/shared/Skeleton'
import { Form } from '@/models/Form'
import { loadingAtom, mapAtom } from '@/store/atom/map'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useRecoilState, useRecoilValue } from 'recoil'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function Header({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
}: Props) {
  const [mapItems, setMapItems] = useRecoilState(mapAtom)
  const isLoading = useRecoilValue(loadingAtom)

  return (
    <Flex
      direction="row"
      style={{
        width: '90%',
        height: '35px',
        position: 'absolute',
        padding: '18px',
        top: '0',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      {isLoading === true ? (
        <ListRow
          left={<Skeleton width={83} height={32} />}
          right={<BigArrow isOpen={isOpen} setIsOpen={setIsOpen} />}
          contents={<Skeleton width={63} height={32} />}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      ) : (
        <ListRow
          left={<SearchText isOpen={isOpen}>검색결과</SearchText>}
          right={<BigArrow isOpen={isOpen} setIsOpen={setIsOpen} />}
          contents={
            <SearchText isOpen={isOpen}>{mapItems.length}건</SearchText>
          }
          onClick={() => setIsOpen((prev) => !prev)}
        />
      )}
    </Flex>
  )
}

const SearchText = styled.span<{ isOpen?: boolean }>`
  color: ${({ isOpen }) => (isOpen ? '#000001' : '#d21e1b')};
  font-family: SUIT;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
  letter-spacing: -0.24px;
`

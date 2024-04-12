import BigArrow from '@/components/icons/BigArrow'
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Skeleton from '@/components/shared/Skeleton'
import { Form } from '@/models/Form'
import { Items } from '@/models/ListItems'
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
  listItems: Items | null
  isLoading: boolean
}

export default function Header({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  listItems,
  isLoading,
}: Props) {
  return (
    <>
      <Flex direction="row" css={ContainerStyle}>
        {isLoading ? (
          <ListRow
            left={<Skeleton width={83} height={32} />}
            right={<BigArrow isOpen={isOpen} setIsOpen={setIsOpen} />}
            contents={<Skeleton width={63} height={32} />}
            onClick={() => setIsOpen((prev) => !prev)}
          />
        ) : formData.map.zoom! >= 15 ? (
          <ListRow
            left={<SearchText isOpen={isOpen}>검색결과</SearchText>}
            right={<BigArrow isOpen={isOpen} setIsOpen={setIsOpen} />}
            contents={
              <SearchText isOpen={isOpen}>{listItems?.totalCount}건</SearchText>
            }
            onClick={() => setIsOpen((prev) => !prev)}
          />
        ) : null}
      </Flex>
    </>
  )
}

const ContainerStyle = css`
  display: flex;
  width: 350px;
  height: 35px;
  position: 'sticky';
  padding: 18px;
  border-bottom: 1px solid #e0e0e0;
`

const SearchText = styled.span<{ isOpen?: boolean }>`
  color: ${({ isOpen }) => (isOpen ? '#000001' : '#d21e1b')};
  font-family: SUIT;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
  letter-spacing: -0.24px;
`

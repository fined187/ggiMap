import BigArrow from '@/components/map/icons/BigArrow'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Skeleton from '@/components/shared/Skeleton'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import useSWR from 'swr'
import SelectedOnly from './icons/SelectedOnly'
import { useRecoilValue } from 'recoil'
import { authInfo } from '@/store/atom/auth'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  pageInfo: number
}

export default function Header({
  isOpen,
  setIsOpen,
  isLoading,
  pageInfo,
}: Props) {
  const { data: map } = useSWR(MAP_KEY)
  const auth = useRecoilValue(authInfo)
  return (
    <>
      <Flex direction="row" css={ContainerStyle}>
        {isLoading ? (
          <ListRow
            right={<BigArrow isOpen={isOpen} setIsOpen={setIsOpen} />}
            contents={<Skeleton width={150} height={32} />}
            onClick={() => setIsOpen((prev) => !prev)}
          />
        ) : map && map.zoom! >= 15 ? (
          <ListRow
            left={<SearchText isOpen={isOpen}>검색결과</SearchText>}
            right={
              <Flex
                direction="row"
                style={{
                  gap: '10px',
                }}
              >
                {auth.idCode !== '' && <SelectedOnly />}
                <BigArrow isOpen={isOpen} setIsOpen={setIsOpen} />
              </Flex>
            }
            contents={<SearchText isOpen={isOpen}>{pageInfo}건</SearchText>}
          />
        ) : map && map.zoom! < 15 ? (
          <ListRow
            left={<SearchText isOpen={isOpen}>검색결과</SearchText>}
            right={<BigArrow isOpen={isOpen} setIsOpen={setIsOpen} />}
            contents={
              <Text
                css={NoResultText}
                style={{
                  color: isOpen ? '#000001' : '#d21e1b',
                }}
              >
                지도를 확대해주세요
              </Text>
            }
          />
        ) : null}
      </Flex>
    </>
  )
}

const ContainerStyle = css`
  display: flex;
  width: 100%;
  height: 60px;
  position: 'sticky';
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
`

const SearchText = styled.span<{ isOpen?: boolean }>`
  color: ${({ isOpen }) => (isOpen ? '#000001' : '#d21e1b')};
  font-family: SUIT;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%;
  letter-spacing: -0.24px;
`
const NoResultText = css`
  color: #545454;
  margin-left: 70px;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 135%;
  letter-spacing: -0.16px;
`

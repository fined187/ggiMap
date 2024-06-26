/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import Input from '@/components/shared/Input'
import Spacing from '@/components/shared/Spacing'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import MainFilter from '../filterBox/MainFilter'
import SubFilter from '../filterBox/SubFilter'
import DetailBox from '../filterBox/SubFilterDetail/DetailBox'
import getSubway from '@/remote/map/subway/getSubway'
import Logo from '../../icons/Logo'
import Search from '../../icons/Search'
import useSWR from 'swr'
import { MAP_KEY } from '../../sections/hooks/useMap'
import { useRecoilState } from 'recoil'
import { formDataAtom } from '@/store/atom/map'

declare global {
  interface Window {
    naver: any
  }
}

export default function SearchBox() {
  const { data: map } = useSWR(MAP_KEY)
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [keyword, setKeyword] = useState('')
  const [isBoxOpen, setIsBoxOpen] = useState({
    finished: false,
    usage: false,
    lowPrice: false,
    price: false,
  })
  if (!map) return null

  const searchAddrToCoord = (address: string) => {
    if (window.naver.maps?.Service?.geocode !== undefined) {
      window.naver.maps?.Service?.geocode(
        {
          query: address,
        },
        (status: any, response: any) => {
          if (status === window.naver.maps?.Service?.Status?.ERROR) {
            alert('주소를 다시 확인해주세요.')
            return
          } else if (response.v2.meta.totalCount === 0) {
            alert('검색 결과가 없습니다. 주소를 다시 입력해주세요.')
            return
          } else if (!response.v2.addresses[0].roadAddress.includes(keyword)) {
            alert('검색 결과가 없습니다. 주소를 다시 입력해주세요.')
            return
          }
          const result = response.v2.addresses[0]
          const { x, y } = result ?? { point: { x: 0, y: 0 } }
          map.setCenter({
            lat: Number(y),
            lng: Number(x),
          })
        },
      )
    }
  }

  const handleKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const handleSearch = async (inputKeyword: string) => {
    if (inputKeyword.match(/역$/)) {
      try {
        const response = await getSubway(inputKeyword)
        if (response.documents.length === 0) {
          alert('검색 결과가 없습니다.')
          return
        } else {
          const { x, y } = response.documents[0]
          map.setCenter({
            lat: Number(y),
            lng: Number(x),
          })
        }
      } catch (error) {
        console.error(error)
      }
    } else if (
      inputKeyword.match(/시$/) ||
      inputKeyword.match(/구$/) ||
      inputKeyword.match(/동$/) ||
      inputKeyword.match(/읍$/) ||
      inputKeyword.match(/면$/) ||
      inputKeyword.match(/리$/) ||
      inputKeyword.match(/가$/) ||
      inputKeyword.match(/로$/) ||
      inputKeyword.match(/길$/) ||
      inputKeyword.match(/도$/) ||
      inputKeyword.match(/번길$/) ||
      inputKeyword.match(/길$/) ||
      inputKeyword.match(/[0-9]$/)
    ) {
      searchAddrToCoord(inputKeyword)
    } else {
      alert('지하철역 혹은 주소를 입력해주세요')
    }
  }

  const handleEnter = async (e?: KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === 'Enter') {
      await handleSearch(e.currentTarget.value)
    }
  }

  const handleSearchButton = () => {
    handleSearch(keyword)
  }

  return (
    <Flex id="searchBox" direction="column" align="center" css={ContainerStyle}>
      <Flex
        direction="row"
        justify="center"
        align="center"
        style={{
          gap: '10px',
          height: '60px',
          width: '100%',
          boxShadow: '2px 2px 2px 0px rgba(198, 198, 198, 0.10)',
        }}
      >
        <Logo />
        <Input
          type="text"
          name="keyword"
          placeholder="지역명, 지하철역"
          value={keyword}
          css={InputStyle}
          onChange={handleKeyword}
          onKeyDown={(e) => handleEnter(e)}
          style={{
            zIndex: 100,
          }}
        />
        <Search right="25" top="25" handleSearchButton={handleSearchButton} />
      </Flex>
      <Spacing size={10} />
      <MainFilter formData={formData} setFormData={setFormData} />
      <Spacing size={10} />
      <SubFilter
        formData={formData}
        setFormData={setFormData}
        isBoxOpen={isBoxOpen}
        setIsBoxOpen={setIsBoxOpen}
      />
      {formData.isSubFilterBoxOpen ? (
        <Flex css={animation}>
          <DetailBox isBoxOpen={isBoxOpen} />
        </Flex>
      ) : null}
    </Flex>
  )
}

const animation = css`
  animation: all 0.3s ease-in-out 0.3s fadeIn;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`

const ContainerStyle = css`
  position: relative;
  padding: 5px 10px 5px 10px;
  z-index: 10;
  background-color: white;
  width: 370px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease-in-out;
`
const InputStyle = css`
  width: 100%;
  height: 44px;
  border: none;
  font-family: 'suit';
  font-size: 18px;
  font-weight: 500;
  color: ${colors.black};
`

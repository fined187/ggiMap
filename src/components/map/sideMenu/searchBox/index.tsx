/* eslint-disable react-hooks/rules-of-hooks */
import {
  useState,
  useCallback,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react'
import Flex from '@/components/shared/Flex'
import Input from '@/components/shared/Input'
import Spacing from '@/components/shared/Spacing'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import MainFilter from '../filterBox/MainFilter'
import SubFilter from '../filterBox/SubFilter'
import getSubway from '@/remote/map/subway/getSubway'
import Logo from '../../icons/Logo'
import Search from '../../icons/Search'
import { MAP_KEY } from '../../sections/hooks/useMap'
import { useRecoilState } from 'recoil'
import { formDataAtom } from '@/store/atom/map'
import AutoKeyword from './AutoKeyword'
import DetailBox from '../filterBox/subFilterDetail/DetailBox'
import { UseQueryResult, useQuery } from 'react-query'
import { NaverMap } from '@/models/Map'

declare global {
  interface Window {
    naver: any
  }
}

interface SearchBoxProps {
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
}

const SearchBox = ({ setOpenOverlay }: SearchBoxProps) => {
  const { data: map }: UseQueryResult<NaverMap> = useQuery(MAP_KEY, {
    enabled: false,
  })
  const [isFocus, setIsFocus] = useState(false)
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [keyword, setKeyword] = useState('')
  const [isBoxOpen, setIsBoxOpen] = useState({
    finished: false,
    usage: false,
    lowPrice: false,
    price: false,
  })

  const searchAddrToCoord = useCallback(
    (address: string) => {
      if (window.naver?.maps?.Service?.geocode) {
        window.naver.maps.Service.geocode(
          {
            query: address,
          },
          (status: any, response: any) => {
            if (status === window.naver.maps.Service.Status.ERROR) {
              alert('주소를 다시 확인해주세요.')
              return
            } else if (
              response.v2.meta.totalCount === 0 ||
              !response.v2.addresses[0].roadAddress.includes(keyword)
            ) {
              alert('검색 결과가 없거나 주소를 다시 입력해주세요.')
              return
            }
            const result = response.v2.addresses[0]
            const { x, y } = result ?? { x: 0, y: 0 }
            map &&
              map?.setCenter({
                lat: Number(y),
                lng: Number(x),
              })
          },
        )
      }
    },
    [setKeyword, keyword, map],
  )

  const handleKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }, [])

  const handleSearch = useCallback(
    async (inputKeyword: string) => {
      if (inputKeyword.match(/역$/)) {
        try {
          const response = await getSubway(inputKeyword)
          if (response.documents.length === 0) {
            alert('검색 결과가 없습니다.')
            return
          }
          const { x, y } = response.documents[0]
          map &&
            map.setCenter({
              lat: Number(y),
              lng: Number(x),
            })
        } catch (error) {
          console.error(error)
        }
      } else if (
        inputKeyword.match(
          /시$|구$|동$|읍$|면$|리$|가$|로$|길$|도$|번길$|[0-9]$/,
        )
      ) {
        searchAddrToCoord(inputKeyword)
      } else {
        alert('지하철역 혹은 주소를 입력해주세요')
      }
    },
    [searchAddrToCoord, map],
  )

  const handleEnter = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        handleSearch(e.target.value)
      }
    },
    [handleSearch],
  )

  const handleSearchButton = useCallback(() => {
    handleSearch(keyword)
  }, [handleSearch, keyword])

  return (
    <Flex id="searchBox" direction="column" align="center" css={ContainerStyle}>
      <Flex
        direction="row"
        justify="start"
        align="center"
        style={{
          gap: '10px',
          height: '60px',
          width: '100%',
          boxShadow: '2px 2px 2px 0px rgba(198, 198, 198, 0.10)',
          padding: '0 10px',
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
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            width: '80%',
          }}
          autoComplete="off"
          onFocus={() => {
            setIsFocus(true)
            setOpenOverlay(false)
          }}
          onBlur={() => setTimeout(() => setIsFocus(false), 200)}
        />
        <Search
          right="25"
          top="25"
          handleSearchButton={handleSearchButton}
          setOpenOverlay={setOpenOverlay}
        />
      </Flex>
      {isFocus && <AutoKeyword keyword={keyword} setKeyword={setKeyword} />}
      <Spacing size={10} />
      <MainFilter
        formData={formData}
        setFormData={setFormData}
        setOpenOverlay={setOpenOverlay}
      />
      <Spacing size={10} />
      <SubFilter
        formData={formData}
        setFormData={setFormData}
        isBoxOpen={isBoxOpen}
        setIsBoxOpen={setIsBoxOpen}
        setOpenOverlay={setOpenOverlay}
      />
      {formData.isSubFilterBoxOpen ? (
        <Flex
          css={animation}
          onClick={() => {
            setOpenOverlay(false)
          }}
        >
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
  width: 375px;
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

export default SearchBox

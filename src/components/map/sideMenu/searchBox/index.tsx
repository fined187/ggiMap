import Flex from '@/components/shared/Flex'
import Input from '@/components/shared/Input'
import Spacing from '@/components/shared/Spacing'
import { Form } from '@/models/Form'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import MainFilter from '../filterBox/MainFilter'
import SubFilter from '../filterBox/SubFilter'
import DetailBox from '../filterBox/SubFilterDetail/DetailBox'
import { useNavermaps } from 'react-naver-maps'
import getSubway from '@/remote/map/subway/getSubway'
import Logo from '../../icons/Logo'
import Search from '../../icons/Search'

interface SearchBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  center: { lat: number; lng: number }
  setCenter: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>
}

export default function SearchBox({
  formData,
  setFormData,
  center,
  setCenter,
}: SearchBoxProps) {
  const [keyword, setKeyword] = useState('')
  const naverMaps = useNavermaps()
  const [isBoxOpen, setIsBoxOpen] = useState({
    finished: false,
    usage: false,
    lowPrice: false,
    price: false,
  })

  const searchAddrToCoord = useCallback(
    (address: string) => {
      if (naverMaps?.Service?.geocode !== undefined) {
        naverMaps?.Service?.geocode(
          {
            address,
          },
          (status: any, response: any) => {
            if (status === naverMaps?.Service?.Status?.ERROR) {
              alert('지하철 혹은 주소를 입력해주세요')
              return
            }
            const result = response.result.items[0]
            const { point } = result ?? { point: { x: 0, y: 0 } }
            const { x, y } = point
            setCenter({
              lat: Number(y),
              lng: Number(x),
            })
          },
        )
      }
    },
    [naverMaps, setCenter],
  )

  const handleKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [setKeyword, keyword],
  )

  const handleEnter = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (keyword.match(/역$/)) {
        try {
          const response = await getSubway(keyword)
          if (response.documents.length === 0) {
            alert('검색 결과가 없습니다.')
            return
          } else {
            const { x, y } = response.documents[0]
            setCenter({
              lat: Number(y),
              lng: Number(x),
            })
          }
        } catch (error) {
          console.error(error)
        }
      } else if (
        keyword.match(/시$/) ||
        keyword.match(/구$/) ||
        keyword.match(/동$/)
      ) {
        searchAddrToCoord(keyword)
      } else {
        alert('지하철역 혹은 주소를 입력해주세요')
      }
    }
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
          borderBottom: `1px solid ${colors.gray200}`,
          width: '100%',
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
        />
        <Search right="20" top="25" />
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
          <DetailBox
            formData={formData}
            setFormData={setFormData}
            isBoxOpen={isBoxOpen}
            setIsBoxOpen={setIsBoxOpen}
          />
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
  padding: 10px 20px 10px 20px;
  z-index: 10;
  background-color: white;
  width: 370px;
  min-height: 200px;
  max-height: 530px;
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

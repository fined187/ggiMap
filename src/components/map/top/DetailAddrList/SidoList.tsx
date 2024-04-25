import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
  juso: {
    sido: string
    gungu: string
    dong: string
  }
  setJuso: Dispatch<
    SetStateAction<{ sido: string; gungu: string; dong: string }>
  >
  range: number
  setRange: Dispatch<SetStateAction<number>>
}

export default function SidoList({ juso, setJuso, range, setRange }: Props) {
  const [sidoList, setSidoList] = useState<string[]>([])

  const handleClick = (sido: string) => {
    if (juso.sido === sido) {
      setRange(1)
      setJuso((prev) => {
        return {
          ...prev,
          sido,
        }
      })
    } else {
      setRange(1)
      setJuso((prev) => {
        return {
          ...prev,
          sido,
          gungu: '',
          dong: '',
        }
      })
    }
  }
  const handleGetSidoList = async () => {
    try {
      const response = await axios.get(`/ggi/api/location/sds`)
      setSidoList(response.data.data.sds)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleGetSidoList()
  }, [])
  return (
    <Flex direction="column">
      {Array.from(sidoList).map(
        (_, index) =>
          index % 3 === 0 && (
            <Flex direction="row" key={index}>
              {Array.from(sidoList)
                .slice(index, index + 3)
                .map((item, index) => (
                  <Flex
                    direction="row"
                    key={index}
                    css={BoxStyle}
                    style={{
                      backgroundColor: juso.sido === item ? '#F0F0FF' : 'white',
                      border:
                        juso.sido === item
                          ? '1px solid #332EFC'
                          : '1px solid #9d9999',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleClick(item)}
                  >
                    <Text
                      style={{
                        color: juso.sido === item ? '#332EFC' : '#000001',
                      }}
                    >
                      {item}
                    </Text>
                  </Flex>
                ))}
            </Flex>
          ),
      )}
    </Flex>
  )
}

const BoxStyle = css`
  display: flex;
  width: 110px;
  height: 36px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

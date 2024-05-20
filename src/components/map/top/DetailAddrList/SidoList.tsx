import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import axios from 'axios'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'

interface Props {
  bottomJuso: {
    sido: string
    gungu: string
    dong: string
  }
  setBottomJuso: Dispatch<
    SetStateAction<{
      sido: string
      gungu: string
      dong: string
    }>
  >
  range: number
  setRange: Dispatch<SetStateAction<number>>
  selectedIndex: number | null
  setSelectedIndex: Dispatch<SetStateAction<number | null>>
}

export default function SidoList({
  bottomJuso,
  setBottomJuso,
  range,
  setRange,
  selectedIndex,
  setSelectedIndex,
}: Props) {
  const [sidoList, setSidoList] = useState<string[]>([])

  const handleClick = useCallback(
    (sido: string, actualIndex: number) => {
      setSelectedIndex(actualIndex)
      if (bottomJuso.sido === sido) {
        setRange(1)
        setBottomJuso((prev) => {
          return {
            ...prev,
            sido,
          }
        })
      } else {
        setRange(1)
        setBottomJuso((prev) => {
          return {
            ...prev,
            sido,
            gungu: '',
            dong: '',
          }
        })
      }
    },
    [bottomJuso, setBottomJuso, setRange, setSelectedIndex],
  )
  const handleGetSidoList = async () => {
    try {
      const response = await axios.get(`/ggi/api/location/sds`)
      setSidoList(response.data.data.sds)
      setSidoList((prev) => {
        return [...prev, ' ']
      })
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
                .map((item, subIndex) => {
                  const actualIndex = index + subIndex
                  const isSelected = bottomJuso.sido === item
                  const borderColor = isSelected ? '#332EFC' : '#E5E5E5'
                  const shouldHighlightTop =
                    selectedIndex != null &&
                    (actualIndex === selectedIndex ||
                      actualIndex === selectedIndex + 3)
                  return (
                    <Flex
                      direction="row"
                      key={actualIndex}
                      css={BoxStyle}
                      style={{
                        backgroundColor: isSelected ? '#F0F0FF' : 'white',
                        borderTop: shouldHighlightTop
                          ? '1px solid #332EFC'
                          : '1px solid #E5E5E5',
                        borderRight:
                          sidoList[Math.ceil(sidoList.length / 3) * 3 - 1] ===
                            ' ' &&
                          actualIndex === Math.ceil(sidoList.length / 3) * 3 - 1
                            ? ''
                            : bottomJuso.sido === item
                            ? '1px solid #332EFC'
                            : actualIndex % 3 === 2
                            ? '1px solid #E5E5E5'
                            : actualIndex % 3 === 1
                            ? '1px solid #E5E5E5'
                            : '',
                        borderLeft:
                          subIndex % 3 === 0
                            ? bottomJuso.sido === item
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : subIndex % 3 === 1
                            ? bottomJuso.sido === item
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : subIndex % 3 === 2
                            ? bottomJuso.sido === item
                              ? '1px solid #332EFC'
                              : ''
                            : '',
                        borderBottom:
                          item ===
                          sidoList[
                            Math.ceil(sidoList.length / 3) * 3 - 3 + subIndex
                          ]
                            ? sidoList[
                                Math.ceil(sidoList.length / 3) * 3 -
                                  3 +
                                  subIndex
                              ] === ' '
                              ? ''
                              : bottomJuso.sido === item
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : '',
                        cursor: item === ' ' ? 'default' : 'pointer',
                      }}
                      onClick={() => {
                        if (item !== ' ') {
                          handleClick(item, actualIndex)
                        }
                        return
                      }}
                    >
                      <Text
                        style={{
                          color:
                            bottomJuso.sido === item ? '#332EFC' : '#000001',
                        }}
                      >
                        {item}
                      </Text>
                    </Flex>
                  )
                })}
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

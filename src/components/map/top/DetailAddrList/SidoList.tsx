import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { BottomJusoProps } from '@/models/Juso'
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
  bottomJuso: BottomJusoProps
  setBottomJuso: Dispatch<SetStateAction<BottomJusoProps>>
  setRange: Dispatch<SetStateAction<number>>
  selectedIndex: number | null
  setSelectedIndex: Dispatch<SetStateAction<number | null>>
  addrToCenter: (addr: string) => void
}

export default function SidoList({
  bottomJuso,
  setBottomJuso,
  setRange,
  selectedIndex,
  setSelectedIndex,
  addrToCenter,
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
      if (response.data.success === true) {
        setSidoList(response.data.data.sds)
        setSidoList((prev) => {
          return [...prev, ' ']
        })
        if (bottomJuso.sido === '') {
          setSelectedIndex(null)
        } else if (sidoList.indexOf(bottomJuso.sido) > 0) {
          setSelectedIndex(sidoList.indexOf(bottomJuso.sido))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleGetSidoList()
  }, [])

  useEffect(() => {
    if (sidoList.length > 0) {
      const index = sidoList.indexOf(bottomJuso.sido)
      setSelectedIndex(index !== -1 ? index : null)
    }
  }, [bottomJuso.sido, setSelectedIndex, sidoList])
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
                  const shouldHighlightTop =
                    selectedIndex != null
                      ? actualIndex === selectedIndex ||
                        actualIndex === selectedIndex + 3
                      : false
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
                          addrToCenter(item)
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

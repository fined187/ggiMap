import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { css } from '@emotion/react'
import axios from 'axios'

interface DongListProps {
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
  selectedDongIndex: number | null
  setSelectedDongIndex: Dispatch<SetStateAction<number | null>>
}

function DongList({
  bottomJuso,
  setBottomJuso,
  selectedDongIndex,
  setSelectedDongIndex,
}: DongListProps) {
  const [dongList, setDongList] = useState<string[]>([])
  const handleGetDong = async (siName: string, guName: string) => {
    try {
      const response = await axios.get(
        `/ggi/api/location/${siName}/${guName}/umds`,
      )
      setDongList(response.data.data.umds)
      const addArray =
        response.data.data.umds.length % 3 === 0
          ? null
          : Array(3 - (response.data.data.umds.length % 3)).fill(' ')
      setDongList((prev) => {
        return [...prev, ...(addArray === null ? [] : addArray)]
      })
    } catch (error) {
      console.error(error)
    }
  }
  const handleClick = (dong: string, actualIndex: number) => {
    setSelectedDongIndex(actualIndex)
    setBottomJuso({
      ...bottomJuso,
      dong: dong,
    })
  }

  useEffect(() => {
    handleGetDong(bottomJuso.sido, bottomJuso.gungu)
  }, [bottomJuso.sido, bottomJuso.gungu])

  return (
    <Flex
      direction="column"
      style={{
        overflowY: 'auto',
        position: 'relative',
        minHeight: '100px',
        maxHeight: '200px',
      }}
    >
      {Array.from(dongList).map(
        (_, index) =>
          index % 3 === 0 && (
            <Flex direction="row" key={index}>
              {Array.from(dongList)
                .slice(index, index + 3)
                .map((item, subIndex) => {
                  const actualIndex = index + subIndex
                  const isSelected = bottomJuso.gungu === item
                  const borderColor = isSelected ? '#332EFC' : '#E5E5E5'
                  const shouldHighlightTop =
                    selectedDongIndex != null &&
                    (actualIndex === selectedDongIndex ||
                      actualIndex === selectedDongIndex + 3)
                  return (
                    item !== '' && (
                      <Flex
                        direction="row"
                        key={actualIndex}
                        css={BoxStyle}
                        style={{
                          backgroundColor:
                            bottomJuso.dong === item ? '#F0F0FF' : 'white',
                          borderTop: shouldHighlightTop
                            ? `1px solid #332EFC`
                            : '1px solid #E5E5E5',
                          borderBottom:
                            item ===
                            dongList[
                              Math.ceil(dongList.length / 3) * 3 - 3 + subIndex
                            ]
                              ? dongList[
                                  Math.ceil(dongList.length / 3) * 3 -
                                    3 +
                                    subIndex
                                ] === ' '
                                ? ''
                                : bottomJuso.dong === item
                                ? '1px solid #332EFC'
                                : '1px solid #E5E5E5'
                              : '',
                          borderRight:
                            dongList[Math.ceil(dongList.length / 3) * 3 - 1] ===
                              ' ' &&
                            actualIndex ===
                              Math.ceil(dongList.length / 3) * 3 - 1
                              ? ''
                              : bottomJuso.dong === item
                              ? '1px solid #332EFC'
                              : actualIndex % 3 === 2 && item !== ' '
                              ? '1px solid #E5E5E5'
                              : actualIndex % 3 === 1 && item !== ' '
                              ? '1px solid #E5E5E5'
                              : '',
                          borderLeft:
                            subIndex % 3 === 0
                              ? bottomJuso.dong === item
                                ? '1px solid #332EFC'
                                : '1px solid #E5E5E5'
                              : subIndex % 3 === 1
                              ? bottomJuso.dong === item
                                ? '1px solid #332EFC'
                                : '1px solid #E5E5E5'
                              : subIndex % 3 === 2
                              ? bottomJuso.dong === item
                                ? '1px solid #332EFC'
                                : ''
                              : '',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (item === ' ') return
                          handleClick(item, actualIndex)
                        }}
                      >
                        <Text
                          style={{
                            color:
                              bottomJuso.dong === item ? '#332EFC' : '#000001',
                          }}
                        >
                          {item}
                        </Text>
                      </Flex>
                    )
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

export default DongList

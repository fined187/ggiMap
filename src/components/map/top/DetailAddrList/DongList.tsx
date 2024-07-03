import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { css } from '@emotion/react'
import axios from 'axios'
import { DongProps } from '@/models/Juso'
import { useRecoilState } from 'recoil'
import { jusoAtom } from '@/store/atom/map'

interface DongListProps {
  selectedDongIndex: number | null
  setSelectedDongIndex: Dispatch<SetStateAction<number | null>>
  addrToCenter: (x: number, y: number) => void
  setOpenCursor: Dispatch<SetStateAction<boolean>>
}

function DongList({
  selectedDongIndex,
  setSelectedDongIndex,
  addrToCenter,
  setOpenCursor,
}: DongListProps) {
  const [juso, setJuso] = useRecoilState(jusoAtom)
  const [dongList, setDongList] = useState<DongProps[]>([
    {
      umd: ' ',
      x: 0,
      y: 0,
    },
  ])
  const handleGetDong = async (siName: string, guName: string) => {
    try {
      const response = await axios.get(
        `/ggi/api/location/${siName}/${guName}/umds`,
      )
      const addArray =
        response.data.data.umds.length % 3 === 0
          ? null
          : Array(3 - (response.data.data.umds.length % 3)).fill({
              umd: ' ',
              x: 0,
              y: 0,
            })
      setDongList([
        ...response.data.data.umds,
        ...(addArray === null ? [] : addArray),
      ])
    } catch (error) {
      console.error(error)
    }
  }
  const handleClick = (dong: string, actualIndex: number) => {
    setSelectedDongIndex(actualIndex)
    setJuso((prev) => {
      return {
        ...prev,
        bottomDong: dong,
      }
    })
    setOpenCursor(false)
  }

  useEffect(() => {
    handleGetDong(juso.bottomSido, juso.bottomGungu)
  }, [juso.bottomSido, juso.bottomGungu])

  useEffect(() => {
    if (dongList.length > 0) {
      const index = dongList.map((item) => item.umd).indexOf(juso.bottomDong)
      setSelectedDongIndex(index !== -1 ? index : null)
    }
  }, [juso.bottomDong, dongList, setSelectedDongIndex])

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
                  const shouldHighlightTop =
                    selectedDongIndex != null &&
                    (actualIndex === selectedDongIndex ||
                      actualIndex === selectedDongIndex + 3)
                  return (
                    item.umd !== '' && (
                      <Flex
                        direction="row"
                        key={actualIndex}
                        css={BoxStyle}
                        style={{
                          backgroundColor:
                            juso.bottomDong === item.umd ? '#F0F0FF' : 'white',
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
                                ]?.umd === ' '
                                ? ''
                                : juso.bottomDong === item.umd
                                ? '1px solid #332EFC'
                                : '1px solid #E5E5E5'
                              : '',
                          borderRight:
                            dongList[Math.ceil(dongList.length / 3) * 3 - 1]
                              ?.umd === ' ' &&
                            actualIndex ===
                              Math.ceil(dongList.length / 3) * 3 - 1
                              ? ''
                              : juso.bottomDong === item.umd
                              ? '1px solid #332EFC'
                              : actualIndex % 3 === 2 && item.umd !== ' '
                              ? '1px solid #E5E5E5'
                              : actualIndex % 3 === 1 && item.umd !== ' '
                              ? '1px solid #E5E5E5'
                              : '',
                          borderLeft:
                            subIndex % 3 === 0
                              ? juso.bottomDong === item.umd
                                ? '1px solid #332EFC'
                                : '1px solid #E5E5E5'
                              : subIndex % 3 === 1
                              ? juso.bottomDong === item.umd
                                ? '1px solid #332EFC'
                                : '1px solid #E5E5E5'
                              : subIndex % 3 === 2
                              ? juso.bottomDong === item.umd
                                ? '1px solid #332EFC'
                                : ''
                              : '',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (item.umd === ' ') return
                          handleClick(item.umd, actualIndex)
                          addrToCenter(item.x, item.y)
                        }}
                      >
                        <Text
                          style={{
                            color:
                              juso.bottomDong === item.umd
                                ? '#332EFC'
                                : '#000001',
                          }}
                        >
                          {item.umd}
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

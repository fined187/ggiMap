import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { SidoProps, jusoProps } from '@/models/Juso'
import { jusoAtom } from '@/store/atom/map'
import { css } from '@emotion/react'
import axios from 'axios'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useRecoilState } from 'recoil'

interface Props {
  setRange: Dispatch<SetStateAction<number>>
  selectedIndex: number | null
  setSelectedIndex: Dispatch<SetStateAction<number | null>>
  addrToCenter: (x: number, y: number) => void
}

const COUNT_PER_ROW = 3

export default function SidoList({
  setRange,
  selectedIndex,
  setSelectedIndex,
  addrToCenter,
}: Props) {
  const [juso, setJuso] = useRecoilState<jusoProps>(jusoAtom)
  const [sidoList, setSidoList] = useState<SidoProps[]>([
    {
      sd: '',
      x: 0,
      y: 0,
    },
  ])

  const handleClick = useCallback(
    (sido: string, actualIndex: number) => {
      setSelectedIndex(actualIndex)
      setJuso((prev) => ({
        ...prev,
        bottomSido: sido,
        bottomGungu: sido === juso.bottomSido ? prev.bottomGungu : '',
        bottomDong: sido === juso.bottomSido ? prev.bottomDong : '',
      }))
      setRange(1)
    },
    [setRange, setSelectedIndex, setJuso, juso.bottomSido],
  )

  const fetchSidoList = useCallback(async () => {
    try {
      const response = await axios.get(`/ggi/api/location/sds`)
      if (response.data.success) {
        const fetchedList = [...response.data.data.sds, { sd: ' ', x: 0, y: 0 }]
        setSidoList(fetchedList)
        const index = fetchedList.findIndex(
          (item) => item.sd === juso.bottomSido,
        )
        setSelectedIndex(index !== -1 ? index : null)
      }
    } catch (error) {
      console.error(error)
    }
  }, [juso.bottomSido, setSelectedIndex])

  useEffect(() => {
    fetchSidoList()
  }, [fetchSidoList])

  const getBorderColor = (
    actualIndex: number,
    subIndex: number,
    item: SidoProps,
    sidoList: SidoProps[],
  ) => {
    const isSelected = juso.bottomSido === item.sd
    const isLastColumn = actualIndex % COUNT_PER_ROW === COUNT_PER_ROW - 1
    const isEmpty = item.sd === ' '
    const isBottomRow =
      item ===
      sidoList[
        Math.ceil(sidoList.length / COUNT_PER_ROW) * COUNT_PER_ROW -
          COUNT_PER_ROW +
          subIndex
      ]

    return {
      borderTop:
        isSelected || actualIndex === selectedIndex
          ? '1px solid #332EFC'
          : '1px solid #E5E5E5',
      borderRight:
        isLastColumn && isEmpty
          ? ''
          : isSelected
          ? '1px solid #332EFC'
          : '1px solid #E5E5E5',
      borderLeft:
        subIndex === 0 || isSelected
          ? '1px solid #332EFC'
          : '1px solid #E5E5E5',
      borderBottom:
        isBottomRow && isEmpty
          ? ''
          : isSelected
          ? '1px solid #332EFC'
          : '1px solid #E5E5E5',
    }
  }

  return (
    <Flex direction="column">
      {sidoList.map(
        (_, index) =>
          index % COUNT_PER_ROW === 0 && (
            <Flex direction="row" key={index}>
              {sidoList
                .slice(index, index + COUNT_PER_ROW)
                .map((item, subIndex) => {
                  const actualIndex = index + subIndex
                  const isSelected = juso.bottomSido === item.sd
                  const shouldHighlightTop =
                    selectedIndex != null
                      ? actualIndex === selectedIndex ||
                        actualIndex === selectedIndex + COUNT_PER_ROW
                      : false
                  return (
                    <Flex
                      direction="row"
                      key={actualIndex}
                      css={boxStyle}
                      style={{
                        backgroundColor: isSelected ? '#F0F0FF' : 'white',
                        borderTop: shouldHighlightTop
                          ? '1px solid #332EFC'
                          : '1px solid #E5E5E5',
                        borderRight:
                          sidoList[
                            Math.ceil(sidoList.length / COUNT_PER_ROW) *
                              COUNT_PER_ROW -
                              1
                          ]?.sd === ' ' &&
                          actualIndex ===
                            Math.ceil(sidoList.length / COUNT_PER_ROW) *
                              COUNT_PER_ROW -
                              1
                            ? ''
                            : juso.bottomSido === item.sd
                            ? '1px solid #332EFC'
                            : actualIndex % COUNT_PER_ROW === 2
                            ? '1px solid #E5E5E5'
                            : actualIndex % COUNT_PER_ROW === 1
                            ? '1px solid #E5E5E5'
                            : '',
                        borderLeft:
                          subIndex % COUNT_PER_ROW === 0
                            ? juso.bottomSido === item.sd
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : subIndex % COUNT_PER_ROW === 1
                            ? juso.bottomSido === item.sd
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : subIndex % COUNT_PER_ROW === 2
                            ? juso.bottomSido === item.sd
                              ? '1px solid #332EFC'
                              : ''
                            : '',
                        borderBottom:
                          item ===
                          sidoList[
                            Math.ceil(sidoList.length / COUNT_PER_ROW) *
                              COUNT_PER_ROW -
                              COUNT_PER_ROW +
                              subIndex
                          ]
                            ? sidoList[
                                Math.ceil(sidoList.length / COUNT_PER_ROW) *
                                  COUNT_PER_ROW -
                                  COUNT_PER_ROW +
                                  subIndex
                              ]?.sd === ' '
                              ? ''
                              : juso.bottomSido === item.sd
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : '',
                        cursor: item.sd === ' ' ? 'default' : 'pointer',
                      }}
                      onClick={() => {
                        if (item.sd !== ' ') {
                          handleClick(item.sd, actualIndex)
                          addrToCenter(item.x, item.y)
                        }
                        return
                      }}
                    >
                      <Text
                        style={{
                          color:
                            juso.bottomSido === item.sd ? '#332EFC' : '#000001',
                        }}
                      >
                        {item.sd}
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

const boxStyle = css`
  display: flex;
  width: 110px;
  height: 36px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

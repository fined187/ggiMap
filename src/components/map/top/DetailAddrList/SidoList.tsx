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
      if (juso.bottomSido === sido) {
        setRange(1)
        setJuso((prev) => {
          return {
            ...prev,
            bottomSido: sido,
          }
        })
      } else {
        setRange(1)
        setJuso((prev) => {
          return {
            ...prev,
            bottomSido: sido,
            bottomGungu: '',
            bottomDong: '',
          }
        })
      }
    },
    [setRange, setSelectedIndex, setJuso, juso.bottomSido],
  )

  const handleGetSidoList = useCallback(async () => {
    try {
      const response = await axios.get(`/ggi/api/location/sds`)
      if (response.data.success === true) {
        setSidoList(response.data.data.sds)
        setSidoList((prev) => {
          return [...prev, { sd: ' ', x: 0, y: 0 }]
        })
        if (juso.bottomSido === '') {
          setSelectedIndex(null)
        } else if (
          sidoList.map((item) => item.sd).indexOf(juso.bottomSido) > 0
        ) {
          setSelectedIndex(
            sidoList.map((item) => item.sd).indexOf(juso.bottomSido),
          )
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [juso.bottomSido, setSelectedIndex, setSidoList])
  useEffect(() => {
    handleGetSidoList()
  }, [])

  useEffect(() => {
    if (sidoList.length > 0) {
      const index = sidoList.map((item) => item.sd).indexOf(juso.bottomSido)
      setSelectedIndex(index !== -1 ? index : null)
    }
  }, [juso.bottomSido, setSelectedIndex, sidoList])
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
                  const isSelected = juso.bottomSido === item.sd
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
                          sidoList[Math.ceil(sidoList.length / 3) * 3 - 1]
                            ?.sd === ' ' &&
                          actualIndex === Math.ceil(sidoList.length / 3) * 3 - 1
                            ? ''
                            : juso.bottomSido === item.sd
                            ? '1px solid #332EFC'
                            : actualIndex % 3 === 2
                            ? '1px solid #E5E5E5'
                            : actualIndex % 3 === 1
                            ? '1px solid #E5E5E5'
                            : '',
                        borderLeft:
                          subIndex % 3 === 0
                            ? juso.bottomSido === item.sd
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : subIndex % 3 === 1
                            ? juso.bottomSido === item.sd
                              ? '1px solid #332EFC'
                              : '1px solid #E5E5E5'
                            : subIndex % 3 === 2
                            ? juso.bottomSido === item.sd
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

const BoxStyle = css`
  display: flex;
  width: 110px;
  height: 36px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

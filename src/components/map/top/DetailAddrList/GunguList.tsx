import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import Text from '@/components/shared/Text'
import Spacing from '@/components/shared/Spacing'
import axios from 'axios'
import { GunguProps } from '@/models/Juso'
import { useRecoilState } from 'recoil'
import { jusoAtom } from '@/store/atom/map'

interface Props {
  selectedGunguIndex: number | null
  setSelectedGunguIndex: Dispatch<SetStateAction<number | null>>
  addrToCenter: (x: number, y: number) => void
  setRange: Dispatch<SetStateAction<number>>
}

export default function GunguList({
  selectedGunguIndex,
  setSelectedGunguIndex,
  addrToCenter,
  setRange,
}: Props) {
  const [juso, setJuso] = useRecoilState(jusoAtom)
  const [gunguList, setGunguList] = useState<GunguProps[]>([
    {
      sgg: '',
      x: 0,
      y: 0,
    },
  ])
  const handleGetGungu = async (siName: string) => {
    try {
      const response = await axios.get(`/ggi/api/location/${siName}/sggs`)
      if (response.data.success === true) {
        setGunguList(response.data.data.sggs)
        const addArray =
          response.data.data.sggs.length % 3 === 0
            ? null
            : Array(3 - (response.data.data.sggs.length % 3)).fill({
                sgg: ' ',
                x: 0,
                y: 0,
              })
        setGunguList((prev) => {
          return [...prev, ...(addArray === null ? [] : addArray)]
        })
        if (juso.bottomGungu === '') {
          setSelectedGunguIndex(null)
        } else if (
          gunguList.map((item) => item.sgg).indexOf(juso.bottomGungu)
        ) {
          setSelectedGunguIndex(
            gunguList.map((item) => item.sgg).indexOf(juso.bottomGungu),
          )
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = useCallback(
    (gungu: string, actualIndex: number) => {
      setRange(2)
      setSelectedGunguIndex(actualIndex)
      setJuso((prev) => {
        return {
          ...prev,
          bottomGungu: gungu,
          bottomDong: '',
        }
      })
    },
    [setJuso, setSelectedGunguIndex, setRange],
  )

  useEffect(() => {
    handleGetGungu(juso.bottomSido)
  }, [juso.bottomSido])

  useEffect(() => {
    if (gunguList.length > 0) {
      const index = gunguList.map((item) => item.sgg).indexOf(juso.bottomGungu)
      setSelectedGunguIndex(index !== -1 ? index : null)
    }
  }, [juso.bottomGungu, gunguList, setSelectedGunguIndex])
  return (
    <>
      <Flex direction="column" css={ContainerStyle}>
        {Array.from(gunguList).map(
          (_, index) =>
            index % 3 === 0 && (
              <Flex direction="row" key={index}>
                {Array.from(gunguList)
                  .slice(index, index + 3)
                  .map((item, subIndex) => {
                    const actualIndex = index + subIndex
                    const isSelected = juso.bottomGungu === item.sgg
                    const shouldHighlightTop =
                      selectedGunguIndex != null
                        ? actualIndex === selectedGunguIndex ||
                          actualIndex === selectedGunguIndex + 3
                        : false
                    return (
                      item.sgg !== '' && (
                        <Flex
                          direction="row"
                          key={actualIndex}
                          css={BoxStyle}
                          style={{
                            backgroundColor: isSelected ? '#F0F0FF' : 'white',
                            borderTop: shouldHighlightTop
                              ? `1px solid #332EFC`
                              : actualIndex < 3
                              ? item.sgg === ' '
                                ? ''
                                : '1px solid #E5E5E5'
                              : '1px solid #E5E5E5',
                            borderRight:
                              gunguList[Math.ceil(gunguList.length / 3) * 3 - 1]
                                ?.sgg === ' ' &&
                              actualIndex ===
                                Math.ceil(gunguList.length / 3) * 3 - 1
                                ? ''
                                : juso.bottomGungu === item.sgg
                                ? '1px solid #332EFC'
                                : actualIndex % 3 === 2 && item.sgg !== ' '
                                ? '1px solid #E5E5E5'
                                : actualIndex % 3 === 1 && item.sgg !== ' '
                                ? '1px solid #E5E5E5'
                                : '',
                            borderLeft:
                              subIndex % 3 === 0
                                ? juso.bottomGungu === item.sgg
                                  ? '1px solid #332EFC'
                                  : '1px solid #E5E5E5'
                                : subIndex % 3 === 1
                                ? juso.bottomGungu === item.sgg
                                  ? '1px solid #332EFC'
                                  : '1px solid #E5E5E5'
                                : subIndex % 3 === 2
                                ? juso.bottomGungu === item.sgg
                                  ? '1px solid #332EFC'
                                  : ''
                                : '',
                            borderBottom:
                              item ===
                              gunguList[
                                Math.ceil(gunguList.length / 3) * 3 -
                                  3 +
                                  subIndex
                              ]
                                ? gunguList[
                                    Math.ceil(gunguList.length / 3) * 3 -
                                      3 +
                                      subIndex
                                  ]?.sgg === ' '
                                  ? ''
                                  : juso.bottomGungu === item.sgg
                                  ? '1px solid #332EFC'
                                  : '1px solid #E5E5E5'
                                : '',
                            cursor: item.sgg === ' ' ? 'default' : 'pointer',
                          }}
                          onClick={() => {
                            if (item.sgg === ' ') return
                            handleClick(item.sgg, actualIndex)
                            addrToCenter(item.x, item.y)
                          }}
                        >
                          <Text
                            style={{
                              color:
                                juso.bottomGungu === item.sgg
                                  ? '#332EFC'
                                  : '#000001',
                            }}
                          >
                            {item.sgg}
                          </Text>
                        </Flex>
                      )
                    )
                  })}
              </Flex>
            ),
        )}
        <Spacing size={10} />
      </Flex>
    </>
  )
}

const ContainerStyle = css`
  overflow-y: auto;
  position: relative;
  min-height: 100px;
  max-height: 200px;
`

const BoxStyle = css`
  display: flex;
  width: 110px;
  height: 36px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

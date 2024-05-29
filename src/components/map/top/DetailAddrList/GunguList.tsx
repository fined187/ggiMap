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
import { BottomJusoProps } from '@/models/Juso'

interface Props {
  bottomJuso: BottomJusoProps
  setBottomJuso: Dispatch<SetStateAction<BottomJusoProps>>
  selectedGunguIndex: number | null
  setSelectedGunguIndex: Dispatch<SetStateAction<number | null>>
  addrToCenter: (addr: string) => void
}

export default function GunguList({
  bottomJuso,
  setBottomJuso,
  selectedGunguIndex,
  setSelectedGunguIndex,
  addrToCenter,
}: Props) {
  const [gunguList, setGunguList] = useState<string[]>([])
  const handleGetGungu = async (siName: string) => {
    try {
      const response = await axios.get(`/ggi/api/location/${siName}/sggs`)
      if (response.data.success === true) {
        setGunguList(response.data.data.sggs)
        const addArray =
          response.data.data.sggs.length % 3 === 0
            ? null
            : Array(3 - (response.data.data.sggs.length % 3)).fill(' ')
        setGunguList((prev) => {
          return [...prev, ...(addArray === null ? [] : addArray)]
        })
        if (bottomJuso.gungu === '') {
          setSelectedGunguIndex(null)
        } else if (gunguList.indexOf(bottomJuso.gungu) > 0) {
          setSelectedGunguIndex(gunguList.indexOf(bottomJuso.gungu))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = useCallback(
    (gungu: string, actualIndex: number) => {
      setSelectedGunguIndex(actualIndex)
      setBottomJuso((prev) => {
        return {
          ...prev,
          gungu,
        }
      })
    },
    [setBottomJuso, setSelectedGunguIndex],
  )

  useEffect(() => {
    handleGetGungu(bottomJuso.sido)
  }, [bottomJuso.sido])

  useEffect(() => {
    if (gunguList.length > 0) {
      const index = gunguList.indexOf(bottomJuso.gungu)
      setSelectedGunguIndex(index !== -1 ? index : null)
    }
  }, [bottomJuso.gungu, gunguList, setSelectedGunguIndex])
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
                    const isSelected = bottomJuso.gungu === item
                    const shouldHighlightTop =
                      selectedGunguIndex != null &&
                      (actualIndex === selectedGunguIndex ||
                        actualIndex === selectedGunguIndex + 3)
                    return (
                      item !== '' && (
                        <Flex
                          direction="row"
                          key={actualIndex}
                          css={BoxStyle}
                          style={{
                            backgroundColor: isSelected ? '#F0F0FF' : 'white',
                            borderTop: shouldHighlightTop
                              ? `1px solid #332EFC`
                              : actualIndex < 3
                              ? item === ' '
                                ? ''
                                : '1px solid #E5E5E5'
                              : '1px solid #E5E5E5',
                            borderRight:
                              gunguList[
                                Math.ceil(gunguList.length / 3) * 3 - 1
                              ] === ' ' &&
                              actualIndex ===
                                Math.ceil(gunguList.length / 3) * 3 - 1
                                ? ''
                                : bottomJuso.gungu === item
                                ? '1px solid #332EFC'
                                : actualIndex % 3 === 2 && item !== ' '
                                ? '1px solid #E5E5E5'
                                : actualIndex % 3 === 1 && item !== ' '
                                ? '1px solid #E5E5E5'
                                : '',
                            borderLeft:
                              subIndex % 3 === 0
                                ? bottomJuso.gungu === item
                                  ? '1px solid #332EFC'
                                  : '1px solid #E5E5E5'
                                : subIndex % 3 === 1
                                ? bottomJuso.gungu === item
                                  ? '1px solid #332EFC'
                                  : '1px solid #E5E5E5'
                                : subIndex % 3 === 2
                                ? bottomJuso.gungu === item
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
                                  ] === ' '
                                  ? ''
                                  : bottomJuso.gungu === item
                                  ? '1px solid #332EFC'
                                  : '1px solid #E5E5E5'
                                : '',
                            cursor: item === ' ' ? 'default' : 'pointer',
                          }}
                          onClick={() => {
                            if (item !== ' ' && addrToCenter) {
                              handleClick(item, actualIndex)
                              addrToCenter(bottomJuso.sido + ' ' + item)
                            }
                            return
                          }}
                        >
                          <Text
                            style={{
                              color:
                                bottomJuso.gungu === item
                                  ? '#332EFC'
                                  : '#000001',
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

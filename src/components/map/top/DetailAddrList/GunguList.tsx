import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import Text from '@/components/shared/Text'
import Spacing from '@/components/shared/Spacing'
import axios from 'axios'

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

export default function GunguList({ juso, setJuso, range, setRange }: Props) {
  const [gunguList, setGunguList] = useState<string[]>([])
  const handleGetGungu = async (siName: string) => {
    try {
      const response = await axios.get(`/ggi/api/location/${siName}/sggs`)
      setGunguList(response.data.data.sggs)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = (gungu: string) => {
    setRange(2)
    setJuso((prev) => {
      return {
        ...prev,
        gungu,
      }
    })
  }

  useEffect(() => {
    handleGetGungu(juso.sido)
  }, [juso.sido])
  return (
    <>
      <Flex
        direction="column"
        style={{
          overflowY: 'auto',
          position: 'relative',
          minHeight: '100px',
          maxHeight: '200px',
        }}
      >
        {Array.from(gunguList).map(
          (_, index) =>
            index % 3 === 0 && (
              <Flex direction="row" key={index}>
                {Array.from(gunguList)
                  .slice(index, index + 3)
                  .map(
                    (item, index) =>
                      item !== '' && (
                        <Flex
                          direction="row"
                          key={index}
                          css={BoxStyle}
                          style={{
                            backgroundColor:
                              juso.gungu === item ? '#F0F0FF' : 'white',
                            border:
                              juso.gungu === item
                                ? '1px solid #332EFC'
                                : '1px solid #9d9999',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleClick(item)}
                        >
                          <Text
                            style={{
                              color:
                                juso.gungu === item ? '#332EFC' : '#000001',
                            }}
                          >
                            {item}
                          </Text>
                        </Flex>
                      ),
                  )}
              </Flex>
            ),
        )}
        <Spacing size={10} />
      </Flex>
    </>
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

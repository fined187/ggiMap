import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import jusoAddr from '@/mock/Sigungu.json'
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
}

function DongList({ bottomJuso, setBottomJuso }: DongListProps) {
  const [dongList, setDongList] = useState<string[]>([])
  const handleGetDong = async (siName: string, guName: string) => {
    try {
      const response = await axios.get(
        `/ggi/api/location/${siName}/${guName}/umds`,
      )
      setDongList(response.data.data.umds)
    } catch (error) {
      console.error(error)
    }
  }
  const handleClick = (dong: string) => {
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
                .map(
                  (item, index) =>
                    item !== '' && (
                      <Flex
                        direction="row"
                        key={index}
                        css={BoxStyle}
                        style={{
                          backgroundColor:
                            bottomJuso.dong === item ? '#F0F0FF' : 'white',
                          border:
                            bottomJuso.dong === item
                              ? '1px solid #332EFC'
                              : '1px solid #9d9999',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          handleClick(item)
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
                    ),
                )}
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

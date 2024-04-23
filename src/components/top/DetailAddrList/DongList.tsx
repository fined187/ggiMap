import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { Dispatch, SetStateAction } from 'react'
import jusoAddr from '@/mock/Sigungu.json'
import { css } from '@emotion/react'

interface DongListProps {
  juso: {
    sido: string
    gungu: string
    dong: string
  }
  setJuso: Dispatch<
    SetStateAction<{ sido: string; gungu: string; dong: string }>
  >
}

function DongList({ juso, setJuso }: DongListProps) {
  const handleGetDong = (siName: string) => {
    if (juso.gungu.match(/시$/)) {
      return new Set(
        jusoAddr
          .filter((item) => item.SiName === siName)
          .map((item) => item.DongName)
          .filter((item) => item !== ''),
      )
    } else if (juso.gungu.match(/군$/)) {
      return new Set(
        jusoAddr
          .filter((item) => item.SiName === siName)
          .map((item) => item.DongName)
          .filter((item) => item !== ''),
      )
    } else {
      return new Set(
        jusoAddr
          .filter((item) => item.SiName === siName)
          .map((item) => item.SiName)
          .filter(
            (item, index, self) =>
              self.indexOf(item) === index && item !== '' && item !== '0',
          ),
      )
    }
  }
  const handleClick = (dong: string) => {
    setJuso({
      ...juso,
      dong: dong,
    })
  }
  console.log(handleGetDong(juso.gungu ?? ''))
  console.log(juso.gungu)
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
      {Array.from(handleGetDong(juso.gungu)).map(
        (_, index) =>
          index % 3 === 0 && (
            <Flex direction="row" key={index}>
              {Array.from(handleGetDong(juso.gungu))
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
                            juso.dong === item ? '#F0F0FF' : 'white',
                          border:
                            juso.dong === item
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
                            color: juso.dong === item ? '#332EFC' : '#000001',
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

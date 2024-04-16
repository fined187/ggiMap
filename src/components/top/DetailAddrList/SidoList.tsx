import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import jusoAddr from '@/mock/Sigungu.json'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  juso: {
    sido: string
    gungu: string
    dong: string
  }
  setJuso: Dispatch<
    SetStateAction<{ sido: string; gungu: string; dong: string }>
  >
}

export default function SidoList({ juso, setJuso }: Props) {
  const sidoList = jusoAddr.map((item) => item.SiDoName)
  const sidoListSet = new Set(sidoList)

  const handleClick = (sido: string) => {
    if (juso.sido === sido) {
      setJuso((prev) => {
        return {
          ...prev,
          sido,
        }
      })
    } else {
      setJuso((prev) => {
        return {
          ...prev,
          sido,
          gungu: '',
          dong: '',
        }
      })
    }
  }
  return (
    <Flex direction="column">
      {Array.from(sidoListSet).map(
        (_, index) =>
          index % 3 === 0 && (
            <Flex direction="row" key={index}>
              {Array.from(sidoListSet)
                .slice(index, index + 3)
                .map((item, index) => (
                  <Flex
                    direction="row"
                    key={index}
                    css={BoxStyle}
                    style={{
                      backgroundColor: juso.sido === item ? '#F0F0FF' : 'white',
                      border:
                        juso.sido === item
                          ? '1px solid #332EFC'
                          : '1px solid #9d9999',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleClick(item)}
                  >
                    <Text
                      style={{
                        color: juso.sido === item ? '#332EFC' : '#000001',
                      }}
                    >
                      {item}
                    </Text>
                  </Flex>
                ))}
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

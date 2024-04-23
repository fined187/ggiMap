import { Dispatch, SetStateAction } from 'react'
import jusoAddr from '@/mock/Sigungu.json'
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import Text from '@/components/shared/Text'
import dynamic from 'next/dynamic'
import Spacing from '@/components/shared/Spacing'

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
  const handleGetGungu = (siName: string) => {
    if (juso.sido.match(/시$/)) {
      return new Set(
        jusoAddr
          .filter((item) => item.SiDoName === siName)
          .map((item) => item.GunGuName)
          .filter((item) => item !== ''),
      )
    } else {
      return new Set(
        jusoAddr
          .filter((item) => item.SiDoName === siName)
          .map((item) => item.SiName)
          .filter(
            (item, index, self) =>
              self.indexOf(item) === index && item !== '' && item !== '0',
          ),
      )
    }
  }

  const handleClick = (gungu: string) => {
    setJuso((prev) => {
      return {
        ...prev,
        gungu,
      }
    })
  }
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
        {Array.from(handleGetGungu(juso.sido)).map(
          (_, index) =>
            index % 3 === 0 && (
              <Flex direction="row" key={index}>
                {Array.from(handleGetGungu(juso.sido))
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

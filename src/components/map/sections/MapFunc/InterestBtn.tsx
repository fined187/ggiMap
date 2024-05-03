import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Dispatch, SetStateAction } from 'react'

interface MapTypeProps {
  clickedMapType: {
    basic: boolean
    terrain: boolean
    satellite: boolean
    cadastral: boolean
    interest: boolean
    roadView: boolean
    current: boolean
    distance: boolean
    area: boolean
  }
  setClickedMapType: Dispatch<
    SetStateAction<{
      basic: boolean
      terrain: boolean
      satellite: boolean
      cadastral: boolean
      interest: boolean
      roadView: boolean
      current: boolean
      distance: boolean
      area: boolean
    }>
  >
}

export default function InterestBtn({
  clickedMapType,
  setClickedMapType,
}: MapTypeProps) {
  window.close()
  return (
    <ContainerStyle
      interest={clickedMapType.interest}
      onClick={() => {
        setClickedMapType((prev) => {
          return {
            ...prev,
            interest: !prev.interest,
          }
        })
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
      >
        <path
          d="M9.00534 15.0933L1.79105 8.5586C-2.12977 4.63778 3.63383 -2.89018 9.00534 3.20015C14.3769 -2.89018 20.1143 4.66392 16.2196 8.5586L9.00534 15.0933Z"
          fill={clickedMapType.interest ? '#00A980' : 'white'}
          stroke={clickedMapType.interest ? 'white' : '#333333'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Text
        style={{
          color: clickedMapType.interest ? 'white' : '#333333',
        }}
        css={TextStyle}
      >
        관심물건
      </Text>
    </ContainerStyle>
  )
}

const ContainerStyle = styled.div<{ interest: boolean }>`
  width: 45px;
  height: 45px;
  background-color: ${({ interest }) => (interest ? '#00A980' : 'white')};
  border: 1px solid #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 5px;
`
const TextStyle = css`
  font-weight: bold;
  color: #000001;
  text-align: center;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.11px;
`

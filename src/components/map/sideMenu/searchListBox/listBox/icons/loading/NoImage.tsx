import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

interface NoImageProps {
  winYn: boolean
}

export default function NoImage({ winYn }: NoImageProps) {
  return (
    <ContainerStyle>
      {winYn ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="49"
          height="44"
          viewBox="0 0 49 44"
          fill="none"
        >
          <path
            d="M30.7891 28.7583C32.1252 27.2656 32.9376 25.2944 32.9376 23.1334C32.9376 18.4735 29.16 14.6959 24.5001 14.6959C22.3391 14.6959 20.3679 15.5083 18.8752 16.8444M23.0939 31.4542C19.4441 30.8418 16.5889 27.8864 16.1279 24.1874M2.00025 36.0708V13.0084C1.97852 11.1334 3.35433 7.38345 9.03146 7.38345H13.2502C16.6877 3.32097 26.0001 -2.3665 35.7501 7.38345H41.375C44.4816 7.38345 47 9.90184 47 13.0084V36.0708C47 40.5276 43.25 41.6778 41.375 41.6958H7.62522C4.51864 41.6958 2.00025 39.1774 2.00025 36.0708Z"
            stroke="#D6D6D6"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="49"
          height="44"
          viewBox="0 0 49 44"
          fill="none"
        >
          <path
            d="M2.00025 13.0084H3.50025C3.50025 13.0026 3.50022 12.9968 3.50015 12.991L2.00025 13.0084ZM13.2502 7.38345V8.88345C13.6914 8.88345 14.1103 8.68919 14.3953 8.35237L13.2502 7.38345ZM35.7501 7.38345L34.6894 8.44411C34.9707 8.72542 35.3522 8.88345 35.7501 8.88345V7.38345ZM47 36.0708L48.5 36.0708V36.0708H47ZM41.375 41.6958V43.1958C41.3798 43.1958 41.3846 43.1957 41.3894 43.1957L41.375 41.6958ZM29.6714 27.758C29.119 28.3753 29.1715 29.3236 29.7888 29.876C30.4061 30.4285 31.3544 30.376 31.9068 29.7587L29.6714 27.758ZM17.8748 15.7267C17.2575 16.2791 17.205 17.2274 17.7575 17.8447C18.3099 18.462 19.2582 18.5145 19.8755 17.9621L17.8748 15.7267ZM22.8457 32.9335C23.6627 33.0706 24.4361 32.5194 24.5732 31.7023C24.7103 30.8853 24.1591 30.1119 23.3421 29.9748L22.8457 32.9335ZM17.6164 24.0019C17.5139 23.1799 16.7644 22.5965 15.9424 22.699C15.1203 22.8014 14.5369 23.5509 14.6394 24.3729L17.6164 24.0019ZM3.50025 36.0708V13.0084H0.500252V36.0708H3.50025ZM9.03146 8.88345H13.2502V5.88345H9.03146V8.88345ZM35.7501 8.88345H41.375V5.88345H35.7501V8.88345ZM41.375 8.88345C43.6532 8.88345 45.5 10.7303 45.5 13.0084H48.5C48.5 9.07341 45.31 5.88345 41.375 5.88345V8.88345ZM7.62522 40.1958C5.34706 40.1958 3.50025 38.349 3.50025 36.0708H0.500252C0.500252 40.0058 3.69021 43.1958 7.62522 43.1958V40.1958ZM24.5001 16.1959C28.3316 16.1959 31.4376 19.3019 31.4376 23.1334H34.4376C34.4376 17.6451 29.9884 13.1959 24.5001 13.1959V16.1959ZM41.375 40.1958H7.62522V43.1958H41.375V40.1958ZM31.4376 23.1334C31.4376 24.9111 30.7709 26.5296 29.6714 27.758L31.9068 29.7587C33.4795 28.0016 34.4376 25.6776 34.4376 23.1334H31.4376ZM19.8755 17.9621C21.1039 16.8626 22.7224 16.1959 24.5001 16.1959V13.1959C21.9559 13.1959 19.6319 14.154 17.8748 15.7267L19.8755 17.9621ZM23.3421 29.9748C20.3435 29.4718 17.995 27.0401 17.6164 24.0019L14.6394 24.3729C15.1827 28.7326 18.5447 32.2119 22.8457 32.9335L23.3421 29.9748ZM14.3953 8.35237C15.9467 6.51887 18.8437 4.31563 22.3969 3.68038C25.8452 3.0639 30.1275 3.88221 34.6894 8.44411L36.8107 6.32279C31.6227 1.13474 26.3738 -0.0781839 21.869 0.727203C17.4691 1.51382 13.9912 4.18555 12.1051 6.41454L14.3953 8.35237ZM3.50015 12.991C3.49302 12.3759 3.72883 11.3492 4.49553 10.4943C5.21941 9.68703 6.55102 8.88345 9.03146 8.88345V5.88345C5.83478 5.88345 3.63991 6.95486 2.26204 8.49137C0.926986 9.98014 0.485749 11.7659 0.500353 13.0258L3.50015 12.991ZM45.5 13.0084V36.0708H48.5V13.0084H45.5ZM41.3894 43.1957C42.5645 43.1844 44.2924 42.8309 45.7692 41.7636C47.321 40.6421 48.5 38.7933 48.5 36.0708L45.5 36.0708C45.5 37.805 44.804 38.7597 44.012 39.3321C43.1452 39.9585 42.0606 40.1891 41.3606 40.1958L41.3894 43.1957Z"
            fill="#D6D6D6"
          />
        </svg>
      )}
      <Text css={TextStyle}>{winYn ? 'No Image' : '취재중 입니다'}</Text>
    </ContainerStyle>
  )
}

const ContainerStyle = styled.div`
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border-radius: 6px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 180px;
  height: 135px;
  object-fit: cover;
  border-radius: 4px;
`
const TextStyle = css`
  color: #d6d6d6;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`

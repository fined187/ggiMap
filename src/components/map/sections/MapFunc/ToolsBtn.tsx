import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Dispatch, SetStateAction } from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { NaverMap } from '@/models/Map'

interface ToolsBtnProps {
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

export default function ToolsBtn({
  clickedMapType,
  setClickedMapType,
}: ToolsBtnProps) {
  const { data: map } = useSWR(MAP_KEY)
  // 지도 내 거리재기 함수
  const startMode = (mode: string) => {
    if (!mode) return
    if (mode === 'distance') {
    } else if (mode === 'area') {
    }
  }

  const startDistance = () => {
    if (map) {
      const distanceListeners = [
        naver.maps.Event.addListener(map, 'click', (e) => {
          console.log(e.coord)
        }),
      ]
    }
  }

  const onClickDistance = (e: any) => {}
  return (
    <Flex css={ContainerStyle}>
      <Distance
        distance={clickedMapType.distance}
        onClick={() => {
          setClickedMapType((prev) => {
            return {
              ...prev,
              distance: !prev.distance,
            }
          })
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.92578 6.62109L8.04729 4.49959"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M1.60547 6.54688L14.0303 18.9718"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.84766 2.30469L18.2725 14.7296"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.60156 9.29688L10.7231 7.17537"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.2773 11.9766L13.3989 9.85506"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.9531 14.6523L16.0746 12.5308"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M1.79688 6.73828L6.03989 2.49527"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
            />
            <path
              d="M13.8398 18.7812L18.0829 14.5382"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
            />
          </svg>
        </div>
        <TextStyle distance={clickedMapType.distance}>거리</TextStyle>
      </Distance>
      <Area
        area={clickedMapType.area}
        onClick={() => {
          setClickedMapType((prev) => {
            return {
              ...prev,
              area: !prev.area,
            }
          })
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <rect
              x="3.5"
              y="3.5"
              width="13"
              height="13"
              stroke={`${clickedMapType.area ? 'white' : '#000001'}`}
            />
            <rect
              x="2.5"
              y="2.5"
              width="3"
              height="3"
              rx="1.5"
              fill={`${clickedMapType.area ? 'white' : '#000001'}`}
              stroke={`${clickedMapType.area ? 'white' : '#000001'}`}
            />
            <rect
              x="14.5"
              y="2.5"
              width="3"
              height="3"
              rx="1.5"
              fill={`${clickedMapType.area ? 'white' : '#000001'}`}
              stroke={`${clickedMapType.area ? 'white' : '#000001'}`}
            />
            <rect
              x="2.5"
              y="14.5"
              width="3"
              height="3"
              rx="1.5"
              fill={`${clickedMapType.area ? 'white' : '#000001'}`}
              stroke={`${clickedMapType.area ? 'white' : '#000001'}`}
            />
            <rect
              x="14.5"
              y="14.5"
              width="3"
              height="3"
              rx="1.5"
              fill={`${clickedMapType.area ? 'white' : '#000001'}`}
              stroke={`${clickedMapType.area ? 'white' : '#000001'}`}
            />
          </svg>
        </div>
        <AreaTextStyle area={clickedMapType.area}>면적</AreaTextStyle>
      </Area>
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  width: 44px;
  height: 88px;
  flex-direction: column;
  align-items: center;
  border-radius: 4px 4px 4px 4px;
  border: 0.5px solid #000001;
  background: #fbfbfb;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
`
const Distance = styled.div<{ distance: boolean }>`
  display: flex;
  width: 42px;
  height: 44px;
  padding: 4px 0px;
  align-items: center;
  border-radius: 4px 4px 0px 0px;
  flex-direction: column;
  border-bottom: 0.5px solid #000001;
  background: ${({ distance }) => (distance ? '#DC4798' : 'white')};
  cursor: pointer;
`
const TextStyle = styled.span<{ distance: boolean }>`
  color: ${({ distance }) => (distance ? 'white' : '#000001')};
  text-align: center;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.11px;
`

const Area = styled.div<{ area: boolean }>`
  display: flex;
  width: 42px;
  height: 44px;
  padding: 4px 0px;
  flex-direction: column;
  align-items: center;
  border-radius: 0px 0px 4px 4px;
  background: ${({ area }) => (area ? '#DC4798' : 'white')};
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`
const AreaTextStyle = styled.span<{ area: boolean }>`
  color: ${({ area }) => (area ? 'white' : '#000001')};
  text-align: center;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.11px;
`

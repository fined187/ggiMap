import Interest from '@/components/map/icons/Interest'
import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { MapItems } from '@/models/MapItem'
import { authInfo } from '@/store/atom/auth'
import useNum2Han from '@/utils/useNum2Han'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import useSWR from 'swr'

function KwForm({ item, index }: { item: MapItems; index: number }) {
  const { data: map } = useSWR(MAP_KEY)
  const [isBlinking, setIsBlinking] = useState(false)
  const [auth, setAuth] = useRecoilState(authInfo)
  const [blinkingInterval, setBlinkingInterval] = useState<
    NodeJS.Timeout | null | number
  >(null)
  const [marker, setMarker] = useState<null | naver.maps.Marker>(null)

  const createMarker = useCallback((lat: number, lng: number) => {
    if (map) {
      if (marker) {
        marker.setPosition(new naver.maps.LatLng(lat, lng))
        marker.setMap(map)
      } else {
        const newMarker = new naver.maps.Marker({
          position: new naver.maps.LatLng(lat, lng),
          map: map,
          icon: {
            content: `<div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="15.75" fill="#3C3C3C" fill-opacity="0.25" stroke="#D9D9D9" stroke-width="0.5"/>
                            <circle cx="16.5" cy="15.5" r="7.25" fill="#3C3C3C" stroke="#D9D9D9" stroke-width="0.5"/>
                        </svg>
                    </div>`,
          },
        })
        setMarker(newMarker)
        setIsBlinking(true)
        setBlinkingInterval(
          setInterval(() => {
            if (newMarker.getMap()) {
              newMarker.setMap(null)
            } else {
              newMarker.setMap(map)
            }
          }, 500),
        )
      }
    }
  }, [])

  const removeMarker = useCallback(() => {
    if (marker) {
      marker.setMap(null)
    }
    setIsBlinking(false)
    if (blinkingInterval) {
      clearInterval(blinkingInterval as number)
    }
  }, [marker, blinkingInterval])

  useEffect(() => {
    return () => {
      removeMarker()
    }
  }, [])
  return (
    <div
      onMouseOver={() => {
        const lat = item?.y ?? 0
        const lng = item?.x ?? 0
        createMarker(lat, lng)
      }}
      onMouseOut={() => {
        removeMarker()
      }}
    >
      <Flex
        direction="column"
        css={ContainerStyle}
        style={{
          borderTop: `${index === 0 ? '' : '0.5px solid #e0e0e0 '}`,
          cursor: 'pointer',
        }}
      >
        <ListRow
          left={<LeftTextStyle color={'#00926F'}>{'예정'}</LeftTextStyle>}
          contents={<LeftTextStyle color="#000">{item.caseNo}</LeftTextStyle>}
          right={
            <Flex
              onClick={() => {
                window.open(
                  `http://localhost:3000/interest?type=${item.type}&id=${item.id}&token=${auth.token}`,
                  '_blank',
                  'width=800, height=800',
                )
              }}
            >
              <Interest interest={item.interest ?? ''} />
            </Flex>
          }
          style={ListLeftStyle}
        />
        <Flex
          direction="column"
          style={{
            width: '90%',
            position: 'absolute',
            top: 60,
          }}
        >
          <Text css={TextStyle}>청구액</Text>
          <Text css={ClaimStyle}>{`${useNum2Han(item.claim)}`}</Text>
          <Spacing size={10} />
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <Text css={TextStyle}>현재상태</Text>
            <Text
              css={ClaimStyle}
              style={{
                fontSize: '14px',
              }}
            >{`대기`}</Text>
          </Flex>
          <Flex
            direction="row"
            justify="start"
            align="center"
            style={{
              display: 'flex',
              gap: '5px',
            }}
          >
            <Text css={TextStyle}>경매개시일</Text>
            <Text
              css={ClaimStyle}
              style={{
                fontSize: '14px',
              }}
            >
              {item.startDate}
            </Text>
            <Spacing direction="horizontal" size={5} />
            <Text css={TextStyle}>배당종기일</Text>
            <Text
              css={ClaimStyle}
              style={{
                fontSize: '14px',
              }}
            >
              {item.dividendDate}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}

const ContainerStyle = css`
  display: flex;
  position: relative;
  background: #fff;
  gap: 10px;
  padding: 10px 0 10px 0;
  width: 350px;
  height: 165px;
  flex-shrink: 0;
  left: 10px;
  &:hover {
    background: #f0f7ff;
    opacity: 0.5;
  }
`

const TextStyle = css`
  color: #676767;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.24px;
`

const ListLeftStyle = css`
  width: 95%;
  flex: 1;
`
const LeftTextStyle = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-family: SUIT;
  font-size: 16.5px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: -0.165px;
  height: 30px;
`

const ClaimStyle = css`
  color: #000;
  font-family: SUIT;
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
  line-height: 145%;
  letter-spacing: -0.34px;
`

export default KwForm

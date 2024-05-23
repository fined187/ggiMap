import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import styled from '@emotion/styled'
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import $ from 'jquery'

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

interface MeasureProps {
  map: naver.maps.Map
}

interface Coord {
  lat: number
  lng: number
}

interface Listener {
  remove?: () => void
}

export const Measure = ({
  clickedMapType,
  setClickedMapType,
}: ToolsBtnProps) => {
  const { data: map } = useSWR(MAP_KEY)
  const [mode, setMode] = useState('')
  const [polyline, setPolyline] = useState<naver.maps.Polyline | null>(null)
  const [guideline, setGuideline] = useState<naver.maps.Polyline | null>(null)
  const [lastDistance, setLastDistance] = useState<number | null>(null)
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([])

  const [distanceListener, setDistanceListener] = useState<
    naver.maps.MapEventListener[]
  >([])

  const fromMetersToText = useCallback((meters: number) => {
    meters = meters || 0
    const km = 1000
    let text: string | number = meters

    if (meters >= km) {
      text = parseFloat((meters / km).toFixed(1)) + 'km'
    } else {
      text = parseFloat(meters.toFixed(1)) + 'm'
    }
    return text
  }, [])

  const addMileStone = useCallback(
    (coord: Coord, text: string, css?: any) => {
      const marker = new naver.maps.Marker({
        position: coord,
        map: map,
        icon: {
          content:
            '<div style="display:inline-block;padding:5px;text-align:center;background-color:#fff;border:1px solid #000;"><span>' +
            text +
            '</span></div>',
          anchor: new naver.maps.Point(-5, -5),
        },
      })
      const markerElement = $(marker.getElement())

      if (css) {
        markerElement.css(css)
      } else {
        markerElement.css({
          fontSize: '11px',
          fontWeight: 'bold',
        })
      }
      setMarkers((prev) => {
        return [...prev, marker]
      })
    },
    [map],
  )

  const startMode = (mode: string) => {
    if (!mode) return
    if (mode === 'distance') {
      startDistance()
    } else if (mode === 'area') {
      startArea()
    }
  }
  const finishDistance = useCallback(() => {
    if (distanceListener.length > 0) {
      distanceListener?.forEach((listener) => {
        naver.maps.Event.removeListener(listener)
      })
      setDistanceListener([])
    }
    document.removeEventListener('mousemove', onMouseMoveDistance)

    if (guideline) {
      guideline.setMap(null)
      setGuideline(null)
    }
    if (polyline) {
      const path = polyline.getPath() as naver.maps.Point[]
      const lastCoord = path[path.length - 1]
      const distance = polyline.getDistance()

      if (lastCoord) {
        const coord: Coord = {
          lat: lastCoord.y,
          lng: lastCoord.x,
        }
        addMileStone(coord, fromMetersToText(distance), {
          fontWeight: 'bold',
          fontSize: '12px',
          color: 'red',
        })
      }
      polyline.setMap(null)
      setPolyline(null)
    }
    setLastDistance(null)
  }, [distanceListener, guideline, polyline, addMileStone, fromMetersToText])

  const finishMode = (newMode: string) => {
    if (!newMode) return

    if (newMode === 'distance') {
      finishDistance()
    } else if (newMode === 'area') {
      finishArea()
    }
  }

  const onMouseMoveDistance = useCallback(
    (e: MouseEvent) => {
      if (map && guideline) {
        const proj = map.getProjection()
        const coord = proj.fromPageXYToCoord(
          new naver.maps.Point(e.pageX, e.pageY),
        )
        const path = guideline?.getPath() as naver.maps.Point[]

        if (path) {
          if (path.length === 2) {
            path.pop()
          }
          path.push(coord)
          guideline.setPath(path)
        }
      }
    },
    [map, guideline],
  )

  const onClickDistance = useCallback(
    (e: { coord: naver.maps.Point }) => {
      if (!map) return
      const coord = new naver.maps.LatLng(e.coord.y, e.coord.x)
      if (!polyline) {
        const newGuideline = new naver.maps.Polyline({
          strokeColor: '#f00',
          strokeWeight: 5,
          strokeStyle: 'dash',
          strokeOpacity: 0.6,
          path: [coord],
          map: map,
        })
        setGuideline(newGuideline)
        const rightClickHandler = naver.maps.Event.addListener(
          map,
          'rightclick',
          finishDistance,
        )
        setDistanceListener([rightClickHandler])
        const newPolyline = new naver.maps.Polyline({
          strokeColor: '#f00',
          strokeWeight: 5,
          strokeOpacity: 0.8,
          path: [coord],
          map: map,
        })
        setPolyline(newPolyline)
        setLastDistance(newPolyline.getDistance())
      } else {
        // guideline?.setPath([coord])
        const path = polyline?.getPath()

        path.push(coord)
        polyline.setPath(path)
        const distance = polyline.getDistance()
        addMileStone(
          { lat: coord.lat(), lng: coord.lng() },
          fromMetersToText(distance - lastDistance!),
        )
        setLastDistance(distance)
      }
    },
    [
      map,
      polyline,
      guideline,
      lastDistance,
      addMileStone,
      fromMetersToText,
      finishDistance,
    ],
  )

  const startDistance = () => {
    if (map) {
      map.setOptions({
        draggable: false,
      })
      const clickHandler = naver.maps.Event.addListener(map, 'click', (e) => {
        onClickDistance(e)
      })
      setDistanceListener([clickHandler])
      map.setCursor(
        "url('https://cdn0.iconfinder.com/data/icons/phosphor-regular-vol-4/256/ruler-512.png'), default",
      )
    }
  }

  const startArea = () => {
    // Add your logic for starting area mode
  }

  const finishArea = () => {
    // Add your logic for finishing area mode
  }

  const clearMode = (currentMode: string) => {
    if (!currentMode) return
    if (mode === 'distance') {
      if (polyline) {
        polyline.setMap(null)
        setPolyline(null)
      }
      finishDistance()
    } else if (mode === 'area') {
      if (polyline) {
        polyline.setMap(null)
        setPolyline(null)
      }
      finishArea()
    }
  }

  useEffect(() => {
    if (window !== undefined) {
      document.addEventListener('mousemove', onMouseMoveDistance)
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMoveDistance)
    }
  }, [onMouseMoveDistance])

  const onClickButton = (
    newMode: string,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.preventDefault()
    if (mode === 'distance') {
      finishDistance()
      setMode('')
    } else if (mode === 'area') {
      finishArea()
      setMode('')
    }
    clearMode(mode)
    setMode(newMode)
    startMode(newMode)
  }

  return (
    <Flex css={ContainerStyle}>
      <Distance
        id="distance"
        distance={clickedMapType.distance}
        onClick={(e) => {
          setClickedMapType((prev) => {
            return {
              ...prev,
              distance: !prev.distance,
              area: false,
            }
          })
          onClickButton('distance', e)
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
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.60547 6.54688L14.0303 18.9718"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.84766 2.30469L18.2725 14.7296"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.60156 9.29688L10.7231 7.17537"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.2773 11.9766L13.3989 9.85506"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.9531 14.6523L16.0746 12.5308"
              stroke={`${clickedMapType.distance ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
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
        id="area"
        onClick={() => {
          setClickedMapType((prev) => {
            return {
              ...prev,
              area: !prev.area,
              distance: false,
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

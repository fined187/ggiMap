//* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import { Area, AreaTextStyle, Distance, TextStyle } from './styled/MeasureStyle'
import useMapListeners from './hooks/useMapListeners'
import { UseQueryResult, useQuery } from 'react-query'
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
interface Coord {
  lat: number
  lng: number
}

export const Measure = ({
  clickedMapType,
  setClickedMapType,
}: ToolsBtnProps) => {
  const { data: map } = useSWR(MAP_KEY)
  const [mode, setMode] = useState('')
  const [polyline, setPolyline] = useState<naver.maps.Polyline | null>(null)
  const [guideline, setGuideline] = useState<naver.maps.Polyline | null>(null)
  const [markers, setMarkers] = useState<naver.maps.Marker[] | null>(null)
  const [polygon, setPolygon] = useState<naver.maps.Polygon | null>(null)
  const [lastDistance, setLastDistance] = useState<number | null>(null)
  const [isBoxDisplay, setIsBoxDisplay] = useState(false)
  const [startPoint, setStartPoint] = useState<naver.maps.LatLng | null>(null)
  const [isRightclick, setIsRightclick] = useState(false)

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

  const handleDelete = useCallback(() => {
    if (polyline) {
      polyline?.setMap(null)
    }
    setClickedMapType((prev) => {
      return {
        ...prev,
        distance: false,
      }
    })
    setMode('')
  }, [polyline, setClickedMapType])
  const addMileStone2 = useCallback(
    (coord: Coord, text: string) => {
      const marker2 = new naver.maps.Marker({
        position: coord,
        map: map,
        icon: {
          content: `
          <div style="display: flex; flex-direction: column; width: 160px; padding: 11px 8px; align-items: flex-start; align-content: flex-start; gap: 14px 2px; flex-wrap: wrap; border-radius: 8px; border: 1px solid #9D9999; background: #FFF;">
            <div style="display: flex; width: 100%; justify-content: space-between; padding: 5.5px 4px;">
              <div>
                <span style="color: #000; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">총 거리</span>
              </div>
              <div>
                <span style="color: #DC4798; text-align: right; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">${text}</span>
              </div>
            </div>
            <div style="width: 144px; height: 30px; flex-shrink: 0; border-radius: 100px; border: 1px solid #9D9999; background: #F9F9F9; display: flex; justify-content: center; align-items: center;" onClick="">
              <span style="color: #545454; font-family: SUIT; font-size: 13px; font-style: normal; font-weight: 500; line-height: 100%; letter-spacing: -0.13px;">지우기</span>
            </div>
          </div>
          `,
          anchor: new naver.maps.Point(-5, -5),
        },
      })
      marker2.addListener('click', () => {
        marker2.setMap(null)
        handleDelete()
      })
      marker2.setZIndex(1000)
      setMarkers((prev) => {
        return [...(prev ?? []), marker2]
      })
    },
    [map, handleDelete],
  )
  const addMileStone = useCallback(
    (coord: Coord, text: string) => {
      const marker = new naver.maps.Marker({
        position: coord,
        map: map,
        icon: {
          content: `
            <div style="display: flex; flex-direction: column; width: 160px; padding: 11px 8px; align-items: flex-start; align-content: flex-start; gap: 14px 2px; flex-wrap: wrap; border-radius: 8px; border: 1px solid #9D9999; background: #FFF;">
              <div style="display: flex; width: 100%; justify-content: space-between; padding: 5.5px 4px;">
                <div>
                  <span style="color: #000; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">총 거리</span>
                </div>
                <div>
                  <span style="color: #DC4798; text-align: right; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">${text}</span>
                </div>
              </div>
              <div style="width: 144px; height: 30px; flex-shrink: 0; border-radius: 100px; border: 1px solid #9D9999; background: #FFF; display: flex; justify-content: center; align-items: center;">
                <span style="color: #545454; font-family: SUIT; font-size: 13px; font-style: normal; font-weight: 500; line-height: 100%; letter-spacing: -0.13px;">마우스 오른쪽 버튼 종료</span>
              </div>
            </div>
            `,
          anchor: new naver.maps.Point(-5, -5),
        },
      })
      marker.setZIndex(100)
      setMarkers((prev) => {
        return [...(prev ?? []), marker]
      })
    },
    [map],
  )
  const onMouseMoveDistance = useCallback(
    (e: MouseEvent) => {
      if (map && guideline) {
        const proj = map.getProjection()
        const coord = proj.fromPageXYToCoord(
          new naver.maps.Point(e.pageX, e.pageY),
        ) as naver.maps.Point
        const path = guideline?.getPath() as naver.maps.Point[]
        if (path) {
          if (path.length === 2) {
            path.pop()
          }
          path.push(coord)
          guideline.setPath(path)
          const distance = polyline?.getDistance()
          let ps = map.getPrimitiveProjection().getDistance(startPoint, coord)
          const divMarker = new naver.maps.Marker({
            position: coord,
            map: map,
            icon: {
              content: `<div style="display: flex; flex-direction: column; width: 160px; padding: 11px 8px; align-items: flex-start; align-content: flex-start; gap: 14px 2px; flex-wrap: wrap; border-radius: 8px; border: 1px solid #9D9999; background: #FFF;">
              <div style="display: flex; width: 100%; justify-content: space-between; padding: 5.5px 4px;">
                <div>
                  <span style="color: #000; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">총 거리</span>
                </div>
                <div>
                  <span style="color: #DC4798; text-align: right; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">${fromMetersToText(
                    ps,
                  )}</span>
                </div>
              </div>
              <div style="width: 144px; height: 30px; flex-shrink: 0; border-radius: 100px; border: 1px solid #9D9999; background: #FFF; display: flex; justify-content: center; align-items: center;">
                <span style="color: #545454; font-family: SUIT; font-size: 13px; font-style: normal; font-weight: 500; line-height: 100%; letter-spacing: -0.13px;">마우스 오른쪽 버튼 종료</span>
              </div>
            </div>`,
              anchor: new naver.maps.Point(-5, -5),
            },
          })
          setMarkers((prev) => {
            prev?.forEach((marker) => {
              marker.setMap(null)
            })
            return [divMarker]
          })
        }
      }
    },
    [map, guideline, polyline, fromMetersToText, startPoint],
  )
  const finishDistance = useCallback(() => {
    if (guideline) {
      guideline.setMap(null)
      setGuideline(null)
    }
    if (polyline) {
      const path = polyline.getPath() as any
      if (path && path.length > 0) {
        const lastCoord = path._array[path.length - 1]
        const distance = polyline.getDistance()
        setPolyline(null)
        if (lastCoord) {
          const coord: Coord = {
            lat: lastCoord.y,
            lng: lastCoord.x,
          }
          addMileStone2(coord, fromMetersToText(distance))
        }
      }
    }
    markers?.forEach((marker) => {
      marker.setMap(null)
    })
    setMarkers(null)
    setLastDistance(null)
    map?.setOptions({
      draggable: true,
    })
    map?.setCursor('auto')
    setClickedMapType((prev) => {
      return {
        ...prev,
        distance: false,
      }
    })
    setLastDistance(null)
  }, [
    guideline,
    polyline,
    map,
    fromMetersToText,
    addMileStone2,
    setClickedMapType,
    setMarkers,
    markers,
  ])

  const onClickDistance = useCallback(
    (e: { coord: naver.maps.Point }) => {
      if (!map) return
      if (clickedMapType.distance === false) {
        guideline?.setMap(null)
        polyline?.setMap(null)
        return
      }
      const coord = new naver.maps.LatLng(e.coord.y, e.coord.x)
      setStartPoint(coord)
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
        guideline?.setPath([coord])
        polyline?.getPath()?.push(coord)
        const distance = polyline.getDistance()
        addMileStone(
          { lat: coord.lat(), lng: coord.lng() },
          fromMetersToText(distance),
        )

        setLastDistance(distance)
        setIsBoxDisplay(true)
      }
    },
    [
      guideline,
      polyline,
      map,
      clickedMapType.distance,
      addMileStone,
      fromMetersToText,
    ],
  )

  const fromSquareMetersToText = useCallback((squareMeters: number) => {
    let squareMeter = squareMeters || 0
    let squarKm = 1000 * 1000
    let text: string | number = squareMeter

    if (squareMeter >= squarKm) {
      text = parseFloat((squareMeter / squarKm).toFixed(1)) + 'km²'
    } else {
      text = parseFloat(squareMeter.toFixed(1)) + 'm²'
    }
    return text
  }, [])

  const finishArea = useCallback(() => {
    if (polygon) {
      const path = polygon.getPath() as any
      path.pop()

      const squareMeter = polygon.getAreaSize()
      const lastCoord = path._array[path.length - 1]

      if (lastCoord) {
        addMileStone2(lastCoord, fromSquareMetersToText(squareMeter))
      }
    }
    setPolygon(null)
    map?.setOptions({
      draggable: true,
    })
    map?.setCursor('auto')
    setClickedMapType((prev) => {
      return {
        ...prev,
        area: false,
      }
    })
  }, [polygon, addMileStone2, fromMetersToText, map, setClickedMapType])

  useEffect(() => {
    if (map) {
      if (mode === 'distance' && clickedMapType.distance) {
        map.setOptions({
          draggable: false,
        })
        map.setCursor(`url(/images/Ruler.png), auto`)
        document.addEventListener('mousemove', onMouseMoveDistance)
        return () =>
          document.removeEventListener('mousemove', onMouseMoveDistance)
      } else {
        map.setOptions({
          draggable: true,
        })
        map.setCursor('auto')
      }
      if (mode === 'area' && clickedMapType.area) {
        document.addEventListener('mousemove', () => {
          console.log('add')
        })
        return () =>
          document.removeEventListener('mousemove', () => {
            console.log('remove')
          })
      } else {
        map.setOptions({
          draggable: true,
        })
        map.setCursor('auto')
      }
    }
  }, [onMouseMoveDistance, map, mode, clickedMapType.distance])

  const handleButtonClick = useCallback(() => {
    if (!clickedMapType.distance) {
      setClickedMapType((prev) => {
        return {
          ...prev,
          distance: true,
          area: false,
        }
      })
      setMode('distance')
    } else {
      setClickedMapType((prev) => {
        return {
          ...prev,
          distance: false,
        }
      })
      setMode('')
    }
  }, [clickedMapType.distance, setClickedMapType])

  useMapListeners(map, onClickDistance, onMouseMoveDistance, finishDistance)

  return (
    <Flex css={ContainerStyle}>
      <Distance
        id="distance"
        mode={mode}
        onClick={() => {
          handleButtonClick()
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
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.60547 6.54688L14.0303 18.9718"
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.84766 2.30469L18.2725 14.7296"
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.60156 9.29688L10.7231 7.17537"
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.2773 11.9766L13.3989 9.85506"
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.9531 14.6523L16.0746 12.5308"
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.79688 6.73828L6.03989 2.49527"
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
            />
            <path
              d="M13.8398 18.7812L18.0829 14.5382"
              stroke={`${mode === 'distance' ? 'white' : '#000001'}`}
            />
          </svg>
        </div>
        <TextStyle mode={mode}>거리</TextStyle>
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
          setMode('area')
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

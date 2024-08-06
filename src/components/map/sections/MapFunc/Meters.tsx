import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Distance, TextStyle } from './styled/MeasureStyle'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'

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
  handleButtonClick: () => void
  mode: string
  setMode: Dispatch<SetStateAction<string>>
}

interface Coord {
  lat: number
  lng: number
}

export default function Meters({
  clickedMapType,
  setClickedMapType,
  handleButtonClick,
  mode,
  setMode,
}: ToolsBtnProps) {
  const { data: map } = useSWR(MAP_KEY)
  const [polyline, setPolyline] = useState<naver.maps.Polyline | null>(null)
  const [guideline, setGuideline] = useState<naver.maps.Polyline | null>(null)
  const [markers, setMarkers] = useState<naver.maps.Marker[] | null>(null)
  const [, setLastDistance] = useState<number | null>(null)
  const [, setIsBoxDisplay] = useState(false)
  const [startPoint, setStartPoint] = useState<naver.maps.LatLng | null>(null)
  const [deletable, setDeletable] = useState(false)

  const fromMetersToText = useCallback((meters: number) => {
    const km = 1000
    return meters >= km
      ? `${(meters / km).toFixed(1)}km`
      : `${meters.toFixed(1)}m`
  }, [])

  const handleDelete = useCallback(() => {
    if (polyline) polyline?.setMap(null)
    setClickedMapType((prev) => {
      return {
        ...prev,
        distance: false,
      }
    })
    setMode('')
  }, [polyline, setClickedMapType])

  const addMileStone = useCallback(
    (coord: Coord, text: string) => {
      const marker = new naver.maps.Marker({
        position: coord,
        map: map,
        icon: {
          content: `
            <div style="display: flex; flex-direction: column; width: 160px; padding: 11px 8px; align-items: flex-start; align-content: flex-start; gap: 14px 2px; flex-wrap: wrap; border-radius: 8px; border: 1px solid #9D9999; background: #FFF;">
              <div style="display: flex; width: 100%; justify-content: space-between; padding: 5.5px 4px;">
                <div><span style="color: #000; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">총 거리</span></div>
                <div><span style="color: #DC4798; text-align: right; font-family: SUIT; font-size: 15px; font-style: normal; font-weight: 700; line-height: 100%; letter-spacing: -0.15px;">${text}</span></div>
              </div>
              <div style="width: 144px; height: 30px; flex-shrink: 0; border-radius: 100px; border: 1px solid #9D9999; background: #F9F9F9; display: flex; justify-content: center; align-items: center;">
                <span style="color: #545454; font-family: SUIT; font-size: 13px; font-style: normal; font-weight: 500; line-height: 100%; letter-spacing: -0.13px;">${
                  deletable ? '지우기' : '마우스 오른쪽 버튼 종료'
                }</span>
              </div>
            </div>
            `,
          anchor: new naver.maps.Point(-5, -5),
        },
      })
      if (deletable) {
        marker.addListener('click', () => {
          marker.setMap(null)
          handleDelete()
        })
        marker.setZIndex(1000)
      } else {
        marker.setZIndex(100)
      }
      setMarkers((prev) => [...(prev || []), marker])
    },
    [map, handleDelete],
  )

  const onMouseMoveDistance = useCallback(
    (e: MouseEvent) => {
      if (!map || !guideline) return
      const coord = map
        .getProjection()
        .fromPageXYToCoord(
          new naver.maps.Point(e.pageX, e.pageY),
        ) as naver.maps.Point
      const path = guideline?.getPath() as naver.maps.Point[]
      if (path.length === 2) path.pop()
      path.push(coord as naver.maps.Point)
      guideline.setPath(path)
      const distance = map
        .getPrimitiveProjection()
        .getDistance(startPoint, coord)
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
                  distance,
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
    },
    [map, guideline, polyline, fromMetersToText, startPoint],
  )

  const finishDistance = useCallback(() => {
    setDeletable(true)
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
          addMileStone(
            { lat: lastCoord.y, lng: lastCoord.x },
            fromMetersToText(distance),
          )
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
  }, [
    guideline,
    polyline,
    map,
    fromMetersToText,
    addMileStone,
    setClickedMapType,
    markers,
    deletable,
  ])

  const onClickDistance = useCallback(
    (e: { coord: naver.maps.Point }) => {
      if (!map) return
      if (clickedMapType.distance === false) {
        setDeletable(true)
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
      deletable,
    ],
  )

  useEffect(() => {
    if (!map) return
    const handleMouseMove = (e: any) => {
      if (clickedMapType.distance && mode === 'distance') {
        onMouseMoveDistance(e)
      } else {
        if (guideline) guideline.setMap(null)
        if (polyline) polyline.setMap(null)
        if (markers) markers.forEach((marker) => marker.setMap(null))
        setGuideline(null)
        setPolyline(null)
        setMarkers(null)
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [map, mode, clickedMapType.distance, onMouseMoveDistance])

  useEffect(() => {
    if (!map) return
    const clickHandler = naver.maps.Event.addListener(
      map,
      'click',
      onClickDistance,
    )
    const rightClickHandler = naver.maps.Event.addListener(
      map,
      'rightclick',
      finishDistance,
    )
    document.addEventListener('mousemove', onMouseMoveDistance)
    return () => {
      naver.maps.Event.removeListener(clickHandler)
      naver.maps.Event.removeListener(rightClickHandler)
      document.removeEventListener('mousemove', onMouseMoveDistance)
    }
  }, [map, onClickDistance, finishDistance, onMouseMoveDistance])

  useEffect(() => {
    if (!map) return
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
  }, [onMouseMoveDistance, map, mode, clickedMapType.distance])

  return (
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
  )
}

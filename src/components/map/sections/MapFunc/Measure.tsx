// import { useEffect, useRef, useState } from 'react'
// import useSWR from 'swr'
// import { MAP_KEY } from '../hooks/useMap'

// export const Measure = ({ buttons }: any) => {
//   const [mode, setMode] = useState(null)
//   const [distanceListeners, setDistanceListeners] = useState([])
//   const [areaListeners, setAreaListeners] = useState([])
//   const [guideline, setGuideline] = useState(null)
//   const [polyline, setPolyline] = useState(null)
//   const [polygon, setPolygon] = useState(null)
//   const [lastDistance, setLastDistance] = useState(null)
//   const [ms, setMs] = useState([])
//   const [map, setMap] = useState(null)

//   const { data: mapReg } = useSWR(MAP_KEY)

//   useEffect(() => {
//     if (mode && mapReg) {
//       startMode(mode)
//       setMap(mapReg)
//     }
//   }, [mode, mapReg])

//   const startMode = (mode: string) => {
//     if (!mode) return

//     if (mode === 'distance') {
//       startDistance()
//     } else if (mode === 'area') {
//       // startArea()
//     }
//   }

//   const startDistance = () => {
//     if (!map) return
//     const naver = window.naver
//     const clickListener: naver.maps.MapEventListener =
//       naver.maps.Event.addListener(map, 'click', onClickDistance)
//     setDistanceListeners([clickListener])
//     map?.setCursor("url('" + HOME_PATH + "/img/rule.cur'), default")
//   }

//   const onMouseMoveDistance = (e: MouseEvent) => {
//     if (map && guideline) {
//       const naver = window.naver
//       const proj = map?.getProjection()
//       const coord = proj.fromPageXYToCoord(
//         new naver.maps.Point(e.pageX, e.pageY),
//       )
//       const path = guideline.getPath()

//       if (path.getLength() === 2) {
//         path.pop()
//       }

//       path.push(coord)
//     }
//   }

//   const finishDistance = () => {
//     if (!map || !polyline) return
//     const naver = window.naver
//     distanceListeners.forEach((listener) =>
//       naver.maps.Event.removeListener(listener),
//     )
//     setDistanceListeners([])
//     document.removeEventListener('mousemove', onMouseMoveDistance)

//     if (guideline) {
//       guideline.setMap(null)
//       setGuideline(null)
//     }

//     if (polyline) {
//       const path = polyline.getPath()
//       const lastCoord = path.getAt(path.getLength() - 1)
//       const distance = polyline.getDistance()
//       setPolyline(null)

//       if (lastCoord) {
//         addMileStone(lastCoord, fromMetersToText(distance), {
//           'font-size': '14px',
//           'font-weight': 'bold',
//           color: '#f00',
//         })
//       }
//     }

//     buttons.distance.classList.remove('control-on')
//     buttons.distance.blur()
//     map.setCursor('auto')
//     setLastDistance(null)
//     setMode(null)
//   }

//   const onClickDistance = (e: any) => {
//     const naver = window.naver
//     const coord = e.coord

//     if (!polyline) {
//       const newGuideline = new naver.maps.Polyline({
//         strokeColor: '#f00',
//         strokeWeight: 5,
//         strokeStyle: [4, 4],
//         strokeOpacity: 0.6,
//         path: [coord],
//         map,
//       })
//       setGuideline(newGuideline)

//       document.addEventListener('mousemove', onMouseMoveDistance)
//       const rightClickListener = naver.maps.Event.addListener(
//         map,
//         'rightclick',
//         finishDistance,
//       )
//       setDistanceListeners((prevListeners) => [
//         ...prevListeners,
//         rightClickListener,
//       ])

//       const newPolyline = new naver.maps.Polyline({
//         strokeColor: '#f00',
//         strokeWeight: 5,
//         strokeOpacity: 0.8,
//         path: [coord],
//         map,
//       })
//       setPolyline(newPolyline)
//       setLastDistance(newPolyline.getDistance())
//     } else {
//       guideline.setPath([e.coord])
//       polyline.getPath().push(coord)
//       const distance = polyline.getDistance()
//       addMileStone(coord, fromMetersToText(distance - lastDistance))
//       setLastDistance(distance)
//     }
//   }
// }

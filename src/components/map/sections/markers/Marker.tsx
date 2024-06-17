import { MapItem } from '@/models/MapItem'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  AmountIcon,
  InterestIcon,
  PnuCountIcon,
  ShareIcon,
  UsageIcon,
} from './Icon/Marker1'
import { AmountBottomIcon, UsageTopIcon } from './Icon/Marker2'
import { useRecoilState } from 'recoil'
import { markerPositionAtom } from '@/store/atom/map'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'

type PnuProps = {
  pnu: string
  count: number
  type: number
}

interface MarkerProps {
  item: MapItem
  setMapItems: any
  mapItems: MapItem[]
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
  originPnuCounts: {
    updatedCounts: PnuProps[]
  }
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  clickedItem: any
  setClickedItem: any
  markerClickedRef: MutableRefObject<boolean>
  index: number
  handleFilterMarkers: () => MapItem[] | undefined
}

const Marker = ({
  item,
  index,
  pnuCounts,
  openOverlay,
  setOpenOverlay,
  clickedItem,
  setClickedItem,
  markerClickedRef,
  originPnuCounts,
  handleFilterMarkers,
}: MarkerProps) => {
  const { data: map } = useSWR(MAP_KEY)
  const [markerPosition, setMarkerPosition] = useRecoilState(markerPositionAtom)
  const [count, setCount] = useState<number>(0)
  const [originCount, setOriginCount] = useState<number>(0)
  const [isSame, setIsSame] = useState<boolean>(false)
  const markerRef = useRef<naver.maps.Marker | null>(null)
  const handleGetItemCounts = useCallback(() => {
    const pnuCount =
      pnuCounts.updatedCounts.find((pnu) => pnu.pnu === item.pnu)?.count ?? 0
    const pnuOriginCount =
      originPnuCounts.updatedCounts.find((pnu) => pnu.pnu === item.pnu)
        ?.count ?? 0
    setCount(pnuCount)
    setOriginCount(pnuOriginCount)
    setIsSame(pnuCount === pnuOriginCount)
  }, [item.pnu, pnuCounts, originPnuCounts])

  const handleItemUsage = useCallback(() => {
    if (item.usage.length >= 4) {
      if (item.usage === '단독,다가구') return '다가구'
      if (item.usage === '연립.다세대') return '다세대'
      if (item.usage === '전,답,과수') return '전답과'
      if (item.usage === '기타토지') return '기타'
      if (item.usage === '상업시설') return '상업'
      if (item.usage === '공업시설') return '공업'
      return item.usage.slice(0, 2) + '<br />' + item.usage.slice(2, 4)
    }
    return item.usage
  }, [item.usage])

  useEffect(() => {
    handleGetItemCounts()
  }, [handleGetItemCounts])

  const handleMarkerClick = useCallback(
    (item: MapItem) => {
      if (clickedItem === item) {
        setOpenOverlay(!openOverlay)
        markerClickedRef.current = !openOverlay
        setClickedItem(openOverlay ? null : item)
      } else {
        setOpenOverlay(true)
        markerClickedRef.current = true
        setClickedItem(item)
      }
    },
    [
      clickedItem,
      openOverlay,
      setOpenOverlay,
      setClickedItem,
      markerClickedRef,
    ],
  )
  useEffect(() => {
    if (map === null) return
    if (handleFilterMarkers() === undefined) return
    const zoomLevel = map?.getZoom()
    let marker: naver.maps.Marker | null = null
    if (item.winYn !== 'Y') {
      if (
        (item.type === 1 || item.type === 2 || item.type === 3) &&
        zoomLevel === 15
      ) {
        marker = new naver.maps.Marker({
          map: map,
          position: new naver.maps.LatLng(item.y, item.x),
          icon: {
            content: `
            <div id="target_${index}" style="flex-direction: row; display: flex; margin-top: -30px;">
              ${
                item.interest === 'Y' && originCount < 2
                  ? InterestIcon(item, item.type)
                  : ''
              }
              ${
                item.share === 'Y' && originCount < 2
                  ? ShareIcon(item, item.type)
                  : ''
              }
              ${
                item.interest !== 'Y' && originCount > 1
                  ? PnuCountIcon(item, originCount, item.type, isSame)
                  : ''
              }
              ${UsageIcon(item, handleItemUsage, item.type, isSame)}
              ${AmountIcon(item, item.type)}
            </div>
            `,
          },
        })
        item.type === 1
          ? marker.setZIndex(100)
          : item.type === 2
          ? marker.setZIndex(90)
          : marker.setZIndex(80)
      } else if (
        (item.type === 1 || item.type === 2 || item.type === 3) &&
        zoomLevel > 15
      ) {
        marker = new naver.maps.Marker({
          map: map,
          position: new naver.maps.LatLng(item.y, item.x),
          icon: {
            content: `
            <div id="target_${index}" style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 100px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0; position: absolute; margin-left: 0px; margin-top: -100px;">
              ${UsageTopIcon(item, originCount, item.type, isSame)}
              ${AmountBottomIcon(item, item.type)}
            </div>
          `,
          },
        })
        item.type === 1
          ? marker.setZIndex(100)
          : item.type === 2
          ? marker.setZIndex(90)
          : marker.setZIndex(80)
      } else if (item.type === 4 && zoomLevel > 15) {
        marker = new naver.maps.Marker({
          map: map,
          position: new naver.maps.LatLng(item.y, item.x),
          icon: {
            content: `
                <div id="target_${index}" style="flex-direction: row; display: flex; margin-top: -30px;">
                  ${
                    item.interest === 'Y' && originCount < 2
                      ? InterestIcon(item, item.type)
                      : ''
                  }
                  ${
                    item.share === 'Y' && originCount < 2
                      ? ShareIcon(item, item.type)
                      : ''
                  }
                  ${
                    item.interest !== 'Y' && originCount > 1
                      ? PnuCountIcon(item, originCount, item.type, true)
                      : ''
                  }
                  ${UsageIcon(item, handleItemUsage, item.type)}
                  ${AmountIcon(item, item.type)}
                </div>
              `,
          },
        })
        marker.setZIndex(60)
      } else if (item.type === 4 && zoomLevel === 15) {
        marker = new naver.maps.Marker({
          map: map,
          position: new naver.maps.LatLng(item.y, item.x),
          icon: {
            content: `
                <div id="target_${index}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g filter="url(#filter0_d_905_254)">
                      <circle cx="8" cy="6" r="6" fill="#1C8D00"/>
                      <circle cx="8" cy="6" r="5.75" stroke="white" stroke-width="0.5"/>
                    </g>
                    <defs>
                      <filter id="filter0_d_905_254" x="0" y="0" width="16" height="16" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="2"/>
                        <feGaussianBlur stdDeviation="1"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_905_254"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_905_254" result="shape"/>
                      </filter>
                    </defs>
                  </svg>
                </div>`,
          },
        })
        marker.setZIndex(60)
      }
    } else if (item.winYn === 'Y') {
      {
        if (zoomLevel === 15) {
          ;(marker = new naver.maps.Marker({
            map: map,
            position: new naver.maps.LatLng(item.y, item.x),
            icon: {
              content: `
                    <div id="target_${index}" style="z-index: 75;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <g filter="url(#filter0_d_905_256)">
                          <circle cx="8" cy="6" r="6" fill="#FF4D00"/>
                          <circle cx="8" cy="6" r="5.75" stroke="white" stroke-width="0.5"/>
                        </g>
                        <defs>
                          <filter id="filter0_d_905_256" x="0" y="0" width="16" height="16" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="2"/>
                            <feGaussianBlur stdDeviation="1"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_905_256"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_905_256" result="shape"/>
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  `,
            },
          })),
            marker.setZIndex(75)
        } else if (zoomLevel === 16) {
          ;(marker = new naver.maps.Marker({
            map: map,
            position: new naver.maps.LatLng(item.y, item.x),
            icon: {
              content: `
                    <div id="target_${index}" style="flex-direction: row; display: flex; margin-top: -30px; z-index: 75; ">
                      ${
                        item.interest === 'Y' && originCount < 2
                          ? InterestIcon(item, item.type)
                          : ''
                      }
                      ${
                        item.share === 'Y' && originCount < 2
                          ? ShareIcon(item, item.type)
                          : ''
                      }
                      ${
                        item.interest !== 'Y' &&
                        item.share !== 'Y' &&
                        originCount > 1
                          ? PnuCountIcon(item, originCount, item.type, isSame)
                          : ''
                      }
                      ${UsageIcon(item, handleItemUsage, item.type, isSame)}
                      ${AmountIcon(item, item.type)}
                    </div>
                `,
            },
          })),
            marker.setZIndex(75)
        } else if (zoomLevel > 16) {
          ;(marker = new naver.maps.Marker({
            map: map,
            position: new naver.maps.LatLng(item.y, item.x),
            icon: {
              content: `
                    <div id="target_${index}" style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 100px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0; position: absolute; margin-left: 0px; margin-top: -100px; z-index: 100;">
                    ${UsageTopIcon(item, originCount, item.type, isSame)}
                    ${AmountBottomIcon(item, item.type)}
                  </div>
                  `,
            },
          })),
            marker.setZIndex(75)
        }
      }
    }
    if (marker) {
      markerRef.current = marker
      naver.maps.Event?.addListener(marker, 'mouseover', () => {
        marker.setZIndex(110)
      })
      naver.maps.Event?.addListener(marker, 'mouseout', () => {
        item.type === 1
          ? marker.setZIndex(100)
          : item.type === 2
          ? marker.setZIndex(90)
          : item.type === 3
          ? marker.setZIndex(80)
          : marker.setZIndex(60)
      })
      naver.maps.Event?.addListener(marker, 'click', () => {
        handleMarkerClick(item)
        const target = document.getElementById(`target_${index}`)
        if (target) {
          const rect = target.getBoundingClientRect()
          setMarkerPosition((prev) => {
            return {
              position: [0, 0],
              type: 1,
              winYn: item.winYn,
            }
          })
          setMarkerPosition((prev) => {
            return {
              position: [rect.left, rect.top],
              type: item.type,
              winYn: item.winYn,
            }
          })
        }
      })
    }
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [
    map,
    item,
    count,
    handleItemUsage,
    pnuCounts,
    openOverlay,
    clickedItem,
    isSame,
    originCount,
    index,
    setClickedItem,
    map?.getCenter(),
    setMarkerPosition,
  ])
  return null
}

export default Marker

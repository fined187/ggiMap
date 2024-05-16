import { NaverMap } from '@/models/Map'
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

type PnuProps = {
  pnu: string
  count: number
  type: number
}

interface MarkerProps {
  item: MapItem
  map: NaverMap
  setMapItems: any
  mapItems: MapItem[]
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
  openOverlay: boolean
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  clickedItem: any
  setClickedItem: any
  markerClickedRef: MutableRefObject<boolean>
  offset: { x: number; y: number }
  setOffset: Dispatch<SetStateAction<{ x: number; y: number }>>
}

const Marker = ({
  item,
  map,
  pnuCounts,
  openOverlay,
  setOpenOverlay,
  clickedItem,
  setClickedItem,
  markerClickedRef,
  offset,
  setOffset,
}: MarkerProps) => {
  const [count, setCount] = useState<number>(0)
  const mapRef = useRef<NaverMap | null>(null)

  const handleGetItemPnuCounts = useCallback(() => {
    if (
      pnuCounts.updatedCounts.find((pnu) => pnu.pnu === item.pnu)?.count ??
      0 > 1
    ) {
      setCount(
        pnuCounts.updatedCounts.find((pnu) => pnu.pnu === item.pnu)?.count ?? 0,
      )
    }
  }, [item, pnuCounts])

  const handleItemUsage = useCallback(() => {
    if (item.usage.length >= 4) {
      if (item.usage === '단독,다가구') {
        return '다가구'
      } else if (item.usage === '연립.다세대') {
        return '다세대'
      } else if (item.usage === '전,답,과수') {
        return '전답과'
      } else if (item.usage === '기타토지') {
        return '기타'
      } else if (item.usage === '상업시설') {
        return '상업'
      } else if (item.usage === '공업시설') {
        return '공업'
      }
      return item.usage.slice(0, 2) + '<br />' + item.usage.slice(2, 4)
    } else {
      return item.usage
    }
  }, [item.usage])

  useEffect(() => {
    handleGetItemPnuCounts()
  }, [pnuCounts, handleGetItemPnuCounts])

  const handleMarkerClick = (item: MapItem) => {
    if (!openOverlay && clickedItem === null) {
      setOpenOverlay(true)
      markerClickedRef.current = true
      setClickedItem(item)
    } else if (openOverlay && clickedItem === item) {
      setOpenOverlay(false)
      markerClickedRef.current = false
      setClickedItem(null)
    } else if (openOverlay && clickedItem !== item) {
      setOpenOverlay(true)
      markerClickedRef.current = true
      setClickedItem(item)
    } else if (!openOverlay && clickedItem !== item) {
      setOpenOverlay(true)
      markerClickedRef.current = true
      setClickedItem(item)
    }
  }

  useEffect(() => {
    let marker1: naver.maps.Marker | null = null
    let marker2: naver.maps.Marker | null = null
    if (map) {
      if (item.type === 1 && item.winYn !== 'Y') {
        map.getZoom() === 15
          ? (marker1 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
              <div style="flex-direction: row; display: flex; margin-top: -30px; z-index: 100;">
                ${item.interest === 'Y' ? InterestIcon(item, item.type) : ''}
                ${
                  item.interest != 'Y' && item.share === 'Y'
                    ? ShareIcon(item, item.type)
                    : ''
                }
                ${
                  item.interest != 'Y' && item.share != 'Y' && count > 1
                    ? PnuCountIcon(item, count, item.type)
                    : ''
                }
                ${UsageIcon(item, handleItemUsage, item.type)}
                ${AmountIcon(item, item.type)}
              </div>
              `,
                anchor: new naver.maps.Point(12, 12),
              },
            }))
          : map.getZoom() > 15
          ? (marker2 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
              <div style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 100px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0; position: absolute; margin-left: 0px; margin-top: -100px; z-index: 100;">
                ${UsageTopIcon(item, count, item.type)}
                ${AmountBottomIcon(item, item.type)}
              </div>
            `,
              },
            }))
          : null
      } else if (item.type === 2 && item.winYn !== 'Y') {
        map.getZoom() === 15
          ? (marker1 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                <div style="flex-direction: row; display: flex; margin-top: -30px; z-index: 90;">
                ${item.interest === 'Y' ? InterestIcon(item, item.type) : ''}
                ${
                  item.interest != 'Y' && item.share === 'Y'
                    ? ShareIcon(item, item.type)
                    : ''
                }
                ${
                  item.interest != 'Y' && item.share != 'Y' && count > 1
                    ? PnuCountIcon(item, count, item.type)
                    : ''
                }
                ${UsageIcon(item, handleItemUsage, item.type)}
                ${AmountIcon(item, item.type)}
              </div>
                    `,
                anchor: new naver.maps.Point(12, 12),
              },
            }))
          : map.getZoom() > 15
          ? (marker2 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                <div style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 100px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0; position: absolute; margin-left: 0px; margin-top: -100px; z-index: 90;">
                ${UsageTopIcon(item, count, item.type)}
                ${AmountBottomIcon(item, item.type)}
              </div>
            `,
              },
            }))
          : null
      } else if (item.type === 3 && item.winYn !== 'Y') {
        map.getZoom() === 15
          ? (marker1 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                <div style="flex-direction: row; display: flex; margin-top: -30px; z-index: 80;">
                  ${item.interest === 'Y' ? InterestIcon(item, item.type) : ''}
                  ${
                    item.interest != 'Y' && item.share === 'Y'
                      ? ShareIcon(item, item.type)
                      : ''
                  }
                  ${
                    item.interest != 'Y' && item.share != 'Y' && count > 1
                      ? PnuCountIcon(item, count, item.type)
                      : ''
                  }
                  ${UsageIcon(item, handleItemUsage, item.type)}
                  ${AmountIcon(item, item.type)}
                </div>
                    `,
                anchor: new naver.maps.Point(12, 12),
              },
            }))
          : map.getZoom() > 15
          ? (marker2 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                <div style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 100px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0; position: absolute; margin-left: 0px; margin-top: -100px; z-index: 80;">
                  ${UsageTopIcon(item, count, item.type)}
                  ${AmountBottomIcon(item, item.type)}
                </div>
            `,
              },
            }))
          : null
      } else if (item.type === 4 && item.winYn !== 'Y') {
        map.getZoom() > 15
          ? (marker1 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                  <div style="flex-direction: row; display: flex; margin-top: -30px; z-index: 95;">
                    ${
                      item.interest === 'Y' ? InterestIcon(item, item.type) : ''
                    }
                    ${
                      item.interest != 'Y' && item.share === 'Y'
                        ? ShareIcon(item, item.type)
                        : ''
                    }
                    ${
                      item.interest != 'Y' && item.share != 'Y' && count > 1
                        ? PnuCountIcon(item, count, item.type)
                        : ''
                    }
                    ${UsageIcon(item, handleItemUsage, item.type)}
                    ${AmountIcon(item, item.type)}
                  </div>
                `,
                anchor: new naver.maps.Point(12, 12),
              },
            }))
          : map.getZoom() === 15
          ? (marker2 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                  <div style="z-index: 95;">
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
                  </div>
            `,
              },
            }))
          : null
      } else if (item.winYn === 'Y') {
        map.getZoom() === 15
          ? (marker1 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                <div style="z-index: 70;">
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
                anchor: new naver.maps.Point(12, 12),
              },
            }))
          : map.getZoom() === 16
          ? (marker2 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                <div style="flex-direction: row; display: flex; margin-top: -30px; z-index: 70;">
                  ${item.interest === 'Y' ? InterestIcon(item, item.type) : ''}
                  ${
                    item.interest != 'Y' && item.share === 'Y'
                      ? ShareIcon(item, item.type)
                      : ''
                  }
                  ${
                    item.interest != 'Y' && item.share != 'Y' && count > 1
                      ? PnuCountIcon(item, count, item.type)
                      : ''
                  }
                  ${UsageIcon(item, handleItemUsage, item.type)}
                  ${AmountIcon(item, item.type)}
                </div>
            `,
              },
            }))
          : map.getZoom() > 16
          ? (marker2 = new naver.maps.Marker({
              map: map,
              position: new naver.maps.LatLng(item.y, item.x),
              icon: {
                content: `
                <div style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 100px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0; position: absolute; margin-left: 0px; margin-top: -100px; z-index: 60;">
                  ${UsageTopIcon(item, count, item.type)}
                  ${AmountBottomIcon(item, item.type)}
                </div>
            `,
              },
            }))
          : null
      }
      if (marker1) {
        naver.maps.Event?.addListener(marker1, 'click', (e) => {
          handleMarkerClick(item)
        })
      }
      if (marker2) {
        naver.maps.Event?.addListener(marker2, 'click', (e) => {
          handleMarkerClick(item)
          const clickedPosition = marker2?.getPosition()
          const projection = map.getProjection()
          const pixelPosition = projection.fromCoordToOffset(clickedPosition!)
          setOffset({ x: pixelPosition.x, y: pixelPosition.y })
        })
      }
    }
    return () => {
      if (marker1) {
        marker1?.setMap(null)
      }
      if (marker2) {
        marker2?.setMap(null)
      }
    }
  }, [map, item, count, handleItemUsage, pnuCounts, openOverlay, clickedItem])
  return null
}

export default Marker

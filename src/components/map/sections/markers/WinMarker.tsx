import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import { useCallback, useEffect, useState } from 'react'
import { Marker } from 'react-naver-maps'
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
interface ItemProps {
  item: MapItem
  formData: Form
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
}
export default function WinMarker({ item, formData, pnuCounts }: ItemProps) {
  const [count, setCount] = useState<number>(0)
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
      }
      return item.usage.slice(0, 2) + '<br />' + item.usage.slice(2, 4)
    } else {
      return item.usage
    }
  }, [item.usage])

  useEffect(() => {
    handleGetItemPnuCounts()
  }, [pnuCounts, handleGetItemPnuCounts])
  return (
    <>
      {formData.map.zoom === 15 ? (
        <Marker
          position={{
            lat: item.y,
            lng: item.x,
          }}
          icon={{
            content: `
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <g filter="url(#filter0_d_228_707)">
                  <circle cx="5.5" cy="3.5" r="3.5" fill="#FF4D00"/>
                  <circle cx="5.5" cy="3.5" r="3.25" stroke="white" stroke-width="0.5"/>
                </g>
                <defs>
                  <filter id="filter0_d_228_707" x="0" y="0" width="11" height="11" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="2"/>
                    <feGaussianBlur stdDeviation="1"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_228_707"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_228_707" result="shape"/>
                  </filter>
                </defs>
              </svg>
              `,
            zIndex: 0,
          }}
        />
      ) : formData.map.zoom! === 16 ? (
        <Marker
          position={{
            lat: item.y,
            lng: item.x,
          }}
          icon={{
            content: `
              <div style="flex-direction: row; display: flex; margin-top: -30px;">
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
            zIndex: 100,
          }}
        />
      ) : formData.map.zoom! > 16 ? (
        <Marker
          position={{
            lat: item.y,
            lng: item.x,
          }}
          icon={{
            content: `
              <div style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 100px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0; position: absolute; margin-left: 0px; margin-top: -100px;">
                ${UsageTopIcon(item, count, item.type)}
                ${AmountBottomIcon(item, item.type)}
              </div>
            `,
            zIndex: 100,
          }}
        />
      ) : null}
    </>
  )
}

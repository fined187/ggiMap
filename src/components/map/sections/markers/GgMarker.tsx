import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import { NumToHan } from '@/utils/NumToHan'
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
interface GgMarkerProps {
  item: MapItem
  formData: Form
  pnuCounts: {
    updatedCounts: PnuProps[]
  }
}

export default function GgMarker({ item, formData, pnuCounts }: GgMarkerProps) {
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
            zIndex: 100, // Add the desired z-index value here
          }}
        />
      ) : formData.map.zoom! > 15 ? (
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
            zIndex: 100, // Add the desired z-index value here
          }}
        />
      ) : null}
    </>
  )
}

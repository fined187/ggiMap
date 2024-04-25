import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import { NumToHan } from '@/utils/NumToHan'
import { Marker } from 'react-naver-maps'

interface GmMarkerProps {
  item: MapItem
  formData: Form
}

export default function GmMarker({ item, formData }: GmMarkerProps) {
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
                <div style="display:flex; flex-direction:row;">
                  <div style="display: inline-flex; width: 45px; height: 32px; padding: 10px 6px; justify-content: center; align-items: center; border-radius: 17.5px 0px 0px 0px; border: 1px solid #8F00FF; background: #FFF;">
                    <h1 style="color: #8F00FF; text-align: center; font-family: SUIT; font-size: 11px; font-style: normal; font-weight: 800; line-height: 110%; letter-spacing: -0.22px;">
                      ${
                        item.usage === '연립.다세대'
                          ? '다세대'
                          : item.usage === '단독,다가구'
                          ? '다가구'
                          : item.usage.length === 4
                          ? item.usage.slice(0, 2) +
                            '<br />' +
                            item.usage.slice(2, 4)
                          : item.usage
                      }
                    </h1>
                  </div>
                  <div style="display:flex; width: 56px; height: 32px; flex-shrink: 0; border-radius: 0px 75px 75px 0px; background: #8F00FF; justify-content:center; align-items:center;">
                    <h1 style="font-size: 12px; color: white; font-family: SUIT; font-style: normal; font-weight: 800; line-height: 110%; letter-spacing: -0.24px;">
                      ${NumToHan(parseInt(item.amount ?? 0))}
                    </h1>
                  </div>
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
              <div style="display: flex; flex-direction: column; justify-content: center; width: 100px; height: 80px; padding: 1px 4px 2px 6px; align-items: center; align-content: center; flex-shrink: 0;">
                <div style="display: flex; width: 100px; height: 42px; padding: 2px 4px; justify-content: center; align-items: center; gap: 2px; flex-shrink: 0; border-radius: 12px 12px 0px 0px; border-top: 1px solid #0087B1; border-right: 1px solid #0087B1; border-left: 1px solid #0087B1; background: #0087B1;">
                  <h1 style="color: #FFF; text-align: center; font-family: SUIT; font-size: 14px; font-style: normal; font-weight: 800; line-height: 135%; letter-spacing: -0.14px;">
                    ${item.usage}
                  </h1>
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="70" viewBox="0 0 100 70" fill="none">
                    <mask id="path-1-inside-1_228_747" fill="white">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M100 0H0V58.1197V58.8506V69.7518C0 70.0028 0.328402 70.0973 0.46177 69.8847L7.38462 58.8506H88C94.6274 58.8506 100 53.478 100 46.8506V0Z"/>
                    </mask>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M100 0H0V58.1197V58.8506V69.7518C0 70.0028 0.328402 70.0973 0.46177 69.8847L7.38462 58.8506H88C94.6274 58.8506 100 53.478 100 46.8506V0Z" fill="white"/>
                    <path d="M0 0V-1H-1V0H0ZM100 0H101V-1H100V0ZM0.46177 69.8847L1.30885 70.4162H1.30885L0.46177 69.8847ZM7.38462 58.8506V57.8506H6.8315L6.53753 58.3191L7.38462 58.8506ZM0 1H100V-1H0V1ZM1 58.1197V0H-1V58.1197H1ZM1 58.8506V58.1197H-1V58.8506H1ZM1 69.7518V58.8506H-1V69.7518H1ZM-0.385309 69.3532C0.0147915 68.7155 1 68.999 1 69.7518H-1C-1 71.0066 0.642012 71.479 1.30885 70.4162L-0.385309 69.3532ZM6.53753 58.3191L-0.385311 69.3532L1.30885 70.4162L8.2317 59.382L6.53753 58.3191ZM88 57.8506H7.38462V59.8506H88V57.8506ZM99 46.8506C99 52.9257 94.0751 57.8506 88 57.8506V59.8506C95.1797 59.8506 101 54.0303 101 46.8506H99ZM99 0V46.8506H101V0H99Z" fill="#0087B1" mask="url(#path-1-inside-1_228_747)"/>
                  </svg>
                </div>
              </div>
            `,
            zIndex: 100, // Add the desired z-index value here
          }}
        />
      ) : null}
    </>
  )
}

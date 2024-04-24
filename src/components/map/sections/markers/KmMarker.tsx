import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import { NumToHan } from '@/utils/NumToHan'
import axios from 'axios'
import { Marker } from 'react-naver-maps'

interface ItemProps {
  item: MapItem
  formData: Form
}

export default function KmMarker({ item, formData }: ItemProps) {
  axios.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json'
    return config
  })
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
                  <div style="display: inline-flex; width: 45px; height: 32px; padding: 10px 6px; justify-content: center; align-items: center; border-radius: 17.5px 0px 0px 0px; border: 1px solid #0038FF; background: #FFF;">
                    <h1 style="color: #0038FF; text-align: center; font-family: SUIT; font-size: 11px; font-style: normal; font-weight: 800; line-height: 110%; letter-spacing: -0.22px;">
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
                  <div style="display:flex; width: 56px; height: 32px; flex-shrink: 0; border-radius: 0px 75px 75px 0px; background: #0038FF; justify-content:center; align-items:center;">
                    <h1 style="font-size: 12px; color: white; font-family: SUIT; font-style: normal; font-weight: 800; line-height: 110%; letter-spacing: -0.24px;">${NumToHan(
                      parseInt(item.amount ?? 0),
                    )}</h1>
                  </div>
                </div>
              `,
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
                  <div style="flex-direction: column; display: flex; width: 100px; height: 42px; padding: 2px 4px; justify-content: center; align-items: center; gap: 2px; flex-shrink: 0; border-radius: 12px 12px 0px 0px; border-top: 1px solid #0038FF; border-right: 1px solid #0038FF; border-left: 1px solid #0038FF; background: #0038FF;">
                    ${
                      item.interest === 'Y'
                        ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M7.00377 10.5071L1.91133 5.89433C-0.856306 3.1267 3.21211 -2.18716 7.00377 2.1119C10.7954 -2.18716 14.8454 3.14515 12.0962 5.89433L7.00377 10.5071Z" fill="white" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>`
                        : ''
                    }
                    <div style="display: flex; flex-direction: row; gap: 5px;">
                      ${
                        item.winYn === 'Y'
                          ? `<div style="display: flex; width: 15px; height: 15px; background: #FF5C00; justify-content: center; align-items: center; margin-top: 2px;">
                                <h1 style="color: #FFF; font-size: 10px; font-family: SUIT; font-style: normal; font-weight: 800; line-height: 135%; letter-spacing: -0.1px; text-align: center;">낙</h1>
                              </div>`
                          : ''
                      }
                        <h1 style="color: #FFF; text-align: center; font-family: SUIT; font-size: 14px; font-style: normal; font-weight: 800; line-height: 135%; letter-spacing: -0.14px;">
                          ${item.usage}
                        </h1>
                    </div>
                  </div>
                  <div style="width: 100px; height: 58.851px; border-radius: 0px 0px 12px 0px; background: #D9D9D9;">
                    hi
                  </div>
                </div>
              `,
          }}
        />
      ) : null}
    </>
  )
}

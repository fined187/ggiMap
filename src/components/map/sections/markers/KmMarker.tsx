/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import { NumToHan } from '@/utils/NumToHan'
import { Marker } from 'react-naver-maps'

type PnuProps = {
  pnu: string
  count: number
  type: number
}
interface ItemProps {
  item: MapItem
  formData: Form
  pnuCounts: PnuProps[]
}

export default function KmMarker({ item, formData, pnuCounts }: ItemProps) {
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
              <div style="display:flex; flex-direction:row; position: absolute; margin-left: -28px; margin-top: -28px;">
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
              ${
                item.interest === 'Y'
                  ? `
                  <div style="flex-direction: row; display: flex; width: 100%; justify-content: flex-end; position: absolute; top: -10px; right: 0px;">
                    ${
                      item.share === 'Y'
                        ? `
                    <div style="display: flex; padding: 1px 6px; justify-content: center; align-items: center; border-radius: 100px; ${
                      item.winYn === 'Y'
                        ? '1px solid #FF4D00;'
                        : '1px solid #0038FF;'
                    } background: #FFF;">
                      <span style="color: #000001; text-align: center; font-family: SUIT; font-size: 11px; font-style: normal; font-weight: 700; line-height: 135%; letter-spacing: -0.11px;">
                        지분
                      </span>
                    </div>
                    `
                        : ``
                    }
                    </div>
                  `
                  : ''
              }
                <div style="flex-direction: column; display: flex; width: 100px; height: 42px; padding: 2px 4px; justify-content: center; align-items: center; gap: 2px; flex-shrink: 0; border-radius: 12px 12px 0px 0px; border-top: ${
                  item.winYn === 'Y'
                    ? '1px solid #FF4D00;'
                    : '1px solid #0038FF;'
                } border-right: ${
                  item.winYn === 'Y'
                    ? '1px solid #FF4D00;'
                    : '1px solid #0038FF;'
                } border-left: ${
                  item.winYn === 'Y'
                    ? '1px solid #FF4D00;'
                    : '1px solid #0038FF;'
                } background: #0038FF;">
                  
                  <div style="display: flex; flex-direction: row; gap: 5px;">
                    ${
                      item.winYn === 'Y'
                        ? `<div style="display: flex; width: 15px; height: 15px; background: #FF5C00; justify-content: center; align-items: center; margin-top: 2px;">
                              <span style="color: #FFF; font-size: 10px; font-family: SUIT; font-style: normal; font-weight: 800; line-height: 135%; letter-spacing: -0.1px; text-align: center;">낙</span>
                            </div>`
                        : ''
                    }
                    ${
                      item.interest === 'Y'
                        ? `
                      <div style="display: flex; width: 15px; height: 16px; flex-direction: column; justify-content: center; flex-shrink: 0; background: #00A980; margin-top: 2px;">
                        <span style="color: #FFF; text-align: center; font-family: SUIT; font-size: 10px; font-style: normal; font-weight: 800; line-height: 135%; letter-spacing: -0.1px;">
                          관
                        </span>
                      </div>
                      `
                        : ``
                    }
                      <h1 style="color: #FFF; text-align: center; font-family: SUIT; font-size: 14px; font-style: normal; font-weight: 800; line-height: 135%; letter-spacing: -0.14px;">
                        ${item.usage}
                      </h1>
                  </div>
                </div>
                <div style="width: 100px; height: 59px; border-radius: 0px 0px 12px 0px; background: #FFF; display:flex; align-items: start; justify-content: center; flex-direction: column; border: ${
                  item.winYn === 'Y'
                    ? '1px solid #FF4D00;'
                    : '1px solid #0038FF;'
                }">
                  <div style="display:flex; flex-direction:row; margin-left: 10px; gap: 5px;">
                    <span style="color: #000001; font-family: SUIT; font-size: 13px; font-style: normal; font-weight: 700; line-height: 135%; letter-spacing: -0.26px;">
                      ${NumToHan(parseInt(item.amount))} 
                    </span>
                    <span style="color: #676767; font-family: SUIT; font-size: 12px; font-style: normal; font-weight: 600; line-height: 135%; letter-spacing: -0.5px;">
                      ${'(' + item.ratio}%)
                    </span>
                  </div>
                  <div style="display:flex; flex-direction:row; margin-left: 10px; gap: 5px;">
                    <span style="color: #676767; text-align: right; font-family: SUIT; font-size: 10px; font-style: normal; font-weight: 600; line-height: 135%; letter-spacing: -0.1px;">
                      건물
                    </span>
                    <span style="color: #000001; text-align: right; font-family: SUIT; font-size: 10px; font-style: normal; font-weight: 600; line-height: 135%; letter-spacing: -0.1px;">
                      ${item.buildingArea === '' ? 0 : item.buildingArea}
                    </span>
                  </div>
                  <div style="display:flex; flex-direction:row; margin-left: 10px; gap: 5px;">
                    <span style="color: #676767; text-align: right; font-family: SUIT; font-size: 10px; font-style: normal; font-weight: 600; line-height: 135%; letter-spacing: -0.1px;">
                      토지
                    </span>
                    <span style="color: #000001; text-align: right; font-family: SUIT; font-size: 10px; font-style: normal; font-weight: 600; line-height: 135%; letter-spacing: -0.1px;">
                      ${item.landArea === '' ? 0 : item.landArea}
                    </span>
                  </div>
                </div>
                <div style="position: absolute; left: 1px; bottom: -10px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none">
                  <path d="M0 11.8821V0.25C0 0.111929 0.111929 0 0.25 0H7.54802C7.74457 0 7.86425 0.21637 7.75979 0.382866L0.46177 12.015C0.328402 12.2275 0 12.133 0 11.8821Z" fill=${
                    item.winYn === 'Y' ? '#FF4D00' : '#0038FF'
                  } />
                  <path d="M1 9.56322V0H7L1 9.56322Z" fill="white"/>
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

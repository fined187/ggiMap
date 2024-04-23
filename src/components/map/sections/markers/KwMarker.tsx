import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import { NumToHan } from '@/utils/NumToHan'
import { Marker } from 'react-naver-maps'

interface KwMarkerProps {
  item: MapItem
  formData: Form
}

export default function KwMarker({ item, formData }: KwMarkerProps) {
  return (
    <>
      {formData.map.zoom! > 15 ? (
        <>
          {/* // <Marker
          //   position={{
          //     lat: item.y,
          //     lng: item.x,
          //   }}
          //   icon={{
          //     content: `
          //         <div style="display:flex; flex-direction:row;">
          //           <svg xmlns="http://www.w3.org/2000/svg" width="35" height="32" viewBox="0 0 35 32" fill="none">
          //             <mask id="path-1-inside-1_228_711" fill="white">
          //             <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 0C7.83502 0 0 7.83502 0 17.5V32H17.5H35V0H17.5Z"/>
          //             </mask>
          //             <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 0C7.83502 0 0 7.83502 0 17.5V32H17.5H35V0H17.5Z" fill="white"/>
          //             <path d="M0 32H-1V33H0V32ZM35 32V33H36V32H35ZM35 0H36V-1H35V0ZM1 17.5C1 8.3873 8.3873 1 17.5 1V-1C7.28273 -1 -1 7.28273 -1 17.5H1ZM1 32V17.5H-1V32H1ZM17.5 31H0V33H17.5V31ZM35 31H17.5V33H35V31ZM34 0V32H36V0H34ZM17.5 1H35V-1H17.5V1Z" fill="#1C8D00" mask="url(#path-1-inside-1_228_711)"/>
          //           </svg>
          //           <div style="display:flex; width: 56px; height: 32px; flex-shrink: 0; border-radius: 0px 75px 75px 0px; background: #1C8D00; justify-content:center; align-items:center;">
          //             <h1 style="font-size: 12px; color: white; font-family: SUIT; font-style: normal; font-weight: 800; line-height: 110%; letter-spacing: -0.24px;">
          //               ${NumToHan(parseInt(item.amount ?? 0))}
          //             </h1>
          //           </div>
          //         </div>
          //         `,
          //   }}
          // /> */}
          null
        </>
      ) : formData.map.zoom! <= 15 ? (
        <Marker
          position={{
            lat: item.y,
            lng: item.x,
          }}
          icon={{
            content: `
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
            <g filter="url(#filter0_d_228_706)">
              <circle cx="5.5" cy="3.5" r="3.5" fill="#1C8D00"/>
              <circle cx="5.5" cy="3.5" r="3.25" stroke="white" stroke-width="0.5"/>
            </g>
            <defs>
              <filter id="filter0_d_228_706" x="0" y="0" width="11" height="11" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="2"/>
                <feGaussianBlur stdDeviation="1"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_228_706"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_228_706" result="shape"/>
              </filter>
            </defs>
          </svg>
            `,
          }}
        />
      ) : null}
    </>
  )
}

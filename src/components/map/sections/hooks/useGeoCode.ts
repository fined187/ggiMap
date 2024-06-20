import { Auth } from '@/models/Auth'
import { NaverMap } from '@/models/Map'
import { Dispatch, SetStateAction, useCallback } from 'react'

export const useGeoCode = (
  address: string,
  map: NaverMap | null,
  setAuth: Dispatch<SetStateAction<Auth>>,
) => {
  if (map) {
    if (window.naver?.maps.Service?.geocode !== undefined) {
      window.naver.maps.Service?.geocode(
        {
          query: address,
        },
        (status: any, response: any) => {
          if (status === window.naver.maps?.Service?.Status?.ERROR) {
            return
          }
          const result = response.v2.addresses[0]
          const { x, y } = result ?? { point: { x: 0, y: 0 } }
          setAuth((prev: any) => {
            return {
              ...prev,
              lat: Number(y),
              lng: Number(x),
            }
          })
          map.setCenter({
            lat: Number(y),
            lng: Number(x),
          })
        },
      )
    }
  }
}

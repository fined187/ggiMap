import { jusoProps } from '@/models/Juso'
import { Dispatch, SetStateAction, useState } from 'react'

export const useReverseGeoCode = async (
  lat: number,
  lng: number,
  // setGetGungu: Dispatch<SetStateAction<string>>,
  setJuso: Dispatch<SetStateAction<jusoProps>>,
) => {
  let getGungu = ''
  if (window.naver.maps?.Service?.reverseGeocode) {
    try {
      const result: any = await new Promise((resolve, reject) => {
        window.naver.maps.Service.reverseGeocode(
          {
            location: new window.naver.maps.LatLng(lat, lng),
          },
          (status: any, response: any) => {
            if (status !== window.naver.maps.Service.Status.OK) {
              reject('주소를 찾을 수 없습니다.')
            } else {
              resolve(response.result.items[0].addrdetail)
            }
          },
        )
      })
      setJuso((prev) => {
        return {
          ...prev,
          topSido: result.sido,
          topGungu:
            result.sigugun.split(' ')[0] === ''
              ? '세종시'
              : result.sigugun.split(' ')[0],
          topDong: result.dongmyun,
        }
      })
      if (
        result.sigugun.split(' ')[0].match(/시$/) &&
        !result.sigugun.split(' ')[1]
      ) {
        getGungu = (result.sigugun.split(' ')[0])
      } else if (
        result.sigugun.split(' ')[1] &&
        result.sigugun.split(' ')[1].match(/구$/)
      ) {
        getGungu = (result.sigugun.split(' ')[1])
        setJuso((prev) => {
          return {
            ...prev,
            topGungu: result.sigugun,
          }
        })
      }
      return result
    } catch (error) {
      alert(error)
    }
  }
}

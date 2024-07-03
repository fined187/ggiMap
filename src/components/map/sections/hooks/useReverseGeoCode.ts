import { jusoProps } from '@/models/Juso'
import { Dispatch, SetStateAction } from 'react'

interface ReverseGeoCodeResult {
  sido: string
  sigugun: string
  dongmyun: string
}

interface ReverseGeoCodeOptions {
  lat: number
  lng: number
  setJuso: Dispatch<SetStateAction<jusoProps>>
}

const reverseGeocode = async (
  lat: number,
  lng: number,
): Promise<ReverseGeoCodeResult> => {
  return new Promise((resolve, reject) => {
    window.naver.maps.Service.reverseGeocode(
      {
        location: new window.naver.maps.LatLng(lat, lng),
      },
      (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          reject(new Error('주소를 찾을 수 없습니다.'))
        } else {
          resolve(response.result.items[0].addrdetail)
        }
      },
    )
  })
}

const processResult = (result: ReverseGeoCodeResult) => {
  let getGungu = ''
  const sigugunParts = result.sigugun.split(' ')
  let topGungu = sigugunParts[0] === '' ? '세종시' : sigugunParts[0]

  if (sigugunParts.length === 1 && sigugunParts[0].match(/시$/)) {
    // 첫 번째 파트가 '시'로 끝나는 경우
    getGungu = sigugunParts[0]
  } else if (sigugunParts[1] && sigugunParts[1].match(/구$/)) {
    // 두 번째 파트가 '구'로 끝나는 경우
    getGungu = sigugunParts[1]
    topGungu = `${sigugunParts[0]} ${sigugunParts[1]}`
  }

  return {
    topSido: result.sido,
    topGungu,
    topDong: result.dongmyun,
    getGungu,
  }
}

export const useReverseGeoCode = async ({
  lat,
  lng,
  setJuso,
}: ReverseGeoCodeOptions) => {
  if (!window.naver.maps?.Service?.reverseGeocode) {
    alert('Reverse geocode service is not available.')
    return
  }

  try {
    const result = await reverseGeocode(lat, lng)
    const { topSido, topGungu, topDong, getGungu } = processResult(result)

    setJuso((prev) => ({
      ...prev,
      topSido,
      topGungu,
      topDong,
    }))

    return result
  } catch (error) {
    alert(error)
  }
}

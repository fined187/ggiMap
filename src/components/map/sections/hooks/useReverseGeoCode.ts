import { jusoProps } from '@/models/Juso'
import { jusoAtom } from '@/store/atom/map'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

interface ReverseGeoCodeResult {
  sido: string
  sigugun: string
  dongmyun: string
}

interface ReverseGeoCodeOptions {
  lat: number
  lng: number
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

export const useReverseGeoCode = () => {
  const setJuso = useSetRecoilState<jusoProps>(jusoAtom)

  const performReverseGeocode = useCallback(
    async ({ lat, lng }: ReverseGeoCodeOptions) => {
      if (!window.naver.maps?.Service?.reverseGeocode) {
        return
      }
      try {
        const result = await reverseGeocode(lat, lng)
        const processedResult = processResult(result)

        setJuso((prev) => ({
          ...prev,
          topSido: processedResult.topSido,
          topGungu: processedResult.topGungu,
          topDong: processedResult.topDong,
        }))

        return processedResult
      } catch (error) {
        alert(error)
      }
    },
    [],
  )
  return { performReverseGeocode }
}

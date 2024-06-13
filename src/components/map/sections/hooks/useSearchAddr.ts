export const useSearchAddr = async (lat: number, lng: number) => {
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
      //   // 주소 설정
      //   setTopJuso({
      //     sido: result.sido,
      //     gungu:
      //       result.sigugun.split(' ')[0] === ''
      //         ? '세종시'
      //         : result.sigugun.split(' ')[0],
      //     dong: result.dongmyun,
      //   })
      //   // 군구 설정
      //   if (
      //     result.sigugun.split(' ')[0].match(/시$/) &&
      //     !result.sigugun.split(' ')[1]
      //   ) {
      //     setGetGungu(result.sigugun.split(' ')[0])
      //   } else if (
      //     result.sigugun.split(' ')[1] &&
      //     result.sigugun.split(' ')[1].match(/구$/)
      //   ) {
      //     setGetGungu(result.sigugun.split(' ')[1])
      //   }
      return result
    } catch (error) {
      alert(error)
    }
  }
}

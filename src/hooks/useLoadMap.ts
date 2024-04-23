import { useEffect } from 'react'

export default function useLoadMap() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_API}&submodules=panorama`
  }, [])
}

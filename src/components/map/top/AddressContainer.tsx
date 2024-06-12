import { Dispatch, SetStateAction } from 'react'
import TopAddress from './TopAddress'

type JusoProps = {
  sido: string
  gungu: string
  dong: string
}

interface AddressContainerProps {
  topJuso: JusoProps
  setTopJuso: Dispatch<SetStateAction<JusoProps>>
  openCursor: boolean
  setOpenCursor: Dispatch<SetStateAction<boolean>>
  range: number
  setRange: Dispatch<SetStateAction<number>>
  setBottomJuso: Dispatch<SetStateAction<JusoProps>>
}

const AddressContainer = (props: AddressContainerProps) => {
  const {
    topJuso,
    setTopJuso,
    openCursor,
    setOpenCursor,
    range,
    setRange,
    setBottomJuso,
  } = props

  const addressConfigs = [
    { SidoAddr: true, GunguAddr: false, DongAddr: false, isEnd: false },
    { SidoAddr: false, GunguAddr: true, DongAddr: false, isEnd: false },
    { SidoAddr: false, GunguAddr: false, DongAddr: true, isEnd: true },
  ]

  return (
    <>
      {addressConfigs.map((config, index) => (
        <TopAddress
          key={index}
          {...config}
          topJuso={topJuso}
          setTopJuso={setTopJuso}
          openCursor={openCursor}
          setOpenCursor={setOpenCursor}
          getGungu={topJuso.gungu}
          range={range}
          setRange={setRange}
          setBottomJuso={setBottomJuso}
        />
      ))}
    </>
  )
}

export default AddressContainer

import { Dispatch, SetStateAction } from 'react'
import TopAddress from './TopAddress'

interface AddressContainerProps {
  openCursor: boolean
  setOpenCursor: Dispatch<SetStateAction<boolean>>
  range: number
  setRange: Dispatch<SetStateAction<number>>
}

const AddressContainer = (props: AddressContainerProps) => {
  const { openCursor, setOpenCursor, range, setRange } = props

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
          openCursor={openCursor}
          setOpenCursor={setOpenCursor}
          range={range}
          setRange={setRange}
        />
      ))}
    </>
  )
}

export default AddressContainer

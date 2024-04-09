import { Form } from '@/models/Form'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { Container as MapDiv, NaverMapProps, useMap } from 'react-naver-maps'
import GGMap from './GGMap'

declare global {
  interface Window {
    naver: any
  }
}

interface Props {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
}

export default function Map({ formData, setFormData }: Props) {
  return (
    <MapDiv
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <GGMap formData={formData} setFormData={setFormData} />
    </MapDiv>
  )
}

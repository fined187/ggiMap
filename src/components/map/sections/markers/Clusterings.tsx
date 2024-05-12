import { Form } from '@/models/Form'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { Marker, MarkerProps, NaverMapProps } from 'react-naver-maps'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'
import { NaverMap } from '@/models/Map'
import Clustering from './Clustering'

type ItemProps = {
  sd: string
  sgg: string
  umd: string
  count?: number
  x: number
  y: number
}
interface ClusteringProps {
  formData: Form
  item: ItemProps[]
}

export default function Clusterings({ formData, item }: ClusteringProps) {
  return (
    <>
      {item && item.length > 0
        ? item?.map((item, index) => {
            return <Clustering key={index} item={item} />
          })
        : null}
    </>
  )
}

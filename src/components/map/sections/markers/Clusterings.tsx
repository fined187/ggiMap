import { Form } from '@/models/Form'
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

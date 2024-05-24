import { KmItems } from '@/models/ListItems'
import Form from './Form'
import { MapItems } from '@/models/MapItem'

function Km({ kmItem, index }: { kmItem: MapItems; index: number }) {
  return <Form item={kmItem} index={index} />
}

export default Km

import { KmItems } from '@/models/ListItems'
import Form from './Form'

function Km({ kmItem, index }: { kmItem: KmItems; index: number }) {
  return <Form item={kmItem} index={index} />
}

export default Km

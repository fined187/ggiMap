import { GmgItems } from '@/models/ListItems'
import Form from './Form'

function Gmg({ gmgItem, index }: { gmgItem: GmgItems; index: number }) {
  return <Form item={gmgItem} index={index} />
}

export default Gmg

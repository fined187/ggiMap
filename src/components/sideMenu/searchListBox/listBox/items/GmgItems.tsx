import { GmgItems } from '@/models/ListItems'
import Form from './Form'

function Gmg({ gmgItem }: { gmgItem: GmgItems }) {
  return <Form item={gmgItem} />
}

export default Gmg

import { css } from '@emotion/react'
import KwForm from './KwForm'
import { KwItems } from '@/models/ListItems'

function Kw({ kwItem }: { kwItem: KwItems }) {
  return <KwForm item={kwItem} />
}

export default Kw

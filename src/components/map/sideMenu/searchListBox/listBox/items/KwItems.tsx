import { css } from '@emotion/react'
import KwForm from './KwForm'
import { KwItems } from '@/models/ListItems'

function Kw({ kwItem, index }: { kwItem: KwItems; index: number }) {
  return <KwForm item={kwItem} index={index} />
}

export default Kw

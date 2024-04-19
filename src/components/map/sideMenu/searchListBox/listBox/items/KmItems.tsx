import { KmItems } from '@/models/ListItems'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import usePathUrl from '../hooks/usePathUrl'
import Form from './Form'

function Km({ kmItem }: { kmItem: KmItems }) {
  const url = usePathUrl()
  return <Form item={kmItem} />
}

export default Km

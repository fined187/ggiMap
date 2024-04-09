import Flex from '@/components/shared/Flex'
import ListRow from '@/components/shared/ListRow'
import Text from '@/components/shared/Text'
import { Form } from '@/models/Form'
import { MapItem } from '@/models/MapItem'
import { mapAtom } from '@/store/atom/map'
import { css } from '@emotion/react'
import { useRecoilState } from 'recoil'

interface ResultProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  item: MapItem
}

function Result({ formData, setFormData, item }: ResultProps) {
  return (
    <Flex justify="center" align="center" css={ContainerStyle}>
      <ListRow
        left={<Text>{item.id}</Text>}
        right={<Text>{item.usage}</Text>}
        contents={<Text>{item.id}</Text>}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  display: flex;
  position: relative;
  width: 100%;
  height: 208px;
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  top: 74px;
  padding: 15px 0;
`

export default Result

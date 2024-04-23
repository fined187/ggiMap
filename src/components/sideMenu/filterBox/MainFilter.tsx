import Flex from '@/components/shared/Flex'
import Text from '@/components/shared/Text'
import { FILTERS } from '@/constants'
import { Form } from '@/models/Form'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'
import FilterProps from './FilterProps'

interface SearchBoxProps {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
}

export default function MainFilter({ formData, setFormData }: SearchBoxProps) {
  return (
    <Flex justify="center" direction="row" css={ContainerStyle}>
      <FilterProps
        dataType={formData.km}
        colorType={colors.filterBlue}
        bgColorType={colors.filterBgBlue}
        onButtonClick={() => setFormData({ ...formData, km: !formData.km })}
        textType={FILTERS.AUTION}
      />
      <FilterProps
        dataType={formData.gm}
        colorType={colors.filterGreen}
        bgColorType={colors.filterBgGreen}
        onButtonClick={() => setFormData({ ...formData, gm: !formData.gm })}
        textType={FILTERS.CAMCO}
      />
      <FilterProps
        dataType={formData.kw}
        colorType={colors.filterEmerald}
        bgColorType={colors.filterBgEmerald}
        onButtonClick={() => setFormData({ ...formData, kw: !formData.kw })}
        textType={FILTERS.EXPRECTED}
      />
      <FilterProps
        dataType={formData.gg}
        colorType={colors.filterDarkBlue}
        bgColorType={colors.filterBgDarkBlue}
        onButtonClick={() => setFormData({ ...formData, gg: !formData.gg })}
        textType={FILTERS.SOLD}
      />
    </Flex>
  )
}

const ContainerStyle = css`
  width: 100%;
  height: 47px;
  background-color: white;
  gap: 10px;
  border: none;
`

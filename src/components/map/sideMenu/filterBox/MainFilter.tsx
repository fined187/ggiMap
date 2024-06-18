import Flex from '@/components/shared/Flex'
import { FILTERS } from '@/constants'
import { Form } from '@/models/Form'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import { Dispatch, SetStateAction } from 'react'
import FilterProps from './FilterProps'
import { MAP_KEY } from '../../sections/hooks/useMap'
import useSWR from 'swr'
import { NaverMap } from '@/models/Map'

interface SearchBoxProps {
  formData: Form
  setFormData: Dispatch<SetStateAction<Form>>
}

export default function MainFilter({ formData, setFormData }: SearchBoxProps) {
  const { data: map } = useSWR<NaverMap>(MAP_KEY)
  return (
    <Flex justify="center" direction="row" css={ContainerStyle}>
      <FilterProps
        dataType={formData.km}
        colorType={colors.white}
        bgColorType={colors.kmBlue}
        onButtonClick={() => setFormData({ ...formData, km: !formData.km })}
        textType={FILTERS.AUTION}
        isDisabled={Boolean(map?.getZoom()! < 15)}
      />
      <FilterProps
        dataType={formData.kw}
        colorType={colors.white}
        bgColorType={colors.kwGreen}
        onButtonClick={() => setFormData({ ...formData, kw: !formData.kw })}
        textType={FILTERS.EXPECTED}
        isDisabled={Boolean(map?.getZoom()! < 15)}
      />
      <FilterProps
        dataType={formData.gm}
        colorType={colors.white}
        bgColorType={colors.gmBlue}
        onButtonClick={() => setFormData({ ...formData, gm: !formData.gm })}
        textType={FILTERS.CAMCO}
        isDisabled={Boolean(map?.getZoom()! < 15)}
      />
      <FilterProps
        dataType={formData.gg}
        colorType={colors.white}
        bgColorType={colors.ggPurple}
        onButtonClick={() => setFormData({ ...formData, gg: !formData.gg })}
        textType={FILTERS.SOLD}
        isDisabled={Boolean(map?.getZoom()! < 15)}
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

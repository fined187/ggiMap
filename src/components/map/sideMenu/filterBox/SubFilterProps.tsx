import Text from '@/components/shared/Text'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import useSWR from 'swr'
import { MAP_KEY } from '../../sections/hooks/useMap'

interface SubFilter {
  checkedColor: string
  textType: string
  isSelected: boolean
  onButtonClick: () => void
  nowChecked?: boolean
  isBoxOpen?: boolean
}

export default function SubFilterProps({
  isSelected,
  checkedColor,
  textType,
  onButtonClick,
  nowChecked,
  isBoxOpen,
}: SubFilter) {
  const { data: map } = useSWR(MAP_KEY)
  return (
    <button
      css={FilterStyle}
      style={{
        position: 'relative',
        cursor: map?.getZoom() < 15 ? 'not-allowed' : 'pointer',
      }}
      disabled={map?.getZoom() < 15}
      onClick={onButtonClick}
    >
      <div
        css={dotStyle}
        style={{
          backgroundColor:
            isSelected && isBoxOpen && textType === '낙찰결과'
              ? colors.filterOrange
              : isSelected && isBoxOpen && textType === '용도'
              ? colors.filterDarkBlue
              : isSelected && isBoxOpen && textType === '감정가'
              ? colors.filterDarkBlue
              : isSelected && isBoxOpen && textType === '최저가'
              ? colors.filterDarkBlue
              : isSelected
              ? colors.textGray
              : '',
          right:
            textType.length === 2
              ? '5px'
              : textType.length === 3
              ? '0px'
              : '-5px',
          top: '0px',
        }}
      />
      <Text
        color={
          nowChecked && isBoxOpen && textType === '낙찰결과'
            ? 'filterOrange'
            : nowChecked && isBoxOpen && textType === '용도'
            ? 'filterDarkBlue'
            : nowChecked && isBoxOpen && textType === '감정가'
            ? 'filterDarkBlue'
            : nowChecked && isBoxOpen && textType === '최저가'
            ? 'filterDarkBlue'
            : isSelected
            ? 'textGray'
            : 'textGray'
        }
        fontWeight="600"
        typography="t4"
      >
        {textType}
      </Text>
    </button>
  )
}

const dotStyle = css`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  position: absolute;
  top: 5px;
`

const FilterStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 67px;
  height: 100%;
`

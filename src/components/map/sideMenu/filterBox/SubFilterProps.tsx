import Text from '@/components/shared/Text'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'

interface SubFilter {
  checkedColor: string
  textType: string
  isSelected: boolean
  onButtonClick: () => void
  nowChecked?: boolean
}

export default function SubFilterProps({
  isSelected,
  checkedColor,
  textType,
  onButtonClick,
  nowChecked,
}: SubFilter) {
  return (
    <div
      css={FilterStyle}
      style={{
        position: 'relative',
      }}
      onClick={onButtonClick}
    >
      <div
        css={dotStyle}
        style={{
          backgroundColor:
            isSelected && nowChecked
              ? checkedColor
              : isSelected
              ? '#545454'
              : '',
          right:
            textType.length === 2
              ? '7px'
              : textType.length === 3
              ? '2px'
              : '-7px',
        }}
      />
      <Text
        color={
          isSelected && nowChecked
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
    </div>
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
  cursor: pointer;
`

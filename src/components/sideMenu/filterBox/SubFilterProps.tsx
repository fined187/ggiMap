import Text from '@/components/shared/Text'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'

interface SubFilter {
  checkedColor: string
  textType: string
  isSelected: boolean
  onButtonClick: () => void
}

export default function SubFilterProps({
  isSelected,
  checkedColor,
  textType,
  onButtonClick,
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
          backgroundColor: isSelected ? checkedColor : '#545454',
          right:
            textType.length === 2
              ? '11px'
              : textType.length === 3
              ? '5px'
              : '-1px',
        }}
      />
      <Text
        color={isSelected ? 'filterDarkBlue' : 'textGray'}
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
  top: 14px;
`

const FilterStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 67px;
  height: 100%;
  cursor: pointer;
`

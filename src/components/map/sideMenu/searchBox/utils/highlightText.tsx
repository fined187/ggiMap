import { colors } from '@/styles/colorPalette'
import styled from '@emotion/styled'

const highlightText = (text: string, highlight: string) => {
  if (!highlight) return text

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Highlight key={index}>{part}</Highlight>
        ) : (
          part
        ),
      )}
    </>
  )
}

export default highlightText

const Highlight = styled.span`
  color: ${colors.winOrange};
  font-weight: bold;
`

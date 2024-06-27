import styled from '@emotion/styled'

const useHighlightText = (text: string, highlight: string) => {
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

export default useHighlightText

const Highlight = styled.span`
  color: orange;
  font-weight: bold;
`

import styled from '@emotion/styled'
import Text from '../shared/Text'
import { css } from '@emotion/react'

interface TableFrameProps {
  title: string
  contents: string[] | string | React.ReactNode
  background?: string
  height?: string
}

export default function TableFrame({
  title,
  contents,
  background,
  height,
}: TableFrameProps) {
  return (
    <ContainerFrame height={height}>
      <CategoryFrame background={background} height={height}>
        <Text css={CategoryTextStyle}>{title}</Text>
      </CategoryFrame>
      <ContentsFrame height={height}>
        <Text css={ContentsTextStyle}>{contents}</Text>
      </ContentsFrame>
    </ContainerFrame>
  )
}

const ContainerFrame = styled.div<{ height?: string }>`
  width: 700px;
  height: ${({ height }) => height + 'px' || '65px'};
  flex-shrink: 0;
  flex-direction: row;
  display: flex;
  position: absolute;
`

const CategoryFrame = styled.div<{ background?: string; height?: string }>`
  display: flex;
  width: 100px;
  height: ${({ height }) => height + 'px' || '65px'};
  padding: 21px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  background: ${({ background }) => background || '#F0F3FF'};
  border-bottom: 1px solid #bcbcbc;
`

const ContentsFrame = styled.div<{ height?: string }>`
  display: flex;
  width: 600px;
  height: ${({ height }) => height + 'px' || '65px'};
  padding: 21px 8px;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-bottom: 1px solid #bcbcbc;
`

const CategoryTextStyle = css`
  color: #000001;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  letter-spacing: -0.32px;
`

const ContentsTextStyle = css`
  color: #000001;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%;
  letter-spacing: -0.32px;
`

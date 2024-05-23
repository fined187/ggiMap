import styled from '@emotion/styled'
import css from 'styled-jsx/css'

export const Distance = styled.div<{ mode: string }>`
  display: flex;
  width: 42px;
  height: 44px;
  padding: 4px 0px;
  align-items: center;
  border-radius: 4px 4px 0px 0px;
  flex-direction: column;
  border-bottom: 0.5px solid #000001;
  background: ${({ mode }) => (mode === 'distance' ? '#DC4798' : 'white')};
  cursor: pointer;
`

export const TextStyle = styled.span<{ mode: string }>`
  color: ${({ mode }) => (mode === 'distance' ? 'white' : '#000001')};
  text-align: center;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.11px;
`

export const Area = styled.div<{ area: boolean }>`
  display: flex;
  width: 42px;
  height: 44px;
  padding: 4px 0px;
  flex-direction: column;
  align-items: center;
  border-radius: 0px 0px 4px 4px;
  background: ${({ area }) => (area ? '#DC4798' : 'white')};
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

export const AreaTextStyle = styled.span<{ area: boolean }>`
  color: ${({ area }) => (area ? 'white' : '#000001')};
  text-align: center;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.11px;
`

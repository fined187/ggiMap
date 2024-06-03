import styled from '@emotion/styled'
import Input from '../shared/Input'
import Text from '../shared/Text'
import { css } from '@emotion/react'
import Flex from '../shared/Flex'
import Spacing from '../shared/Spacing'
import { InterestFormData } from '@/models/Interest'

interface AlertCheckProps {
  formData: InterestFormData
  setFormData: React.Dispatch<React.SetStateAction<InterestFormData>>
}

export default function AlertCheck({ formData, setFormData }: AlertCheckProps) {
  return (
    <Container>
      <Flex direction="row" align="center">
        <Input
          type="radio"
          name="alert"
          css={RadioStyle}
          checked={formData?.smsNotificationYn === 'Y'}
          onChange={(e) => {
            setFormData((prev) => {
              return {
                ...prev,
                smsNotificationYn: 'Y',
              }
            })
          }}
        />
        <Text css={TextStyle}>알림을 받겠습니다</Text>
      </Flex>
      <Spacing size={10} />
      <Flex direction="row" align="center">
        <Input
          type="radio"
          name="alert"
          css={RadioStyle}
          checked={formData?.smsNotificationYn === 'N'}
          onChange={(e) => {
            setFormData((prev) => {
              return {
                ...prev,
                smsNotificationYn: 'N',
              }
            })
          }}
        />
        <Text css={TextStyle}>수신거부</Text>
        <Spacing direction="horizontal" size={100} />
        <Text css={TextStyle2}>본 물건에 대한 알림이 발송되지 않습니다</Text>
      </Flex>
    </Container>
  )
}

const Container = styled.div`
  width: 740px;
  height: 100px;
  padding: 20px 10px;
  flex-direction: column;
  position: relative;
  border-top: 2px solid #e5e5e5;
  border-bottom: 2px solid #e5e5e5;
`

const RadioStyle = css`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #bcbcbc;
  background: #fff;
  margin-right: 10px;
`

const TextStyle = css`
  color: #000001;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%;
  letter-spacing: -0.32px;
`

const TextStyle2 = css`
  color: #9d9999;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%;
  letter-spacing: -0.32px;
`

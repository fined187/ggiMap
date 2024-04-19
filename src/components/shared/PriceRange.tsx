import { Form } from '@/models/Form'
import { css } from '@emotion/react'
import Flex from './Flex'
import Input from './Input'
import Text from './Text'

interface PriceRangeProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function PriceRange({ formData, setFormData }: PriceRangeProps) {
  const handldeFromPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.lastFilter === 3) {
      setFormData({
        ...formData,
        fromAppraisalAmount: Number(e.target.value),
      })
    } else if (formData.lastFilter === 4) {
      setFormData({
        ...formData,
        fromMinimumAmount: Number(e.target.value),
      })
    }
  }
  const handldeToPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.lastFilter === 3) {
      setFormData({
        ...formData,
        toAppraisalAmount: Number(e.target.value),
      })
    } else if (formData.lastFilter === 4) {
      setFormData({
        ...formData,
        toMinimumAmount: Number(e.target.value),
      })
    }
  }

  const handlePriceBtn = (id: string) => {
    if (id === 'fromPriceMin') {
      if (formData.lastFilter === 3) {
        setFormData({
          ...formData,
          fromAppraisalAmount: formData.fromAppraisalAmount - 10000000,
        })
      } else if (formData.lastFilter === 4) {
        setFormData({
          ...formData,
          fromMinimumAmount: formData.fromMinimumAmount - 10000000,
        })
      }
    } else if (id === 'fromPriceMax') {
      if (formData.lastFilter === 3) {
        setFormData({
          ...formData,
          fromAppraisalAmount: formData.fromAppraisalAmount + 10000000,
        })
      } else if (formData.lastFilter === 4) {
        setFormData({
          ...formData,
          fromMinimumAmount: formData.fromMinimumAmount + 10000000,
        })
      }
    } else if (id === 'toPriceMin') {
      if (formData.lastFilter === 3) {
        setFormData({
          ...formData,
          toAppraisalAmount: formData.toAppraisalAmount - 10000000,
        })
      } else if (formData.lastFilter === 4) {
        setFormData({
          ...formData,
          toMinimumAmount: formData.toMinimumAmount - 10000000,
        })
      }
    } else if (id === 'toPriceMax') {
      if (formData.lastFilter === 3) {
        setFormData({
          ...formData,
          toAppraisalAmount: formData.toAppraisalAmount + 10000000,
        })
      } else if (formData.lastFilter === 4) {
        setFormData({
          ...formData,
          toMinimumAmount: formData.toMinimumAmount + 10000000,
        })
      }
    }
  }

  return (
    <Flex align="center" justify="space-between" css={ContainerStyle}>
      <Flex
        direction="row"
        style={{
          position: 'absolute',
          top: '10px',
          left: 0,
        }}
      >
        <Flex
          id="fromPriceMin"
          align="center"
          justify="center"
          css={BoxStyle}
          onClick={(e) => {
            handlePriceBtn(e.currentTarget.id)
          }}
        >
          -
        </Flex>
        <Input
          type="text"
          inputMode="numeric"
          value={
            formData.lastFilter === 3
              ? formData.fromAppraisalAmount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : formData.fromMinimumAmount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          style={{
            height: '25px',
            width: '90px',
            borderTop: '1px solid #9d9999',
            borderBottom: '1px solid #9d9999',
          }}
          onChange={handldeFromPriceChange}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value
              .replace(/[^0-9.]/g, '')
              .replace(/(\..*)\./g, '$1')
          }}
        />
        <Flex
          id="fromPriceMax"
          align="center"
          justify="center"
          css={BoxStyle}
          onClick={(e) => {
            handlePriceBtn(e.currentTarget.id)
          }}
        >
          +
        </Flex>
      </Flex>
      <Flex
        style={{
          position: 'absolute',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Text
          style={{
            color: '#999',
            textAlign: 'center',
            fontFamily: 'SUIT',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '300',
            lineHeight: '135%',
            letterSpacing: '-0.14px',
          }}
        >
          ~
        </Text>
      </Flex>
      <Flex
        direction="row"
        style={{
          position: 'absolute',
          top: '10px',
          right: 0,
        }}
      >
        <Flex
          id="toPriceMin"
          align="center"
          justify="center"
          css={BoxStyle}
          onClick={(e) => {
            handlePriceBtn(e.currentTarget.id)
          }}
        >
          -
        </Flex>
        <Input
          type="text"
          inputMode="numeric"
          value={
            formData.lastFilter === 3
              ? formData.toAppraisalAmount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : formData.toMinimumAmount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          style={{
            height: '25px',
            width: '90px',
            borderTop: '1px solid #9d9999',
            borderBottom: '1px solid #9d9999',
          }}
          onChange={handldeToPriceChange}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value
              .replace(/[^0-9.]/g, '')
              .replace(/(\..*)\./g, '$1')
          }}
        />
        <Flex
          id="toPriceMax"
          align="center"
          justify="center"
          css={BoxStyle}
          onClick={(e) => {
            handlePriceBtn(e.currentTarget.id)
          }}
        >
          +
        </Flex>
      </Flex>
    </Flex>
  )
}

const ContainerStyle = css`
  width: 320px;
  height: 40px;
  background-color: white;
  display: flex;
  position: relative;
`
const BoxStyle = css`
  width: 25px;
  height: 25px;
  border: 0.5px solid #9d9999;
  background: #ececec;
  cursor: pointer;
`

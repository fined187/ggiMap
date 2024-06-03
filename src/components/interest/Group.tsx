import { css } from '@emotion/react'
import Flex from '../shared/Flex'
import Input from '../shared/Input'
import { Dispatch, SetStateAction, useCallback } from 'react'
import Star5 from './icon/star5'
import Star4 from './icon/star4'
import Star3 from './icon/star3'
import Star2 from './icon/star2'
import Star1 from './icon/star1'
import Star0 from './icon/star0'
import { InterestFormData } from '@/models/Interest'

interface GroupElementsProps {
  formData: InterestFormData
  setFormData: Dispatch<SetStateAction<InterestFormData>>
}

export default function GroupElements({
  formData,
  setFormData,
}: GroupElementsProps) {
  const handleChecked = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      setFormData({
        ...formData,
        importance: value,
        interestInfo: {
          ...formData.interestInfo,
          starRating: value,
        },
      })
    },
    [formData, setFormData],
  )
  return (
    <Flex css={ContainerStyle}>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          position: 'relative',
        }}
      >
        <Input
          type="radio"
          css={RadioBtnStyle}
          name="check"
          value={'0'}
          id="check0"
          checked={formData.importance === '0'}
          onChange={(e) => {
            handleChecked(e)
          }}
        />
        <Star0 />
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <Input
          type="radio"
          css={RadioBtnStyle}
          name="check"
          id="check1"
          value={'1'}
          checked={formData.importance === '1'}
          onChange={(e) => {
            handleChecked(e)
          }}
        />
        <Star1 />
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <Input
          type="radio"
          css={RadioBtnStyle}
          name="check"
          id="check2"
          value={'2'}
          checked={formData.importance === '2'}
          onChange={(e) => {
            handleChecked(e)
          }}
        />
        <Star2 />
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <Input
          type="radio"
          css={RadioBtnStyle}
          name="check"
          id="check3"
          value={'3'}
          checked={formData.importance === '3'}
          onChange={(e) => {
            handleChecked(e)
          }}
        />
        <Star3 />
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <Input
          type="radio"
          css={RadioBtnStyle}
          name="check"
          id="check4"
          value={'4'}
          checked={formData.importance === '4'}
          onChange={(e) => {
            handleChecked(e)
          }}
        />
        <Star4 />
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <Input
          type="radio"
          css={RadioBtnStyle}
          name="check"
          id="check5"
          value={'5'}
          checked={formData.importance === '5'}
          onChange={(e) => {
            handleChecked(e)
          }}
        />
        <Star5 />
      </div>
    </Flex>
  )
}

const ContainerStyle = css`
  width: 95%;
  height: 100%;
  flex-direction: row;
  gap: 10px;
  position: relative;
`

const RadioBtnStyle = css`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid #bdbdbd;
  background-color: #ffffff;
  margin-right: 5px;
  margin-top: -2px;
  cursor: pointer;
`

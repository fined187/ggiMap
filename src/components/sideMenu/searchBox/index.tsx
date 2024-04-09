import Logo from '@/components/icons/Logo'
import Search from '@/components/icons/Search'
import Flex from '@/components/shared/Flex'
import Input from '@/components/shared/Input'
import Spacing from '@/components/shared/Spacing'
import { Form } from '@/models/Form'
import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import MainFilter from '../filterBox/MainFilter'
import SubFilter from '../filterBox/SubFilter'
import DetailBox from '../filterBox/SubFilterDetail/DetailBox'

interface SearchBoxProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
}

export default function SearchBox({ formData, setFormData }: SearchBoxProps) {
  const [isBoxOpen, setIsBoxOpen] = useState({
    finished: false,
    usage: false,
    lowPrice: false,
    price: false,
  })

  return (
    <Flex id="searchBox" direction="column" align="center" css={ContainerStyle}>
      <Flex
        direction="row"
        justify="center"
        align="center"
        style={{
          gap: '10px',
          height: '60px',
          borderBottom: `1px solid ${colors.gray200}`,
          width: '100%',
        }}
      >
        <Logo />
        <Input type="text" placeholder="지역명, 지하철역" css={InputStyle} />
        <Search right="20" top="25" />
      </Flex>
      <Spacing size={10} />
      <MainFilter formData={formData} setFormData={setFormData} />
      <Spacing size={10} />
      <SubFilter
        formData={formData}
        setFormData={setFormData}
        isBoxOpen={isBoxOpen}
        setIsBoxOpen={setIsBoxOpen}
      />
      {formData.isSubFilterBoxOpen ? (
        <Flex css={animation}>
          <DetailBox
            formData={formData}
            setFormData={setFormData}
            isBoxOpen={isBoxOpen}
            setIsBoxOpen={setIsBoxOpen}
          />
        </Flex>
      ) : null}
    </Flex>
  )
}

const animation = css`
  animation: all 0.3s ease-in-out 0.3s fadeIn;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`

const ContainerStyle = css`
  position: relative;
  padding: 10px 20px 10px 20px;
  z-index: 10;
  background-color: white;
  width: 330px;
  min-height: 200px;
  max-height: 530px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease-in-out;
`
const InputStyle = css`
  width: 100%;
  height: 44px;
  border: none;
  font-family: 'suit';
  font-size: 18px;
  font-weight: 500;
  color: ${colors.black};
`

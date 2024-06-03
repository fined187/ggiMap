import Flex from '@/components/shared/Flex'
import Input from '@/components/shared/Input'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { InterestFormData } from '@/models/Interest'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

interface NoGroupBtnProps {
  openGroup: boolean
  setOpenGroup: React.Dispatch<React.SetStateAction<boolean>>
  formData: InterestFormData
  setFormData: React.Dispatch<React.SetStateAction<InterestFormData>>
}

export default function NoGroupBtn({
  openGroup,
  setOpenGroup,
  formData,
  setFormData,
}: NoGroupBtnProps) {
  const [isFocus, setIsFocus] = useState(true)
  const [groupName, setGroupName] = useState('')
  const categoriesFromIndex5 = formData?.categories?.slice(4) || []
  const rows = []
  for (let i = 0; i < categoriesFromIndex5.length; i += 4) {
    rows.push(categoriesFromIndex5.slice(i, i + 4))
  }

  useEffect(() => {
    if (formData.categories.length === 0) {
      setGroupName('미분류')
      setFormData((prev) => {
        return {
          ...prev,
          isNewCategory: false,
          interestInfo: {
            ...prev.interestInfo,
            category: '미분류',
          },
        }
      })
    } else {
      setGroupName(formData.interestInfo.category)
    }
  }, [formData.categories])
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ContainerStyle>
        <Flex
          direction="row"
          style={{
            width: '470px',
          }}
        >
          {isFocus ? (
            <InputStyle
              placeholder="그룹이름"
              onChange={(e) => {
                setFormData((prev) => {
                  return {
                    ...prev,
                    isNewCategory: true,
                    interestInfo: {
                      ...prev.interestInfo,
                      category: e.target.value,
                    },
                  }
                })
                setGroupName(e.target.value)
              }}
            />
          ) : (
            <ButtonStyle
              onClick={() => {
                setIsFocus(true)
              }}
            >
              <Text css={ButtonTextStyle}>
                {isFocus ? '미분류' : groupName}
              </Text>
              <Flex>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="#8C8C8C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Flex>
            </ButtonStyle>
          )}
          <Spacing direction="horizontal" size={10} />
          <Input
            type="radio"
            name="newGroup"
            style={{
              width: '15px',
              height: '15px',
              marginTop: '5px',
              marginRight: '5px',
            }}
            disabled={isFocus ? false : true}
            onClick={() => {
              setIsFocus(true)
            }}
            onChange={(e) => {
              setFormData((prev) => {
                return {
                  ...prev,
                  isNewCategory: true,
                }
              })
            }}
            checked={isFocus ? true : false}
          />
          <Text
            css={NewGroupRadioStyle}
            style={{
              color: isFocus ? '#000001' : '#8C8C8C',
            }}
          >
            새 그룹으로 등록
          </Text>
        </Flex>
        <Flex
          justify="end"
          align="end"
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onClick={() => {
            setOpenGroup(!openGroup)
          }}
        >
          <Text css={GroupListStyle}>
            {!openGroup ? '그룹 목록 열기' : '그룹 목록 닫기'}
          </Text>
        </Flex>
      </ContainerStyle>
      <Spacing size={20} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ContainerStyle>
          {formData?.categories?.slice(0, 4).map((category, index) => (
            <Flex
              key={index}
              style={{
                width: '110px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <Input
                type="radio"
                name="newGroup"
                style={{
                  width: '15px',
                  height: '15px',
                  marginTop: '5px',
                  marginRight: '5px',
                }}
                onClick={() => {
                  setIsFocus(false)
                  setGroupName(category)
                }}
                onChange={() => {
                  setGroupName(category)
                  setFormData((prev) => {
                    return {
                      ...prev,
                      isNewCategory: false,
                      interestInfo: {
                        ...prev.interestInfo,
                        category: category,
                      },
                    }
                  })
                }}
              />
              <Text css={NewGroupRadioStyle}>{category}</Text>
            </Flex>
          ))}
        </ContainerStyle>
        {!openGroup ? null : (
          <ContainerStyle
            style={{
              flexDirection: 'column',
            }}
          >
            {rows.map((row, index) => (
              <ContainerStyle key={index}>
                {row.map((category, index) => (
                  <CategoryFlex key={index}>
                    <Input
                      type="radio"
                      name="newGroup"
                      style={{
                        width: '15px',
                        height: '15px',
                        marginTop: '5px',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        setIsFocus(false)
                        setGroupName(category)
                        setFormData((prev) => {
                          return {
                            ...prev,
                            isNewCategory: false,
                            interestInfo: {
                              ...prev.interestInfo,
                              category: category,
                            },
                          }
                        })
                      }}
                      onChange={() => {
                        setGroupName(category)
                        setFormData((prev) => {
                          return {
                            ...prev,
                            isNewCategory: false,
                            interestInfo: {
                              ...prev.interestInfo,
                              category: category,
                            },
                          }
                        })
                      }}
                    />
                    <Text css={NewGroupRadioStyle}>{category}</Text>
                  </CategoryFlex>
                ))}
              </ContainerStyle>
            ))}
          </ContainerStyle>
        )}
      </div>
    </div>
  )
}

const ContainerStyle = styled.div`
  width: 570px;
  height: 100%;
  flex-direction: row;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex: 1;
`

const ButtonStyle = styled.button`
  display: flex;
  width: 135px;
  padding: 4px 8px 4px 4px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 4px;
  border: 1px solid #2a62c5;
  background: #fff;
  flex-direction: row;
`

const InputStyle = styled.input`
  display: flex;
  width: 135px;
  padding: 4px 8px 4px 4px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 4px;
  border: 1px solid #2a62c5;
  background: #fff;
  text-align: center;
  color: #2a62c5;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.32px;
  &:focus {
    outline: none;
  }
`

const ButtonTextStyle = css`
  color: #216cff;
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.32px;
`

const NewGroupRadioStyle = css`
  color: #000001;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%;
  letter-spacing: -0.32px;
  margin-top: 2px;
`

const GroupListStyle = css`
  color: #0075b1;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  letter-spacing: -0.32px;
`

const CategoryFlex = styled(Flex)`
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

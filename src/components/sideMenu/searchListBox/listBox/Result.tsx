import Flex from '@/components/shared/Flex'
import { Form } from '@/models/Form'
import { Items } from '@/models/ListItems'
import Header from './Header'
import styled from '@emotion/styled'
import ListSkeleton from './Skeleton'
import Km from './items/KmItems'

interface ResultProps {
  formData: Form
  setFormData: React.Dispatch<React.SetStateAction<Form>>
  listItems: Items | null
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
}

function Result({
  formData,
  setFormData,
  listItems,
  isOpen,
  setIsOpen,
  isLoading,
}: ResultProps) {
  return (
    <Flex
      direction="column"
      justify="start"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        listItems={listItems}
        isLoading={isLoading}
      />
      <Container isOpen={isOpen}>
        {listItems?.kmItems.map((item, index) =>
          isLoading ? (
            <ListSkeleton key={index} />
          ) : (
            <Km key={index} kmItem={item} />
          ),
        )}
      </Container>
    </Flex>
  )
}

const Container = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? 'calc(100% - 35px)' : '0px')};
  display: flex;
  position: relative;
  overflow-y: scroll;
  flex-direction: column;
`

export default Result

import MobileModal from '@/components/bidForm/MobileModal'
import {
  ComponentProps,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

type PDFProps = ComponentProps<typeof MobileModal>
type ModalOptions = Omit<PDFProps, 'isOpen'>

interface PDFContextValue {
  openModal: (options: ModalOptions) => void
}

const Context = createContext<PDFContextValue | undefined>(undefined)

const defaultValues: PDFProps = {
  isOpen: false,
  onClose: () => {},
  file: null,
}

export default function PDFContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [pdfState, setPDFState] = useState(defaultValues)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setElement(document.getElementById('portal-root'))
  }, [])

  const onClose = useCallback(() => {
    // Close modal and reset state
    setPDFState(defaultValues)
  }, [])

  const openModal = useCallback(
    ({ onClose: userOnClose, ...options }: ModalOptions) => {
      setPDFState({
        ...options,
        onClose: () => {
          userOnClose?.() // Execute user-defined close function if provided
          onClose() // Execute the internal close function
        },
        isOpen: true,
      })
    },
    [onClose],
  )

  const values = useMemo(() => ({ openModal }), [openModal])

  if (!element) return null

  return (
    <Context.Provider value={values}>
      {children}
      {createPortal(
        <MobileModal
          isOpen={pdfState.isOpen}
          onClose={pdfState.onClose}
          file={pdfState.file}
          // Other props can be passed as needed
        />,
        element,
      )}
    </Context.Provider>
  )
}

export function usePDFContext() {
  const context = useContext(Context as React.Context<PDFContextValue>)
  if (!context) {
    throw new Error('usePDFContext must be used within a PDFContextProvider')
  }
  return context
}

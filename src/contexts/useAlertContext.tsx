import Alert from '@/components/shared/Alert'
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

type AlertProps = ComponentProps<typeof Alert>
type AlertOptions = Omit<AlertProps, 'open'>

interface AlertContextValue {
  open: (options: AlertOptions) => void
}

const Context = createContext<AlertContextValue | undefined>(undefined)

const defaultValues: AlertProps = {
  open: false,
  setOpen: () => {},
  title: '',
  description: '',
  onButtonClick: () => {},
}

export default function AlertConTextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [alertState, setAlertState] = useState(defaultValues)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setElement(document.getElementById('root-portal'))
  }, [])

  const close = useCallback(() => {
    setAlertState(defaultValues)
  }, [])

  const open = useCallback(
    ({ onButtonClick, ...options }: AlertOptions) => {
      setAlertState({
        ...options,
        onButtonClick: () => {
          close()
          onButtonClick()
        },
        open: true,
      })
    },
    [close],
  )

  const values = useMemo(() => ({ open }), [open])
  if (!element) {
    return null
  }

  return (
    <Context.Provider value={values}>
      {children}
      {element != null && alertState.open
        ? createPortal(
            <Alert
              open={alertState.open}
              title={alertState.title}
              description={alertState.description}
              onButtonClick={alertState.onButtonClick}
            />,
            element,
          )
        : null}
    </Context.Provider>
  )
}

export function useAlertContext() {
  const values = useContext(Context as React.Context<AlertContextValue>)

  if (values == null) {
    throw new Error(
      'useInterestContext must be used within a AlertContextProvider',
    )
  }
  return values
}

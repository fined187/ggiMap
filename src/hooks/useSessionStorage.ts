import { useState } from 'react'

interface SessionStorageProps<T> {
  key: string
  initialValue: T
}

const useSessionStorage = <T>({
  key,
  initialValue,
}: SessionStorageProps<T>) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const sessionStorageValue = window.sessionStorage.getItem(key)
      if (sessionStorageValue) {
        return JSON.parse(sessionStorageValue)
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(initialValue))
        return initialValue
      }
    }
    return initialValue
  })

  const setSessionStorage = (value: T) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    }
    setState(value)
  }

  const removeSessionStorage = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(key)
    }
    setState(initialValue)
  }

  return [state, setSessionStorage, removeSessionStorage] as const
}

export default useSessionStorage

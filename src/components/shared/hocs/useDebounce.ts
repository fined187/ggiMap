import { useEffect, useState } from 'react'

function useDebounce<T = any>(value: T, delay = 300) {
  const [debounceValue, setDebounceValue] = useState<T>(value)
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceValue(value)
    }, delay)
    return () => {
      clearTimeout(timeOut)
    }
  }, [value, delay])
  return debounceValue
}

export default useDebounce

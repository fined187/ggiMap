
function useDebounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout | null = null;

  return () => {
    if (timeout) clearTimeout(timeout)

    return setTimeout(() => {
      timeout = null
      func()
    }, wait)
  }
}

export default useDebounce;

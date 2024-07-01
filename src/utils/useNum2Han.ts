function useNum2Han(number: number) {
  if (number === 0 || number === -1) return '취재중'
  let result = ''
  if (number >= 100000000) {
    result = `${Math.floor(number / 100000000)}억`
    number %= 100000000
    result += number ? ` ${Math.floor(number / 10000)}만` : ''
  } else {
    result = `${Math.floor(number / 10000)}만`
  }
  return result
}
export default useNum2Han

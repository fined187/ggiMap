function useNum2Han(number: number) {
  let result = ''
  if (number >= 100000000) {
    result = `${Math.floor(number / 100000000)}억`
    number %= 100000000
    result += number ? ` ${Math.floor(number / 10000)}만` : ''
  } else if (number >= 10000 && number < 100000000) {
    result = `${Math.floor(number / 10000)}만`
    number %= 10000
    result += number ? ` ${number}` : ''
  } else {
    result = ` ${number}`
  }
  return result
}
export default useNum2Han

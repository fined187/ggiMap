export function NumToHan(num: number) {
  if (num >= 100000000) {
    const eok = Math.floor(num / 100000000)
    const man = Math.floor((num % 100000000) / 10000000)
    return man ? `${eok + '.' + man}억` : `${eok}억`
  } else if (num >= 10000000 && num < 100000000) {
    const man = (num / 100000000).toFixed(1) + '억'
    return man
  } else {
    return (num / 100000000).toFixed(2) + '억'
  }
}

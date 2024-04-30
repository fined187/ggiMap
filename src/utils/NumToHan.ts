export function NumToHan(num: number) {
  if (num >= 100000000000) {
    //  1000억 이상
    const eok = Math.round(num / 100000000).toFixed(1)
    return `${eok.toString().replace(/\.0+/, '')}억`
  } else if (num >= 10000000000) {
    //  100억 이상
    const eok = Math.floor(num / 100000000).toFixed(0)
    const man = Math.round((num % 100000000) / 10000000)
    return man ? `${eok}.${man}억` : `${eok}억`
  } else if (num >= 1000000000) {
    const eok = Math.floor(num / 100000000).toFixed(0)
    const man = Math.round((num % 100000000) / 10000000)
    return man ? `${eok}.${man}억` : `${eok}억`
  } else if (num >= 100000000) {
    const eok = Math.floor(num / 100000000).toFixed(0)
    const man = Math.round((num % 100000000) / 10000000)
    return man ? `${eok}.${man}억` : `${eok}억`
  } else if (num >= 10000000) {
    const man = Math.round(num / 10000000).toFixed(0)
    return `${man}천`
  } else if (num >= 1000000) {
    const man = Math.round(num / 1000000).toFixed(0)
    return `${man}백`
  } else if (num >= 100000) {
    const man = Math.round(num / 100000).toFixed(0)
    return `${man}십`
  } else if (num >= 10000) {
    const man = Math.round(num / 10000).toFixed(0)
    return `${man}만`
  } else {
    return '1만원'
  }
}

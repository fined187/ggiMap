export const handleSessionMsg = () => {
  const confirm = window.confirm(
    '허용접속시간이 초과하여 종료합니다. 메뉴의 고객라운지 - 물건관리 - 입찰표관리에서 저장된 내용을 확인하세요.',
  )
  if (confirm) {
    window.close()
  }
}

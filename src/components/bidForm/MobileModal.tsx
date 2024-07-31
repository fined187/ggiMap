import styled from '@emotion/styled'
import { colors } from '@/styles/colorPalette'
import { useEffect } from 'react'
import Dimmed from '../shared/Dimmed'
import { useRecoilValue } from 'recoil'
import { biddingInfoState } from '@/store/atom/bidForm'

interface MobileModalProps {
  isOpen: boolean
  onClose: () => void
  file: Blob | null // 파일 다운로드를 위한 Blob 추가
}

export default function MobileModal({
  isOpen,
  onClose,
  file,
}: MobileModalProps) {
  const biddingInfo = useRecoilValue(biddingInfoState)
  useEffect(() => {
    if (file && isOpen) {
      const url = window.URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = `${biddingInfo?.fileName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }, [isOpen, file])

  return isOpen ? (
    <>
      <Dimmed>
        <ModalContainer
          onClick={(e) => e.stopPropagation() /* 클릭 이벤트 전파 방지 */}
        >
          <h1>다운로드를 준비 중입니다...</h1>
          <button onClick={onClose}>닫기</button>
        </ModalContainer>
      </Dimmed>
    </>
  ) : null
}

const ModalContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colors.white};
  border-radius: 8px;
  overflow: hidden;
  z-index: 100000;
  width: 780px;
  height: 500px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
`

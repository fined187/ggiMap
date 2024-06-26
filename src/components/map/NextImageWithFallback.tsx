/* eslint-disable */
import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface NextImageWithFallbackProps extends ImageProps {
  src: string
  alt: string
  fallbackComponent: React.ReactNode
  handleDetailPage: (idCode: string, type: number) => string | undefined
  type: number
  idCode: string
}

export default function NextImageWithFallback({
  src,
  alt,
  fallbackComponent,
  handleDetailPage,
  type,
  idCode,
  ...rest
}: NextImageWithFallbackProps) {
  const [imgError, setImgError] = useState(false)
  const [imgSrc, setImagSrc] = useState(src)
  useEffect(() => {
    setImagSrc(src)
  }, [src])

  if (imgError && fallbackComponent) {
    return <>{fallbackComponent}</>
  }
  if (src !== '') {
    return (
      <Image
        src={src ? src : ''}
        alt={alt}
        {...rest}
        onError={() => {
          setImgError(true)
          setImagSrc('')
        }}
        onClick={() => {
          window.open(
            handleDetailPage(idCode, type),
            '_blank',
            'width=1600, height=1000',
          )
        }}
      />
    )
  }
}

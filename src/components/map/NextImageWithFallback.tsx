import Image, { ImageProps } from 'next/image'
import NoImage from './sections/Overlay/icon/NoImage'
import { useState } from 'react'

interface NextImageWithFallbackProps extends ImageProps {
  src: string
  alt: string
  fallbackComponent: React.ReactNode
}

export default function NextImageWithFallback({
  src,
  alt,
  fallbackComponent,
  ...rest
}: NextImageWithFallbackProps) {
  const [imgError, setImgError] = useState(false)

  if (imgError && fallbackComponent) {
    return <>{fallbackComponent}</>
  }
  return (
    <Image
      src={src}
      alt={alt}
      {...rest}
      onError={() => {
        setImgError(true)
      }}
    />
  )
}

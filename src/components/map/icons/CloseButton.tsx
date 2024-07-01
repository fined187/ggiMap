import { css } from '@emotion/react'

export default function CloseButton() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="44"
      viewBox="0 0 50 44"
      fill="none"
    >
      <rect width="50" height="44" rx="4" fill="#000001" fill-opacity="0.9" />
      <path
        d="M33 14L17 30"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17 14L33 30"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

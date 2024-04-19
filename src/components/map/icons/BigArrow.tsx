interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BigArrow({ isOpen, setIsOpen }: Props) {
  return (
    <>
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <g clipPath="url(#clip0_97_394)">
            <path
              d="M15.0028 1.07108C22.6953 1.07108 28.9314 7.30711 28.9314 14.9996C28.9314 22.6922 22.6953 28.9282 15.0028 28.9282C7.31025 28.9282 1.07422 22.6922 1.07422 14.9997C1.07421 7.30711 7.31025 1.07108 15.0028 1.07108Z"
              fill="white"
              stroke="#34343D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.4314 17.1431L15.0028 10.7145L8.57422 17.1431"
              stroke="#34343D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_97_394">
              <rect
                width="30"
                height="30"
                fill="white"
                transform="matrix(-1 8.74228e-08 8.74228e-08 1 30 0)"
              />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <g clipPath="url(#clip0_138_2671)">
            <path
              d="M15.0031 28.9294C7.31053 28.9294 1.0745 22.6934 1.0745 15.0008C1.0745 7.3083 7.31053 1.07227 15.0031 1.07227C22.6956 1.07227 28.9316 7.3083 28.9316 15.0008C28.9316 22.6934 22.6956 28.9294 15.0031 28.9294Z"
              fill="white"
              stroke="#D21E1B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5745 12.8574L15.0031 19.286L21.4316 12.8574"
              stroke="#D21E1B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_138_2671">
              <rect
                width="30"
                height="30"
                fill="white"
                transform="matrix(-1 8.74228e-08 8.74228e-08 1 30 0)"
              />
            </clipPath>
          </defs>
        </svg>
      )}
    </>
  )
}

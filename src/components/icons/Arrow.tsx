import { Form } from '@/models/Form'

export default function Arrow({
  isOpenArrow,
  setIsOpenArrow,
}: {
  isOpenArrow: boolean
  setIsOpenArrow: React.Dispatch<React.SetStateAction<Form>>
}) {
  return (
    <div
      style={{
        cursor: 'pointer',
      }}
      onClick={() =>
        setIsOpenArrow((prev) => {
          return {
            ...prev,
            isSubFilterBoxOpen: !prev.isSubFilterBoxOpen,
          }
        })
      }
    >
      {isOpenArrow ? (
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.8733 1.35491C18.0274 1.35491 23.0162 6.34374 23.0162 12.4978C23.0162 18.6518 18.0274 23.6406 11.8733 23.6406C5.7193 23.6406 0.730469 18.6518 0.730469 12.4978C0.730469 6.34374 5.7193 1.35491 11.8733 1.35491Z"
            fill="white"
            stroke="#34343D"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.0162 14.2109L11.8733 9.06808L6.73047 14.2109"
            stroke="#34343D"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.3747 23.6412C6.22069 23.6412 1.23187 18.6524 1.23187 12.4983C1.23187 6.3443 6.22069 1.35547 12.3747 1.35547C18.5288 1.35547 23.5176 6.3443 23.5176 12.4983C23.5176 18.6524 18.5288 23.6412 12.3747 23.6412Z"
            fill="white"
            stroke="#34343D"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.23186 10.7852L12.3747 15.928L17.5176 10.7852"
            stroke="#34343D"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}

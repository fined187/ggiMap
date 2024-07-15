import { InterestFormData } from '@/models/Interest'
import {
  deleteGmInterest,
  deleteKmInterest,
  deleteKwInterest,
} from '@/remote/interest/deleteInterest'
import { useMutation } from 'react-query'

const useDeleteInterest = (type: string, formData: InterestFormData) => {
  return useMutation(
    () => {
      switch (type) {
        case '1':
          return deleteKmInterest(
            formData.oldInfoId + formData.caseNo + formData.infoNo,
          )
        case '2':
          return deleteGmInterest(formData.goodsId!)
        case '3':
          return deleteGmInterest(formData.goodsId!)
        case '4':
          return deleteKwInterest(formData.oldInfoId + formData.caseNo)
        default:
          return Promise.reject(new Error('Not Found'))
      }
    },
    {
      onError: (error) => {
        console.error(error)
      },
    },
  )
}

export default useDeleteInterest

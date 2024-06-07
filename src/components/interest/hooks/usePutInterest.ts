import { InterestFormData, UpdatedInterest } from '@/models/Interest'
import {
  putGmInterest,
  putKmInterest,
  putKwInterest,
} from '@/remote/interest/putInterest'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

export const usePutInterest = (
  type: string,
  formData: InterestFormData,
  setUpdatedInterest: Dispatch<SetStateAction<UpdatedInterest>>,
) => {
  return useMutation(
    () => {
      switch (type) {
        case '1':
          return putKmInterest({
            infoId: formData.infoId,
            caseNo: formData.caseNo!,
            mulSeq: formData.mulSeq,
            infoNo: formData.infoNo!,
            oldInfoId: formData.oldInfoId,
            isNewCategory: formData.isNewCategory,
            interestInfo: formData.interestInfo,
            smsNotificationYn: formData.smsNotificationYn,
            isWait: formData.isWait,
          })
        case '2':
          return putGmInterest({
            goodsId: formData.goodsId!,
            manageNo: formData.manageNo!,
            isNewCategory: formData.isNewCategory,
            interestInfo: formData.interestInfo,
          })
        case '3':
          return putGmInterest({
            goodsId: formData.goodsId!,
            manageNo: formData.manageNo!,
            isNewCategory: formData.isNewCategory,
            interestInfo: formData.interestInfo,
          })
        case '4':
          return putKwInterest({
            infoId: formData.infoId,
            caseNo: formData.caseNo!,
            oldInfoId: formData.oldInfoId,
            isNewCategory: formData.isNewCategory,
            interestInfo: formData.interestInfo,
          })
        default:
          return Promise.reject(new Error('Not Found'))
      }
    },
    {
      onSuccess: (data) => {
        setUpdatedInterest(data)
      },
    },
  )
}

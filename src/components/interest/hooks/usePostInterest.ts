import { InterestFormData } from '@/models/Interest'
import {
  postGmInterest,
  postKmInterest,
  postKwInterest,
} from '@/remote/interest/postInterest'
import { useMutation, useQueryClient } from 'react-query'

export const usePostInterest = (type: string, formData: InterestFormData) => {
  return useMutation(
    () => {
      switch (type) {
        case '1':
          return postKmInterest({
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
          return postGmInterest({
            goodsId: formData.goodsId!,
            manageNo: formData.manageNo!,
            isNewCategory: formData.isNewCategory,
            interestInfo: formData.interestInfo,
          })
        case '4':
          return postKwInterest({
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
      onSuccess: () => {},
    },
  )
}

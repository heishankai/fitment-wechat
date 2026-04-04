import { request } from '@/utils/request'

/**
 * 获取工价详情
 */
export const getWorkTypeDetailService = (id: string | number): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-type/${id}`,
  })
}

interface GetPhoneParams {
    code: string
    openid?: string
    encryptedData?: string
    iv?: string
  }
  
/**
 * 获取用户手机号码
 */
export const getUserPhoneNumberService = (params: GetPhoneParams): Promise<any> => {
    return request({
      method: 'POST',
      url: '/craft-wechat-user/phone',
      data: params,
    })
  }
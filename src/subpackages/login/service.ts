import { request } from '@/utils/request'

/**
 * 登录
 */
export const loginService = (params: any): Promise<any> => {
  return request({
    method: 'GET',
    url: '/wechat/wechat-user/login',
    data: params,
  })
}

/**
 * 获取用户手机号码
 */
export const getUserPhoneNumberService = (params: any): Promise<any> => {
  return request({
    method: 'POST',
    url: '/wechat/wechat-user/phone',
    data: params,
  })
}

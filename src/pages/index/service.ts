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
 * 获取用户信息
 */
export const getUserInfoService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/admin/users',
  })
}

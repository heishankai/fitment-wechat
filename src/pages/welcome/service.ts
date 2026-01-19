import { request } from '@/utils/request'

/**
 * 获取欢迎页信息
 */
export const getWelcomeInfoService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/welcome',
  })
}

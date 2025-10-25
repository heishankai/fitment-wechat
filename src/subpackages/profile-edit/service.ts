import { request } from '@/utils/request'

/**
 * 更新用户信息
 */
export const updateUserInfoService = (id: number, data: any): Promise<any> => {
  return request({
    method: 'PUT',
    url: `/wechat/wechat-user/${id}`,
    data,
  })
}

import { request } from '@/utils/request'

/**
 * 获取地址列表
 */
export const getAddressListService = (params: {
  pageIndex: number
  pageSize: number
  wechat_user_id: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/wechat-address/page',
    data: params,
  })
}

/**
 * 删除地址
 */
export const deleteAddressService = (id: string): Promise<any> => {
  return request({
    method: 'DELETE',
    url: `/wechat-address/${id}`,
  })
}

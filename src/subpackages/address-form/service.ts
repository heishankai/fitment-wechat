import { request } from '@/utils/request'

/**
 * 新增地址
 */
export const addAddressService = (params: {
  owner_name: string
  owner_phone: string
  city_name: string
  detailed_address: string
  community_name: string
  building_number: string
  default: boolean
  wechat_user_id: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/wechat-address',
    data: params,
  })
}

/**
 * 获取地址详情
 */
export const getAddressDetailService = (id: number): Promise<any> => {
  return request({
    method: 'GET',
    url: `/wechat-address/${id}`,
  })
}

/**
 * 编辑地址
 */
export const editAddressService = (id: any, params: any): Promise<any> => {
  return request({
    method: 'PUT',
    url: `/wechat-address/${id}`,
    data: params,
  })
}

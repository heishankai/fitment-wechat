import { request } from '@/utils/request'

/**
 * 获取商品详情
 */
export const getCommodityDetailService = (id: string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/commodity-config/${id}`,
  })
}

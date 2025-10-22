import { request } from '@/utils/request'

/**
 * 获取商品列表
 */
export const getCommodityListService = (params: {
  commodity_name: string
  pageIndex: number
  pageSize: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/commodity-config/page',
    data: params,
  })
}

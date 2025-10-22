import { request } from '@/utils/request'

/**
 * 获取商品列表
 */
export const getCommodityListService = (params: any): Promise<any> => {
  return request({
    method: 'POST',
    url: '/commodity-config/page',
    data: params,
  })
}

/**
 * 获取品类列表
 */
export const getCategoryListService = (params: {
  pageIndex: number
  pageSize: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/category-config/page',
    data: params,
  })
}

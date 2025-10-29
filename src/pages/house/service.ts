import { request } from '@/utils/request'

/**
 * 装修案例列表
 */
export const getCaseListService = (params: {
  pageIndex: number
  pageSize: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/case-query/page',
    data: params,
  })
}

/**
 * 获取轮播图
 */
export const getSwiperListService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/swiper-config',
  })
}

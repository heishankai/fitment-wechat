import { request } from '@/utils/request'

/**
 * 装修案例列表
 */
export const getCaseListService = (params: any): Promise<any> => {
  return request({
    method: 'POST',
    url: '/case-query/page',
    data: params,
  })
}

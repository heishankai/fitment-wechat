import { request } from '@/utils/request'

/**
 * 获取案例详情
 */
export const getCaseDetailService = (id: number): Promise<any> => {
  return request({
    method: 'GET',
    url: `/case-query/${id}`,
  })
}

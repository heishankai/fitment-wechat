import { request } from '@/utils/request'

/**
 * 获取工种详情
 */
export const getWorkTypeDetailService = (id: string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-type/${id}`,
  })
}

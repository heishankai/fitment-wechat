import { request } from '@/utils/request'

/**
 * 获取工种列表
 */
export const getPriceListService = (params: {
  pageIndex: number
  pageSize: number
  work_title?: string
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/work-type/page',
    data: params,
  })
}

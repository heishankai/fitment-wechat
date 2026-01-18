import { request } from '@/utils/request'

// 城市数据接口
export interface CityData {
  id: number
  city_code: string
  city_name: string
}

/**
 * 获取所有城市
 */
export const getCityListService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/city',
  })
}

import { request } from '@/utils/request'

/**
 * 获取逆地理编码
 */
export const getReverseGeocodeService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: `/geolocation/reverse-geocode`,
    data: params,
  })
}

/**
 * 获取用户未接单订单列表（已接到的订单不展示）
 */
export const getPendingOrdersService = (params?: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'GET',
    url: `/order/craftsman/list`,
    data: params,
  })
}

/**
 * 创建订单（HTTP接口，备用）
 */
export const createOrderService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order`,
    data: params,
  })
}

import { request } from '@/utils/request'

/**
 * 获取页面信息
 * path: /independent-page-config
 * return: 页面信息
 */
export const getIndependentPageService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: `/independent-page-config`,
  })
}

/**
 * 是否有已支付未使用的订单
 * path: /order-access-fee/if-unused
 * return: flag:(true 有未使用的订单 false 没有未使用的订单),order_no 订单号
 */
export const checkUnusedOrderService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: `/order-access-fee/if-unused`,
  })
}

/**
 * 创建订单获得paySign
 * path: /order-access-fee/createPayOrder
 * method: POST
 * return: paySign
 * timeout: 5分钟 
 */
export const createAndgetPaySignService = (): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order-access-fee/createPayOrder`,
    // timeout: 300000,
  })
}


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
 * 创建订单
 */
export const createOrderService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order`,
    data: params,
  })
}

/**
 * 设置订单已使用
 * path: order-access-fee/set-is-used
 */

export const setOrderUsedService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order-access-fee/set-is-used`,
    data: params,
  })
}

import { request } from '@/utils/request'

/**
 * 获取施工进度列表
 * @param workPriceItemId 工价项ID
 * @param craftsmanId 工匠ID
 */
export const getConstructionProgress = (
  workPriceItemId: number | string,
  craftsmanId: number | string
): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-price-item/${workPriceItemId}/construction-progress/craftsman/${craftsmanId}`,
  })
}

/**
 * 根据订单ID获取施工进度列表
 * @param orderId 订单ID
 */
export const getConstructionProgressByOrderId = (orderId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/construction-progress/order/${orderId}`,
  })
}

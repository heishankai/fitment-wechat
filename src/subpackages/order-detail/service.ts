import { request } from '@/utils/request'

/**
 * 获取订单详情
 */
export const getOrderDetailService = (id: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/order/${id}`,
  })
}

/**
 * 获取微信用户的所有聊天房间列表
 */
export const getWechatUserRooms = (): Promise<any> => {
  return request({
    method: 'GET',
    url: `/craftsman-wechat-chat/rooms/wechat`,
  })
}

/**
 * 创建或获取与工匠的聊天房间
 * @param params 参数对象，包含 craftsman_user_id
 */
export const createOrGetRoomByCraftsman = (params: { craftsman_user_id: number }): Promise<any> => {
  return request({
    method: 'POST',
    url: `/craftsman-wechat-chat/rooms`,
    data: {
      craftsman_user_id: params.craftsman_user_id,
    },
  })
}

/**
 * 验收订单
 */
// eslint-disable-next-line
export const acceptOrderWorkPriceService = (params: any): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order/accept-work-price`,
    data: params,
  })
}

/**
 * 验收辅材清单
 */
export const acceptOrderMaterialsService = (params: {
  order_id: number
  materials_id: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: `/materials/accept`,
    data: params,
  })
}

/**
 * 取消订单
 */
// eslint-disable-next-line
export const cancelOrderService = (params: any): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order/cancel`,
    data: params,
  })
}

/**
 * 根据订单ID获取施工进度
 */
export const getConstructionProgressByOrderId = (orderId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/construction-progress/order/${orderId}`,
  })
}

/**
 * 根据订单ID获取辅材列表
 */
export const getMaterialsByOrderId = (orderId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/materials/order/${orderId}`,
  })
}

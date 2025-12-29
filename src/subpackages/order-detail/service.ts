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
 * 验收工价
 */
// eslint-disable-next-line
export const acceptOrderWorkPriceService = (params: any): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order/accept-single-work-price`,
    data: params,
  })
}

/**
 * 验收辅材清单
 */
export const acceptOrderMaterialsService = (params: {
  materialsId: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: `/materials/accept`,
    data: params,
  })
}

/**
 * 批量验收辅材清单
 */
export const batchAcceptOrderMaterialsService = (params: {
  materialsIds: number[]
}): Promise<any> => {
  return request({
    method: 'POST',
    url: `/materials/batch-accept`,
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

/**
 * 根据订单ID获取子工价列表
 */
export const getSubWorkPricesByOrderId = (orderId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/order/${orderId}/sub-groups`,
  })
}

/**
 * 根据工价项ID获取辅材列表
 */
export const getMaterialsByWorkPriceItemId = (workPriceItemId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/materials/work-price-item/${workPriceItemId}`,
  })
}

/**
 * 根据工价项ID和分配的工匠ID获取辅材列表
 */
export const getMaterialsByWorkPriceItemIdAndCraftsman = (
  workPriceItemId: number | string,
  assignedCraftsmanId: number | string
): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-price-item/${workPriceItemId}/materials/craftsman/${assignedCraftsmanId}`,
  })
}

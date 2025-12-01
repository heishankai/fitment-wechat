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

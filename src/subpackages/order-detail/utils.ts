import { getWechatUserRooms, createOrGetRoomByCraftsman } from './service'

interface CraftsmanUser {
  id: number | string
  nickname?: string
  [key: string]: unknown
}

/**
 * 联系工匠 - 进入聊天房间
 * @param craftsman_user 工匠用户信息
 */
export const handleContactUser = async (craftsman_user: CraftsmanUser): Promise<void> => {
  const { id, nickname } = craftsman_user ?? {}
  if (!id) return

  try {
    wx.showLoading({ title: '加载中...', mask: true })

    // 获取微信用户的所有聊天房间列表
    const roomsRes = await getWechatUserRooms()

    if (!roomsRes?.success) {
      wx.hideLoading()
      return
    }

    // 查找是否已有与当前工匠的聊天房间
    const existingRoom = (roomsRes?.data ?? []).find((room: any) => room?.craftsman_user?.id === id)

    if (existingRoom) {
      wx.hideLoading()
      wx.navigateTo({
        url: `/subpackages/craftsman-service/index?room_id=${existingRoom.id}&craftsmanUserId=${id}&craftsmanUserName=${encodeURIComponent(nickname || '')}`,
      })
      return
    }

    // 如果没有找到，创建新房间
    const createRes = await createOrGetRoomByCraftsman({
      craftsman_user_id: Number(id),
    })

    wx.hideLoading()

    if (!createRes?.success || !createRes?.data) {
      wx.showToast({
        title: createRes?.message || '创建聊天房间失败',
        icon: 'none',
      })
      return
    }

    // 跳转到聊天房间
    wx.navigateTo({
      url: `/subpackages/craftsman-service/index?room_id=${createRes.data.id}&craftsmanUserId=${id}&craftsmanUserName=${encodeURIComponent(nickname || '')}`,
    })
  } catch (error: any) {
    wx.hideLoading()
    console.error('联系工匠失败:', error)
  }
}
/**
 * 校验联系工匠表单
 * @param formData 表单数据
 * @returns 是否通过校验
 */
export const validateCraftsmanForm = (formData: Record<string, unknown>): boolean => {
  if (!formData?.location) {
    wx.showToast({ title: '请选择位置', icon: 'none' })
    return false
  }

  if (!formData?.houseType) {
    wx.showToast({ title: '请选择房屋类型', icon: 'none' })
    return false
  }

  if (!formData?.roomType) {
    wx.showToast({ title: '请选择户型', icon: 'none' })
    return false
  }

  if (!formData?.area) {
    wx.showToast({ title: '请输入面积', icon: 'none' })
    return false
  }

  return true
}

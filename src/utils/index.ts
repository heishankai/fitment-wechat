import { ref } from 'vue'
/**
 * 猜你喜欢组合式函数
 */
export const useGuessList = (): { guessRef: any; onScrolltolower: any } => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<any>()

  // 滚动触底事件
  const onScrolltolower = (): void => {
    guessRef.value?.getMore()
  }

  // 返回 ref 和事件处理函数
  return {
    guessRef,
    onScrolltolower,
  }
}

/**
 * 预览图片
 * @param current
 * @param urls
 */
export const previewImage = (current: string, urls: string[]): void => {
  wx.previewImage({
    current,
    urls,
  })
}

/**
 * 格式化金额，保留两位小数
 * @param cost
 * @returns
 */
export const formatCost = (cost: number | string | null | undefined): string => {
  const num = Number(cost)
  if (isNaN(num)) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * 手机号码加密函数
 * @param phone
 * @returns string
 */
export const formatPhone = (phone: string | undefined): string => {
  if (!phone) return ''

  // 如果是11位手机号，格式化为 138****8888
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  // 如果是其他长度，显示前3位和后4位，中间用*代替
  if (phone.length > 7) {
    const start = phone.slice(0, 3)
    const end = phone.slice(-4)
    const middle = '*'.repeat(phone.length - 7)
    return `${start}${middle}${end}`
  }

  // 如果长度不足，直接返回
  return phone
}

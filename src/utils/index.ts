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

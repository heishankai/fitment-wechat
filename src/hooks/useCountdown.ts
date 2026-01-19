import { ref, onUnmounted } from 'vue'

export interface UseCountdownOptions {
  /** 倒计时总秒数 */
  seconds: number
  /** 每秒回调 */
  onTick?: (remainSeconds: number) => void
  /** 结束回调 */
  onFinish?: () => void
  /** 是否自动开始 */
  autoStart?: boolean
}

export interface UseCountdownReturn {
  /** 当前剩余秒数（响应式） */
  countdown: ReturnType<typeof ref<number>>
  /** 开始倒计时 */
  start: () => void
  /** 停止倒计时 */
  stop: () => void
  /** 重置倒计时（可传新秒数） */
  reset: (seconds?: number) => void
  /** 是否正在运行 */
  isRunning: ReturnType<typeof ref<boolean>>
}

/**
 * useCountdown
 * Vue composable 倒计时封装
 */
export const useCountdown = (options: UseCountdownOptions): UseCountdownReturn => {
  const countdown = ref<number>(options.seconds)
  const isRunning = ref<boolean>(false)

  let timer: ReturnType<typeof setInterval> | null = null

  /** 清理定时器 */
  const clearTimer = (): void => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isRunning.value = false
  }

  /** 开始倒计时 */
  const start = (): void => {
    clearTimer()
    countdown.value = options.seconds
    isRunning.value = true

    // 启动时立即触发一次
    options.onTick?.(countdown.value)

    timer = setInterval(() => {
      countdown.value -= 1
      options.onTick?.(countdown.value)

      if (countdown.value <= 0) {
        clearTimer()
        options.onFinish?.()
      }
    }, 1000)
  }

  /** 停止倒计时 */
  const stop = (): void => {
    clearTimer()
  }

  /** 重置倒计时 */
  const reset = (seconds?: number): void => {
    clearTimer()
    countdown.value = seconds ?? options.seconds
  }

  // 自动开始
  if (options.autoStart) {
    start()
  }

  // 组件卸载自动清理
  onUnmounted(() => {
    clearTimer()
  })

  return {
    countdown,
    start,
    stop,
    reset,
    isRunning,
  }
}

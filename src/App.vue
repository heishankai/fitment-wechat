<script setup lang="ts">
import { onLaunch, onShow, onHide, onLoad, onUnload, onReady } from '@dcloudio/uni-app'
import dayjs from 'dayjs'

// 存储键名
const STORAGE_KEY = 'welcome_page_shown_date'

// 获取今天的日期字符串（YYYY-MM-DD格式）
const getTodayDateString = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

// 检查今天是否已经展示过欢迎页 和 活动页
const hasShownWelcomeToday = (): boolean => {
  try {
    const lastShownDate = uni.getStorageSync(STORAGE_KEY)
    const todayDate = getTodayDateString()
    return lastShownDate === todayDate
  } catch {
    return false
  }
}

onLaunch(() => {
  console.log('监听小程序初始化，全局只触发一次')

  // 检查今天是否已经展示过欢迎页，如果展示过则直接跳转到主页面
  if (hasShownWelcomeToday()) {
    uni.reLaunch({
      url: '/pages/house/index',
    })
  }

  // #ifdef MP-WEIXIN
  // 检查小程序更新
  checkUpdate()
  // #endif
})

// #ifdef MP-WEIXIN
/**
 * 检查小程序更新
 */
const checkUpdate = (): void => {
  // 判断微信版本是否支持更新管理器
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager()

    // 检查是否有新版本
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        console.log('发现新版本，准备更新')
      }
    })

    // 新版本下载完成
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: true,
        cancelText: '稍后',
        confirmText: '立即更新',
        success: (modalRes) => {
          if (modalRes.confirm) {
            // 应用新版本
            updateManager.applyUpdate()
          }
        },
      })
    })

    // 新版本下载失败
    updateManager.onUpdateFailed(() => {
      wx.showModal({
        title: '更新失败',
        content: '新版本下载失败，请检查网络后重试',
        showCancel: false,
        confirmText: '知道了',
      })
    })
  } else {
    // 不支持更新管理器，使用兼容方案
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用更新功能，请升级到最新微信版本后重试。',
      showCancel: false,
      confirmText: '知道了',
    })
  }
}
// #endif

onShow(() => {
  console.log('监听页面展示')
})

onLoad(() => {
  console.log('监听页面加载，可以发送请求')
})

onReady(() => {
  console.log('监听页面DOM渲染完成')
})

onHide(() => {
  console.log('监听页面隐藏')
})

onUnload(() => {
  console.log('监听页面卸载')
})
</script>
<style>
@import '@/static/iconfont.css';

/* 全局背景色 */
page {
  box-sizing: border-box;
  background: #fbf9fa;
  margin: 0;
  padding: 0;
}

/* 微信小程序 button 默认样式重置 */
/* #ifdef MP-WEIXIN */
button {
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  font-size: inherit;
  line-height: inherit;
  box-sizing: border-box;
}

button::after {
  border: none;
}

/* #endif */
</style>

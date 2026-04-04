const SHARE_IMAGE_URL =
  'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1774710271414_danpki_logo.png'

/**
 * 微信小程序：默认「转发给好友 / 分享到朋友圈」
 * 标题与路径可在单页内用 onShareAppMessage / onShareTimeline 覆盖
 */
type ShareAppMessageResult = {
  title: string
  path: string
  imageUrl: string
}

type ShareTimelineResult = {
  title: string
  query: string
  imageUrl: string
}

export default {
  onShareAppMessage(): ShareAppMessageResult {
    const path = getSharePagePath()
    return {
      title: '铭策装饰工艺手册！',
      path,
      imageUrl: SHARE_IMAGE_URL,
    }
  },
  onShareTimeline(): ShareTimelineResult {
    return {
      title: '铭策装饰工艺手册！',
      query: getShareTimelineQuery(),
      imageUrl: SHARE_IMAGE_URL,
    }
  },
}

type PageWithRoute = { $page?: { fullPath?: string } }

function getSharePagePath(): string {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as PageWithRoute
  const fullPath = page?.$page?.fullPath
  if (fullPath) {
    return fullPath.startsWith('/') ? fullPath : `/${fullPath}`
  }
  return '/pages/labour-cost/index'
}

function getShareTimelineQuery(): string {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as PageWithRoute
  const fullPath = page?.$page?.fullPath ?? ''
  const i = fullPath.indexOf('?')
  return i >= 0 ? fullPath.slice(i + 1) : ''
}

import { request } from '@/utils/request'

/**
 * 装修案例列表
 */
 
export const getCaseListService = (params: {
  pageIndex: number
  pageSize: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/case-query/page',
    data: params,
  })
}

/**
 * 获取轮播图
 */
export const getSwiperListService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/swiper-config',
  })
}

/**
 * 登录
 */
// eslint-disable-next-line
export const loginService = (params: any): Promise<any> => {
  return request({
    method: 'GET',
    url: '/wechat/wechat-user/login',
    data: params,
  })
}

/**
 * 获取用户手机号码
 */
// eslint-disable-next-line
export const getUserPhoneNumberService = (params: any): Promise<any> => {
  return request({
    method: 'POST',
    url: '/wechat/wechat-user/phone',
    data: params,
  })
}

/**
 * 获取逆地理编码
 */
 
export const getReverseGeocodeService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: `/geolocation/reverse-geocode`,
    data: params,
  })
}

/**
 * 获取按钮标题
 * path :/independent-page-config/title
 * method:GET
 */
export const getButtonTitleService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/independent-page-config/title',
  })
}

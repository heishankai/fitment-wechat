/* 工种名称 -> 图标（与本工程 static/iconfont.css 一致，从 mini 工程对齐可用字形） */
export const ICON_MAP: Record<string, { iconType: string; iconPrefix: string }> = {
  油漆: { iconType: 'color', iconPrefix: '' },
  拆除: { iconType: 'icon-chuizi', iconPrefix: 'iconfont' },
  木工: { iconType: 'icon-chizi_o', iconPrefix: 'iconfont' },
  泥瓦工: { iconType: 'icon-zhuan', iconPrefix: 'iconfont' },
  泥工: { iconType: 'icon-zhuan', iconPrefix: 'iconfont' },
  水电: { iconType: 'icon-dianli', iconPrefix: 'iconfont' },
  设计师: { iconType: 'compose', iconPrefix: '' },
  项目经理: { iconType: 'icon-gongren', iconPrefix: 'iconfont' },
  工长: { iconType: 'icon-gongren', iconPrefix: 'iconfont' },
  保洁: { iconType: 'star', iconPrefix: '' },
  搬运: { iconType: 'cart', iconPrefix: '' },
}

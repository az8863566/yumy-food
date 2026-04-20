/**
 * 间距和尺寸常量
 * 统一管理应用所有间距、尺寸值，禁止在组件中硬编码魔法数字
 */

/** 间距常量 */
export const SPACING = {
  /** 4px - 极小间距 */
  xs: 4,
  /** 8px - 小间距 */
  sm: 8,
  /** 12px - 中小间距 */
  md: 12,
  /** 16px - 标准间距 */
  lg: 16,
  /** 20px - 中间距 */
  xl: 20,
  /** 24px - 大间距 */
  xxl: 24,
  /** 32px - 超大间距 */
  xxxl: 32,
} as const;

/** 尺寸常量 */
export const SIZES = {
  /** 小图标尺寸 14px */
  iconSmall: 14,
  /** 中等图标尺寸 20px */
  iconMedium: 20,
  /** 大图标尺寸 24px */
  iconLarge: 24,
  /** 头像尺寸 80px */
  avatar: 80,
  /** 标签栏高度 */
  tabHeight: 60,
  /** 标准圆角 12px */
  borderRadius: 12,
  /** 大圆角 16px */
  borderRadiusLarge: 16,
  /** 小圆角 4px */
  borderRadiusSmall: 4,
  /** 超大圆角 20px */
  borderRadiusXLarge: 20,
  /** 圆形按钮尺寸 28px */
  circleButton: 28,
  /** 图片高度 - 卡片 160px */
  cardImageHeight: 160,
  /** 图片高度 - 详情 300px */
  detailImageHeight: 300,
  /** 图片高度 - 步骤 200px */
  stepImageHeight: 200,
  /** 图片高度 - 分类 80px */
  categoryImageHeight: 80,
} as const;

/** 字体大小常量 */
export const FONT_SIZES = {
  /** 10px - 极小文字 */
  xs: 10,
  /** 12px - 小文字 */
  sm: 12,
  /** 14px - 标准文字 */
  md: 14,
  /** 16px - 中等文字 */
  lg: 16,
  /** 18px - 较大文字 */
  xl: 18,
  /** 20px - 大文字 */
  xxl: 20,
  /** 24px - 超大文字 */
  xxxl: 24,
  /** 28px - 标题文字 */
  title: 28,
} as const;

/** 行高常量 */
export const LINE_HEIGHTS = {
  /** 18px - 小文字行高 */
  sm: 18,
  /** 20px - 标准行高 */
  md: 20,
  /** 24px - 大文字行高 */
  lg: 24,
  /** 28px - 超大行高 */
  xl: 28,
} as const;

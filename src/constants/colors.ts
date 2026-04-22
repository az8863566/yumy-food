/**
 * 主题色值常量
 * 统一管理应用所有颜色值，禁止在组件中硬编码颜色
 */
export const COLORS = {
  /** 主色调（暗金色，深色主题下高级质感） */
  primary: '#C8A96E',
  /** 背景色 */
  background: '#0a0a0a',
  /** 表面色（卡片、容器等） */
  surface: '#1a1a1a',
  /** 主要文字颜色 */
  textPrimary: '#ffffff',
  /** 次要文字颜色 */
  textSecondary: '#888888',
  /** 边框颜色 */
  border: 'rgba(255,255,255,0.1)',
  /** 边框颜色（浅色） */
  borderLight: 'rgba(255,255,255,0.05)',
  /** 遮罩层颜色 */
  overlay: 'rgba(0,0,0,0.5)',
  /** 遮罩层颜色（半透明） */
  overlayLight: 'rgba(0,0,0,0.4)',
  /** 遮罩层颜色（深色） */
  overlayDark: 'rgba(0,0,0,0.6)',
  /** 错误文字/边框色 */
  error: '#FF4D4D',
  /** 错误背景色（半透明） */
  errorBg: 'rgba(255, 77, 77, 0.12)',
} as const;

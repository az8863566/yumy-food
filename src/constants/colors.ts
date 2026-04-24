/**
 * 主题色值常量
 * 完整支持 light/dark 双主题，通过 useAppTheme() 动态获取当前主题色值
 */

export interface IThemeColors {
  primary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  borderLight: string;
  overlay: string;
  overlayLight: string;
  overlayDark: string;
  error: string;
  errorBg: string;
}

/** 深色主题（默认主题） */
export const darkTheme: IThemeColors = {
  primary: '#C5A059',
  background: '#0A0A0B',
  surface: '#161618',
  textPrimary: '#E5E5E7',
  textSecondary: '#8E9299',
  border: 'rgba(255,255,255,0.1)',
  borderLight: 'rgba(255,255,255,0.05)',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.4)',
  overlayDark: 'rgba(0,0,0,0.6)',
  error: '#FF4D4D',
  errorBg: 'rgba(255, 77, 77, 0.12)',
} as const;

/** 浅色主题 */
export const lightTheme: IThemeColors = {
  primary: '#C5A059',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  border: 'rgba(0,0,0,0.1)',
  borderLight: 'rgba(0,0,0,0.05)',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.4)',
  overlayDark: 'rgba(0,0,0,0.6)',
  error: '#FF4D4D',
  errorBg: 'rgba(255, 77, 77, 0.12)',
} as const;

/**
 * 向后兼容的 COLORS 导出（默认使用深色主题）
 * 新代码推荐使用 useAppTheme() Hook 获取动态主题
 */
export const COLORS = darkTheme;

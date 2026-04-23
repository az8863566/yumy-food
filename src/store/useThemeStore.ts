/**
 * 主题状态 Zustand Store
 * 管理用户主题偏好（light / dark / system）
 */
import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  /** 当前主题模式 */
  themeMode: ThemeMode;
  /** 设置主题模式 */
  setThemeMode: (mode: ThemeMode) => void;
  /** 循环切换主题 */
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'system',
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleTheme: () => {
    const { themeMode } = get();
    const next: ThemeMode =
      themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    set({ themeMode: next });
  },
}));

import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { lightTheme, darkTheme, type IThemeColors } from '@/constants/colors';

/**
 * 获取当前应用主题色值
 * 基于用户偏好或系统深浅色模式自动切换 light/dark 主题
 */
export function useAppTheme(): IThemeColors {
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const resolved = themeMode === 'system' ? systemColorScheme : themeMode;
  return resolved === 'light' ? lightTheme : darkTheme;
}

export { lightTheme, darkTheme, type IThemeColors };

/**
 * 跨平台存储服务封装
 * - 移动端：使用 expo-secure-store（安全存储）
 * - Web 端：使用 localStorage（expo-secure-store 不支持 Web）
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getWebStorage = (): Storage | null => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

export const storageService = {
  async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return getWebStorage()?.getItem(key) ?? null;
    }
    return SecureStore.getItemAsync(key);
  },

  async setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      getWebStorage()?.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },

  async deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      getWebStorage()?.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

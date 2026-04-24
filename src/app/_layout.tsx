import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import '../theme/global.css';
import { QueryClientProvider } from '@tanstack/react-query';

// 让 expo-image 支持 className（NativeWind v4 cssInterop）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
cssInterop(Image as any, { className: 'style' });
import { AppProvider } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/api/queryClient';
import { AuthModal } from '@/components/business/AuthModal';

/**
 * 全局根布局
 * 职责：全局 Provider 嵌套、路由挂载、状态供给
 * 由 Expo Router 自动接管路由，无需手动创建 NavigationContainer
 */
export default function RootLayout() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="recipe/[id]"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </Stack>
          <AuthModal />
          <StatusBar style="auto" />
        </AppProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

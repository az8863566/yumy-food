import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/api/queryClient';

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
          <StatusBar style="auto" />
        </AppProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

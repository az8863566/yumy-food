import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/store';
import { MainNavigator } from '@/navigation/MainNavigator';
import { ErrorBoundary } from '@/components';

/**
 * 应用入口组件
 * 职责：全局配置、初始化、Provider 嵌套、路由挂载
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <MainNavigator />
          <StatusBar style="light" />
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

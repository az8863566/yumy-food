import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

/**
 * 应用入口组件（Expo Router 模式）
 * 职责：极轻量的入口，全局 Provider 和路由由 src/app/_layout.tsx 接管
 */
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
    </View>
  );
}

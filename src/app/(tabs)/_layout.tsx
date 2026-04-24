import React, { type ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

/**
 * Tab 导航栏布局
 * 全权负责底部导航配置，页面文件不写任何导航声明
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabel:
          route.name === 'index' ? '首页' : route.name === 'categories' ? '分类' : '我的',
        sceneContainerStyle: { backgroundColor: COLORS.background },
        tabBarStyle: {
          backgroundColor: 'rgba(22,22,24,0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.05)',
          paddingBottom: 8,
          paddingTop: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.5,
          shadowRadius: 40,
          elevation: 20,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: ComponentProps<typeof Ionicons>['name'] = 'home-outline';
          const focused = color === COLORS.primary;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="categories" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

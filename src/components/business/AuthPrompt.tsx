import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, FONT_SIZES } from '@/constants';

interface AuthPromptProps {
  onLogin: () => void;
}

export function AuthPrompt({ onLogin }: AuthPromptProps) {
  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View className="flex-1 justify-center items-center">
        <View
          className="justify-center items-center mb-5"
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="person-outline" size={SIZES.iconLarge} color={COLORS.textSecondary} />
        </View>
        <Text
          className="font-bold mb-2"
          style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
        >
          未登录
        </Text>
        <Text className="mb-8" style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
          登录后即可查看收藏列表与美味评价记录
        </Text>
        <TouchableOpacity
          className="px-8 py-3"
          style={{ backgroundColor: COLORS.primary, borderRadius: SIZES.borderRadiusXLarge }}
          onPress={onLogin}
        >
          <Text
            className="font-bold"
            style={{ color: COLORS.background, fontSize: FONT_SIZES.lg, letterSpacing: 2 }}
          >
            立即登录
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

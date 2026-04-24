import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONT_SIZES, SPACING } from '@/constants';

interface AuthPromptProps {
  onLogin: () => void;
}

export function AuthPrompt({ onLogin }: AuthPromptProps) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          <Ionicons name="person-outline" size={SIZES.iconLarge} color={COLORS.textSecondary} />
        </View>
        <Text
          style={{
            fontSize: FONT_SIZES.xxl,
            color: COLORS.textPrimary,
            fontWeight: 'bold',
            marginBottom: SPACING.sm,
          }}
        >
          未登录
        </Text>
        <Text
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.textSecondary,
            marginBottom: SPACING.xxl,
          }}
        >
          登录后即可查看收藏列表与美味评价记录
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: SIZES.borderRadiusXLarge,
            paddingVertical: 12,
            paddingHorizontal: 32,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 8,
          }}
          onPress={onLogin}
          activeOpacity={0.9}
        >
          <Text
            style={{
              color: COLORS.background,
              fontSize: FONT_SIZES.sm,
              letterSpacing: 2,
              fontWeight: '600',
            }}
          >
            立即登录
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

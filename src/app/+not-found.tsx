import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '@/constants';

export default function NotFoundScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xxl,
      }}
    >
      <Text
        style={{
          fontSize: FONT_SIZES.xxxl,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: SPACING.md,
        }}
      >
        404
      </Text>
      <Text
        style={{
          fontSize: FONT_SIZES.md,
          color: COLORS.textSecondary,
          marginBottom: SPACING.xxxl,
          textAlign: 'center',
        }}
      >
        哎呀，这个页面走丢啦~
      </Text>
      <TouchableOpacity
        onPress={() => router.replace('/(tabs)')}
        style={{
          backgroundColor: COLORS.primary,
          paddingHorizontal: SPACING.xxxl,
          paddingVertical: SPACING.md,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: COLORS.background,
            fontSize: FONT_SIZES.md,
            fontWeight: 'bold',
          }}
        >
          返回首页
        </Text>
      </TouchableOpacity>
    </View>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const errorMessage = error instanceof Error ? error.toString() : String(error);

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{
        backgroundColor: COLORS.background,
        padding: SPACING.xxl,
      }}
    >
      <View className="items-center" style={{ maxWidth: 400 }}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.primary} />
        <Text
          className="font-bold text-center"
          style={{
            fontSize: FONT_SIZES.xxl,
            color: COLORS.textPrimary,
            marginTop: SPACING.xl,
            marginBottom: SPACING.md,
          }}
        >
          哎呀，出现了一点问题
        </Text>
        <Text
          className="text-center"
          style={{
            fontSize: FONT_SIZES.md,
            color: COLORS.textSecondary,
            lineHeight: FONT_SIZES.md + 8,
            marginBottom: SPACING.xxxl,
          }}
        >
          应用遇到了一个意外错误，请尝试刷新页面
        </Text>

        {__DEV__ && Boolean(error) && (
          <View
            className="w-full"
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: SIZES.borderRadius,
              padding: SPACING.lg,
              marginBottom: SPACING.xl,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              className="font-bold"
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.primary,
                marginBottom: SPACING.sm,
              }}
            >
              错误详情（开发环境）：
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES.xs,
                color: COLORS.textSecondary,
                fontFamily: 'monospace',
              }}
              numberOfLines={10}
            >
              {errorMessage}
            </Text>
          </View>
        )}

        <TouchableOpacity
          className="flex-row items-center"
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: SPACING.xxl,
            paddingVertical: SPACING.md,
            borderRadius: SIZES.borderRadiusXLarge,
            gap: SPACING.sm,
          }}
          onPress={resetErrorBoundary}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color={COLORS.textPrimary} />
          <Text
            className="font-bold"
            style={{ fontSize: FONT_SIZES.lg, color: COLORS.textPrimary }}
          >
            刷新页面
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface Props {
  children: React.ReactNode;
}

/**
 * Error Boundary 组件（函数式实现）
 * 捕获子组件树中的 JavaScript 错误，防止整个应用白屏
 */
export function ErrorBoundary({ children }: Props) {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
}

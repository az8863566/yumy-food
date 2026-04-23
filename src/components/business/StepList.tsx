import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { IRecipeStep } from '@/types';

interface StepListProps {
  steps: IRecipeStep[];
}

export function StepList({ steps }: StepListProps) {
  return (
    <View className="mb-6">
      <Text
        className="font-bold mb-4"
        style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
      >
        制作步骤
      </Text>
      {steps.map((step) => (
        <View key={step.id} className="mb-6">
          <View className="flex-row items-start mb-3">
            <View
              className="justify-center items-center mr-3"
              style={{
                width: SIZES.circleButton,
                height: SIZES.circleButton,
                borderRadius: SIZES.circleButton / 2,
                backgroundColor: COLORS.primary,
              }}
            >
              <Text
                className="font-bold"
                style={{ color: COLORS.background, fontSize: FONT_SIZES.md }}
              >
                {step.id}
              </Text>
            </View>
            <Text
              className="flex-1"
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.textPrimary,
                lineHeight: SPACING.xxl,
              }}
            >
              {step.description}
            </Text>
          </View>
          <Image
            source={{ uri: step.image }}
            className="w-full mt-2 rounded-xl"
            style={{ height: SIZES.stepImageHeight }}
            contentFit="cover"
            transition={200}
          />
        </View>
      ))}
    </View>
  );
}

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
        className="font-semibold mb-6"
        style={{
          fontSize: FONT_SIZES.xs,
          color: COLORS.primary,
          letterSpacing: 2,
        }}
      >
        烹饪步骤 / Steps
      </Text>
      {steps.map((step, index) => (
        <View key={step.id} className="mb-10">
          <View className="flex-row gap-4 mb-4">
            <View
              className="justify-center items-center shrink-0"
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                backgroundColor: 'rgba(255,255,255,0.1)',
                marginTop: 2,
              }}
            >
              <Text
                style={{
                  color: COLORS.textPrimary,
                  fontSize: FONT_SIZES.xs,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
            <Text
              className="flex-1 pt-0.5"
              style={{
                fontSize: FONT_SIZES.md,
                color: COLORS.textPrimary,
                opacity: 0.8,
                lineHeight: SPACING.xxl,
              }}
            >
              {step.description}
            </Text>
          </View>

          {step.ingredientsUsed.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4" style={{ marginLeft: 36 }}>
              {step.ingredientsUsed.map((ui) => (
                <Text
                  key={ui}
                  className="px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'rgba(200,169,110,0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(200,169,110,0.2)',
                    color: COLORS.primary,
                    fontSize: FONT_SIZES.xs,
                    letterSpacing: 1,
                  }}
                >
                  {ui}
                </Text>
              ))}
            </View>
          )}

          <Image
            source={{ uri: step.image }}
            className="w-full rounded-xl"
            style={{
              height: SIZES.stepImageHeight,
              opacity: 0.8,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.05)',
              marginLeft: 36,
            }}
            contentFit="cover"
            transition={200}
          />
        </View>
      ))}
    </View>
  );
}

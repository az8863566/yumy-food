import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONT_SIZES } from '@/constants';
import type { IIngredient } from '@/types';

interface IngredientListProps {
  ingredients: IIngredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <View className="mb-6">
      <Text
        className="font-bold mb-4"
        style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
      >
        食材
      </Text>
      {ingredients.map((ingredient) => (
        <View
          key={ingredient.name}
          className="flex-row justify-between py-3"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.borderLight,
          }}
        >
          <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textPrimary }}>
            {ingredient.name}
          </Text>
          <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
            {ingredient.amount}
          </Text>
        </View>
      ))}
    </View>
  );
}

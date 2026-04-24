import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONT_SIZES } from '@/constants';
import type { IIngredient } from '@/types';

interface IngredientListProps {
  ingredients: IIngredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <View
      className="mb-6 p-5 rounded-xl"
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <Text
        className="font-semibold mb-5"
        style={{
          fontSize: FONT_SIZES.xs,
          color: COLORS.primary,
          letterSpacing: 2,
        }}
      >
        食材准备 / Ingredients
      </Text>
      {ingredients.map((ingredient, index) => (
        <View
          key={ingredient.name}
          className="flex-row justify-between py-3"
          style={{
            borderBottomWidth: index < ingredients.length - 1 ? 1 : 0,
            borderBottomColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textPrimary, opacity: 0.9 }}>
            {ingredient.name}
          </Text>
          <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
            {ingredient.amount}
          </Text>
        </View>
      ))}
    </View>
  );
}

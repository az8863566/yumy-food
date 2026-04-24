import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '@/constants';
import type { IParentCategory } from '@/types';

interface CategorySidebarProps {
  parentCategories: IParentCategory[];
  selectedParent: string;
  onSelectParent: (id: string) => void;
}

export function CategorySidebar({
  parentCategories,
  selectedParent,
  onSelectParent,
}: CategorySidebarProps) {
  return (
    <View
      style={{
        width: 96,
        backgroundColor: COLORS.surface,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {parentCategories.map((parent) => (
          <TouchableOpacity
            key={parent.id}
            style={[
              {
                alignItems: 'center',
                position: 'relative',
                paddingVertical: SPACING.xl,
                paddingHorizontal: SPACING.xs,
                borderLeftWidth: 2,
                borderLeftColor: 'transparent',
              },
              selectedParent === parent.id && {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderLeftColor: COLORS.primary,
              },
            ]}
            onPress={() => onSelectParent(parent.id)}
          >
            <View
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  backgroundColor: 'transparent',
                },
                selectedParent === parent.id && { backgroundColor: COLORS.primary },
              ]}
            />
            <Text
              style={[
                { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
                selectedParent === parent.id && { color: COLORS.primary, fontWeight: 'bold' },
              ]}
            >
              {parent.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { IRecipe } from '@/types';

interface RecipeHeaderProps {
  recipe: IRecipe;
  liked: boolean;
  favorited: boolean;
  commentCount: number;
  onToggleLike: () => void;
  onToggleFavorite: () => void;
}

export function RecipeHeader({
  recipe,
  liked,
  favorited,
  commentCount,
  onToggleLike,
  onToggleFavorite,
}: RecipeHeaderProps) {
  const { top: safeTop } = useSafeAreaInsets();

  return (
    <>
      <Image
        source={{ uri: recipe.image }}
        className="w-full"
        style={{ height: SIZES.detailImageHeight }}
        contentFit="cover"
        transition={200}
      />

      <TouchableOpacity
        className="absolute justify-center items-center"
        style={{
          left: SPACING.lg,
          top: safeTop + SPACING.lg,
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={SIZES.iconLarge} color="#ffffff" />
      </TouchableOpacity>

      <View
        className="absolute flex-row"
        style={{ right: SPACING.lg, top: safeTop + SPACING.lg, gap: SPACING.xs }}
      >
        <TouchableOpacity
          className="justify-center items-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
          onPress={onToggleLike}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? COLORS.primary : '#ffffff'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="justify-center items-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name={favorited ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={favorited ? COLORS.primary : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text
          className="font-bold mb-4"
          style={{ fontSize: FONT_SIZES.xxxl, color: COLORS.textPrimary }}
        >
          {recipe.title}
        </Text>

        <View className="flex-row mb-4" style={{ gap: SPACING.lg }}>
          <View className="flex-row items-center" style={{ gap: SPACING.xs }}>
            <Ionicons name="heart-outline" size={SIZES.iconSmall} color={COLORS.primary} />
            <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
              {recipe.likes} 人点赞
            </Text>
          </View>
          <View className="flex-row items-center" style={{ gap: SPACING.xs }}>
            <Ionicons
              name="chatbubble-outline"
              size={SIZES.iconSmall}
              color={COLORS.textSecondary}
            />
            <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
              {commentCount} 条评价
            </Text>
          </View>
          <View className="flex-row items-center" style={{ gap: SPACING.xs }}>
            <Ionicons name="time-outline" size={SIZES.iconSmall} color={COLORS.textSecondary} />
            <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
              {recipe.time}
            </Text>
          </View>
          <View className="flex-row items-center" style={{ gap: SPACING.xs }}>
            <Ionicons name="people-outline" size={SIZES.iconSmall} color={COLORS.textSecondary} />
            <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
              {recipe.servings}人份
            </Text>
          </View>
          <View className="flex-row items-center" style={{ gap: SPACING.xs }}>
            <Ionicons name="flame-outline" size={SIZES.iconSmall} color={COLORS.textSecondary} />
            <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
              {recipe.difficulty}
            </Text>
          </View>
        </View>

        <Text
          className="mb-6"
          style={{
            fontSize: FONT_SIZES.md,
            color: COLORS.textSecondary,
            lineHeight: SPACING.xxl,
          }}
        >
          {recipe.description}
        </Text>
      </View>
    </>
  );
}

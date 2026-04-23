import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth, useRecipeActions } from '@/hooks';
import type { IRecipeCardProps } from '@/types';
import { COLORS, SPACING, SIZES, FONT_SIZES, LINE_HEIGHTS } from '@/constants';

export const RecipeCard: React.FC<IRecipeCardProps> = ({ recipe, indexRanking }) => {
  const { checkAuth } = useAuth();
  const { isLiked, isFavorited, getCommentCount, handleToggleLike, handleToggleFavorite } =
    useRecipeActions();

  const liked = isLiked(recipe.id);
  const favorited = isFavorited(recipe.id);
  const commentCount = getCommentCount(recipe.id);

  const handleCardClick = () => {
    checkAuth(() => router.push(`/recipe/${recipe.id}`));
  };

  const handleActionClick = (action: () => void) => {
    checkAuth(action);
  };

  return (
    <TouchableOpacity
      className="overflow-hidden rounded-2xl mb-4"
      style={{ backgroundColor: COLORS.surface }}
      onPress={handleCardClick}
      activeOpacity={0.9}
    >
      {indexRanking !== undefined && (
        <View
          className="absolute z-10"
          style={{
            top: SPACING.sm,
            left: SPACING.sm,
            paddingHorizontal: SPACING.sm + 2,
            paddingVertical: SPACING.xs + 1,
            backgroundColor: 'rgba(0,0,0,0.65)',
            borderRadius: SIZES.borderRadiusSmall,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        >
          <Text
            className="font-bold"
            style={{
              color: COLORS.textPrimary,
              fontSize: FONT_SIZES.xs,
              letterSpacing: 0.5,
            }}
          >
            TOP {indexRanking}
          </Text>
        </View>
      )}

      <View className="relative" style={{ height: SIZES.cardImageHeight }}>
        <Image
          source={{ uri: recipe.image }}
          className="w-full h-full"
          contentFit="cover"
          transition={200}
        />

        <View
          className="absolute flex-row z-10"
          style={{ top: SPACING.sm, right: SPACING.sm, gap: SPACING.xs }}
        >
          <TouchableOpacity
            className="p-2"
            style={{
              backgroundColor: COLORS.overlayLight,
              borderRadius: SIZES.borderRadiusSmall,
            }}
            onPress={() => handleActionClick(() => handleToggleLike(recipe.id))}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={SIZES.iconSmall}
              color={liked ? COLORS.primary : '#ffffff'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2"
            style={{
              backgroundColor: COLORS.overlayLight,
              borderRadius: SIZES.borderRadiusSmall,
            }}
            onPress={() => handleActionClick(() => handleToggleFavorite(recipe.id))}
          >
            <Ionicons
              name={favorited ? 'bookmark' : 'bookmark-outline'}
              size={SIZES.iconSmall}
              color={favorited ? COLORS.primary : '#ffffff'}
            />
          </TouchableOpacity>
        </View>

        <View
          className="absolute"
          style={{
            bottom: SPACING.sm,
            left: SPACING.sm,
            paddingHorizontal: SPACING.xs,
            paddingVertical: SPACING.xs,
            backgroundColor: COLORS.overlayDark,
            borderRadius: SIZES.borderRadiusSmall,
          }}
        >
          <Text style={{ color: COLORS.textPrimary, fontSize: FONT_SIZES.xs }}>
            {recipe.difficulty}
          </Text>
        </View>
      </View>

      <View
        className="p-4"
        style={{
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
        }}
      >
        <Text
          className="font-bold mb-1"
          style={{ fontSize: FONT_SIZES.xl, color: COLORS.textPrimary }}
          numberOfLines={1}
        >
          {recipe.title}
        </Text>
        <Text
          className="mb-3"
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.textSecondary,
            lineHeight: LINE_HEIGHTS.md,
          }}
          numberOfLines={2}
        >
          {recipe.description}
        </Text>

        <View
          className="flex-row justify-between items-center pt-3"
          style={{
            borderTopWidth: 1,
            borderTopColor: COLORS.borderLight,
          }}
        >
          <Text
            className="font-medium"
            style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}
          >
            {recipe.time}
          </Text>
          <View className="flex-row items-center" style={{ gap: SPACING.md }}>
            <View className="flex-row items-center" style={{ gap: SPACING.xs }}>
              <Ionicons
                name="chatbubble-outline"
                size={SIZES.iconSmall}
                color={COLORS.textSecondary}
              />
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                {commentCount}
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: SPACING.xs }}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={SIZES.iconSmall}
                color={liked ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
                  liked && { color: COLORS.primary },
                ]}
              >
                {recipe.likes}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

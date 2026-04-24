import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useRecipeActions } from '@/hooks';
import type { IRecipeCardProps } from '@/types';
import { COLORS, SPACING, SIZES, FONT_SIZES, LINE_HEIGHTS } from '@/constants';

export const RecipeCard: React.FC<IRecipeCardProps> = ({ recipe, indexRanking }) => {
  const { checkAuth } = useAuth();
  const { isLiked, isFavorited, getCommentCount, handleToggleLike, handleToggleFavorite } =
    useRecipeActions();
  const [pressed, setPressed] = React.useState(false);

  const liked = isLiked(recipe.id);
  const favorited = isFavorited(recipe.id);
  const commentCount = getCommentCount(recipe.id);

  const handleCardClick = useCallback(() => {
    checkAuth(() => router.push(`/recipe/${recipe.id}`));
  }, [checkAuth, recipe.id]);

  const handleActionClick = useCallback(
    (action: () => void) => {
      checkAuth(action);
    },
    [checkAuth],
  );

  const handleLikePress = useCallback(() => {
    handleActionClick(() => handleToggleLike(recipe.id));
  }, [handleActionClick, handleToggleLike, recipe.id]);

  const handleFavoritePress = useCallback(() => {
    handleActionClick(() => handleToggleFavorite(recipe.id));
  }, [handleActionClick, handleToggleFavorite, recipe.id]);

  return (
    <TouchableOpacity
      style={{
        overflow: 'hidden',
        borderRadius: 16,
        marginBottom: 16,
        backgroundColor: COLORS.surface,
      }}
      onPress={handleCardClick}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.9}
    >
      {indexRanking !== undefined && (
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            top: SPACING.sm,
            left: SPACING.sm,
            paddingHorizontal: SPACING.sm + 2,
            paddingVertical: SPACING.xs + 1,
            backgroundColor: COLORS.primary,
            borderRadius: SIZES.borderRadiusSmall,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: '#000000',
              fontSize: FONT_SIZES.xs,
              letterSpacing: 0.5,
            }}
          >
            TOP {indexRanking}
          </Text>
        </View>
      )}

      <View style={{ position: 'relative', height: SIZES.cardImageHeight }}>
        <Image
          source={{ uri: recipe.image }}
          style={{ width: '100%', height: '100%', opacity: pressed ? 1 : 0.7 }}
          contentFit="cover"
          transition={200}
        />

        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            zIndex: 10,
            top: SPACING.sm,
            right: SPACING.sm,
            gap: SPACING.xs,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 6,
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: SIZES.borderRadiusSmall,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
            onPress={handleLikePress}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={SIZES.iconSmall}
              color={liked ? COLORS.primary : 'rgba(255,255,255,0.6)'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 6,
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: SIZES.borderRadiusSmall,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
            onPress={handleFavoritePress}
          >
            <Ionicons
              name={favorited ? 'bookmark' : 'bookmark-outline'}
              size={SIZES.iconSmall}
              color={favorited ? COLORS.primary : 'rgba(255,255,255,0.6)'}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: SPACING.sm,
            left: SPACING.sm,
            paddingHorizontal: SPACING.xs + 2,
            paddingVertical: SPACING.xs,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: SIZES.borderRadiusSmall,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: FONT_SIZES.xs }}>{recipe.difficulty}</Text>
        </View>
      </View>

      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZES.xl,
            color: COLORS.textPrimary,
            fontWeight: 'bold',
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {recipe.title}
        </Text>
        <Text
          style={{
            marginBottom: 12,
            fontSize: FONT_SIZES.xs,
            color: COLORS.textSecondary,
            lineHeight: LINE_HEIGHTS.md,
          }}
          numberOfLines={2}
        >
          {recipe.description}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '500' }}>
            {recipe.time}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
              <Ionicons
                name="chatbubble-outline"
                size={SIZES.iconSmall}
                color={COLORS.textSecondary}
              />
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                {commentCount}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
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

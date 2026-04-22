import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useAuth, useRecipeActions } from '@/hooks';
import type { RecipeCardProps } from '@/@types';
import { COLORS, SPACING, SIZES, FONT_SIZES, LINE_HEIGHTS } from '@/constants';

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, indexRanking }) => {
  const { setActiveRecipeId } = useNavigationContext();
  const { checkAuth } = useAuth();
  const { isLiked, isFavorited, getCommentCount, handleToggleLike, handleToggleFavorite } =
    useRecipeActions();

  const liked = isLiked(recipe.id);
  const favorited = isFavorited(recipe.id);
  const commentCount = getCommentCount(recipe.id);

  const handleCardClick = () => {
    checkAuth(() => setActiveRecipeId(recipe.id));
  };

  const handleActionClick = (action: () => void) => {
    checkAuth(action);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardClick} activeOpacity={0.9}>
      {indexRanking !== undefined && (
        <View style={styles.rankingBadge}>
          <Text style={styles.rankingText}>TOP {indexRanking}</Text>
        </View>
      )}

      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleActionClick(() => handleToggleLike(recipe.id))}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={SIZES.iconSmall}
              color={liked ? COLORS.primary : '#ffffff'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleActionClick(() => handleToggleFavorite(recipe.id))}
          >
            <Ionicons
              name={favorited ? 'bookmark' : 'bookmark-outline'}
              size={SIZES.iconSmall}
              color={favorited ? COLORS.primary : '#ffffff'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.timeText}>{recipe.time}</Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons
                name="chatbubble-outline"
                size={SIZES.iconSmall}
                color={COLORS.textSecondary}
              />
              <Text style={styles.statText}>{commentCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={SIZES.iconSmall}
                color={liked ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={[styles.statText, liked && styles.likedText]}>{recipe.likes}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusLarge,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  rankingBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: SIZES.borderRadiusSmall,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  rankingText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  imageContainer: {
    height: SIZES.cardImageHeight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionButtons: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    gap: SPACING.xs,
    zIndex: 10,
  },
  actionButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.overlayLight,
    borderRadius: SIZES.borderRadiusSmall,
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.overlayDark,
    borderRadius: SIZES.borderRadiusSmall,
  },
  difficultyText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
  },
  content: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: LINE_HEIGHTS.md,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  timeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  likedText: {
    color: COLORS.primary,
  },
});

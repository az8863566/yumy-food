import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useRecipeActions, useRecipeDetail, useRecipeComments } from '@/hooks';
import { useAuth } from '@/hooks';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

export function RecipeDetailScreen() {
  const { activeRecipeId, setActiveRecipeId } = useNavigationContext();
  const {
    isLiked,
    isFavorited,
    handleToggleLike,
    handleToggleFavorite,
    getCommentCount,
  } = useRecipeActions();
  const { checkAuth } = useAuth();
  const { recipe, loading } = useRecipeDetail(activeRecipeId ? Number(activeRecipeId) : null);
  const { comments: recipeComments, loading: commentsLoading } = useRecipeComments(
    activeRecipeId ? Number(activeRecipeId) : null,
  );
  const { top: safeTop } = useSafeAreaInsets();

  if (loading) {
    return (
      <Modal visible={!!activeRecipeId} animationType="slide">
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </Modal>
    );
  }

  if (!recipe) return null;

  const liked = isLiked(recipe.id);
  const favorited = isFavorited(recipe.id);
  const commentCount = getCommentCount(recipe.id);

  const handleActionClick = (action: () => void) => {
    checkAuth(action);
  };

  return (
    <Modal visible={!!activeRecipeId} animationType="slide">
      <ScrollView style={styles.container}>
        <Image source={{ uri: recipe.image }} style={styles.detailImage} />

        <TouchableOpacity style={[styles.backBtn, { top: safeTop + SPACING.lg }]} onPress={() => setActiveRecipeId(null)}>
          <Ionicons name="chevron-back" size={SIZES.iconLarge} color="#ffffff" />
        </TouchableOpacity>

        <View style={[styles.headerActions, { top: safeTop + SPACING.lg }]}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => handleActionClick(() => handleToggleLike(recipe.id))}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={18}
              color={liked ? COLORS.primary : '#ffffff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => handleActionClick(() => handleToggleFavorite(recipe.id))}
          >
            <Ionicons
              name={favorited ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={favorited ? COLORS.primary : '#ffffff'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailContent}>
          <Text style={styles.detailTitle}>{recipe.title}</Text>

          <View style={styles.detailMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="heart-outline" size={SIZES.iconSmall} color={COLORS.primary} />
              <Text style={styles.metaText}>{recipe.likes} 人点赞</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="chatbubble-outline"
                size={SIZES.iconSmall}
                color={COLORS.textSecondary}
              />
              <Text style={styles.metaText}>{commentCount} 条评价</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={SIZES.iconSmall} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{recipe.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={SIZES.iconSmall} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{recipe.servings}人份</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="flame-outline" size={SIZES.iconSmall} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{recipe.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.detailDescription}>{recipe.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>食材</Text>
            {recipe.ingredients.map((ingredient) => (
              <View key={ingredient.name} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>制作步骤</Text>
            {recipe.steps.map((step) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.id}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                <Image source={{ uri: step.image }} style={styles.stepImage} />
              </View>
            ))}
          </View>

          {/* 评论区域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>评论 ({recipeComments.length})</Text>
            {commentsLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: SPACING.lg }} />
            ) : recipeComments.length === 0 ? (
              <Text style={styles.emptyCommentText}>暂无评论，快来发表第一条评论吧</Text>
            ) : (
              recipeComments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    {comment.avatar ? (
                      <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                    ) : (
                      <View style={styles.commentAvatarPlaceholder}>
                        <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
                      </View>
                    )}
                    <Text style={styles.commentUsername}>{comment.username || '匿名用户'}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  {comment.images.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.commentImageScroll}
                    >
                      {comment.images.map((img) => (
                        <Image key={img} source={{ uri: img }} style={styles.commentImage} />
                      ))}
                    </ScrollView>
                  )}
                  <Text style={styles.commentDate}>{comment.date}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailImage: {
    width: '100%',
    height: SIZES.detailImageHeight,
  },
  backBtn: {
    position: 'absolute',
    left: SPACING.lg,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerActions: {
    position: 'absolute',
    right: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailContent: {
    padding: SPACING.lg,
  },
  detailTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  detailMeta: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  detailDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: SPACING.xxl,
    marginBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  ingredientName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  ingredientAmount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  stepItem: {
    marginBottom: SPACING.xxl,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  stepNumber: {
    width: SIZES.circleButton,
    height: SIZES.circleButton,
    borderRadius: SIZES.circleButton / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  stepDescription: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: SPACING.xxl,
  },
  stepImage: {
    width: '100%',
    height: SIZES.stepImageHeight,
    borderRadius: SIZES.borderRadius,
    marginTop: SPACING.sm,
  },
  emptyCommentText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  commentItem: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SPACING.sm,
  },
  commentAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  commentUsername: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  commentText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: SPACING.xxl,
    marginBottom: SPACING.sm,
  },
  commentImageScroll: {
    marginBottom: SPACING.sm,
  },
  commentImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadiusSmall,
    marginRight: SPACING.sm,
  },
  commentDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});

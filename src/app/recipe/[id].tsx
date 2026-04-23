import React, { useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecipeActions, useRecipeDetail, useRecipeComments } from '@/hooks';
import { useAuth } from '@/hooks';
import { RecipeHeader } from '@/components/business/RecipeHeader';
import { IngredientList } from '@/components/business/IngredientList';
import { StepList } from '@/components/business/StepList';
import { COLORS, SPACING, FONT_SIZES } from '@/constants';
import type { IComment } from '@/types';

function RecipeCommentItem({ comment }: { comment: IComment }) {
  return (
    <View
      className="p-4 rounded-xl mb-4"
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
      }}
    >
      <View className="flex-row items-center mb-3">
        {comment.avatar ? (
          <Image
            source={{ uri: comment.avatar }}
            className="mr-2"
            style={{ width: 32, height: 32, borderRadius: 16 }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            className="justify-center items-center mr-2"
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: COLORS.borderLight,
            }}
          >
            <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
          </View>
        )}
        <Text
          className="font-semibold"
          style={{ fontSize: FONT_SIZES.md, color: COLORS.textPrimary }}
        >
          {comment.username || '匿名用户'}
        </Text>
      </View>
      <Text
        className="mb-2"
        style={{
          fontSize: FONT_SIZES.md,
          color: COLORS.textPrimary,
          lineHeight: SPACING.xxl,
        }}
      >
        {comment.text}
      </Text>
      {comment.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {comment.images.map((img) => (
            <Image
              key={img}
              source={{ uri: img }}
              className="w-20 h-20 rounded mr-2"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
              contentFit="cover"
              transition={200}
            />
          ))}
        </ScrollView>
      )}
      <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>{comment.date}</Text>
    </View>
  );
}

const CommentListItem: ListRenderItem<IComment> = ({ item }) => (
  <View className="px-4">
    <RecipeCommentItem comment={item} />
  </View>
);

const EmptyCommentsList = () => (
  <View className="px-4">
    <Text
      className="text-center py-4"
      style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}
    >
      暂无评论，快来发表第一条评论吧
    </Text>
  </View>
);

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLiked, isFavorited, handleToggleLike, handleToggleFavorite, getCommentCount } =
    useRecipeActions();
  const { checkAuth } = useAuth();
  const { recipe, loading } = useRecipeDetail(id ? Number(id) : null);
  const { comments: recipeComments, loading: commentsLoading } = useRecipeComments(
    id ? Number(id) : null,
  );

  const handleActionClick = useCallback(
    (action: () => void) => {
      checkAuth(action);
    },
    [checkAuth],
  );

  const listHeader = useMemo(() => {
    if (!recipe) return null;
    const liked = isLiked(recipe.id);
    const favorited = isFavorited(recipe.id);
    const commentCount = getCommentCount(recipe.id);
    return (
      <View>
        <RecipeHeader
          recipe={recipe}
          liked={liked}
          favorited={favorited}
          commentCount={commentCount}
          onToggleLike={() => handleActionClick(() => handleToggleLike(recipe.id))}
          onToggleFavorite={() => handleActionClick(() => handleToggleFavorite(recipe.id))}
        />
        <View className="p-4">
          <IngredientList ingredients={recipe.ingredients} />
          <StepList steps={recipe.steps} />
          <Text
            className="font-bold mb-4"
            style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
          >
            评论 ({recipeComments.length})
          </Text>
          {commentsLoading && recipeComments.length === 0 && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginVertical: SPACING.lg }}
            />
          )}
        </View>
      </View>
    );
  }, [
    recipe,
    isLiked,
    isFavorited,
    getCommentCount,
    recipeComments.length,
    commentsLoading,
    handleActionClick,
    handleToggleLike,
    handleToggleFavorite,
  ]);

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!recipe) return null;

  return (
    <FlashList
      data={recipeComments}
      renderItem={CommentListItem}
      keyExtractor={(item) => item.id}
      estimatedItemSize={160}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={!commentsLoading ? EmptyCommentsList : null}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}

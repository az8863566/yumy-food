import React, { useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeActions, useRecipeDetail, useRecipeComments } from '@/hooks';
import { useAuth } from '@/hooks';
import { RecipeHeader } from '@/components/business/RecipeHeader';
import { IngredientList } from '@/components/business/IngredientList';
import { StepList } from '@/components/business/StepList';
import { COLORS, SPACING, FONT_SIZES } from '@/constants';
import type { IComment, IRecipe } from '@/types';

interface RecipeDetailHeaderProps {
  recipe: IRecipe;
  liked: boolean;
  favorited: boolean;
  commentCount: number;
  recipeCommentsLength: number;
  commentsLoading: boolean;
  onToggleLike: () => void;
  onToggleFavorite: () => void;
}

function RecipeDetailHeader({
  recipe,
  liked,
  favorited,
  commentCount,
  recipeCommentsLength,
  commentsLoading,
  onToggleLike,
  onToggleFavorite,
}: RecipeDetailHeaderProps) {
  return (
    <View>
      <RecipeHeader
        recipe={recipe}
        liked={liked}
        favorited={favorited}
        commentCount={commentCount}
        onToggleLike={onToggleLike}
        onToggleFavorite={onToggleFavorite}
      />
      <View style={{ padding: 16 }}>
        <IngredientList ingredients={recipe.ingredients} />
        <StepList steps={recipe.steps} />
        <Text
          style={{
            fontWeight: 'bold',
            marginBottom: 16,
            fontSize: FONT_SIZES.xxl,
            color: COLORS.textPrimary,
          }}
        >
          菜单评价 / Reviews ({recipeCommentsLength})
        </Text>
        {commentsLoading && recipeCommentsLength === 0 && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginVertical: SPACING.lg }}
          />
        )}
      </View>
    </View>
  );
}

function RecipeCommentItem({ comment }: { comment: IComment }) {
  return (
    <View
      style={{
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {comment.avatar ? (
          <Image
            source={{ uri: comment.avatar }}
            style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: COLORS.borderLight,
            }}
          >
            <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
          </View>
        )}
        <Text style={{ fontWeight: '600', fontSize: FONT_SIZES.md, color: COLORS.textPrimary }}>
          {comment.username || '匿名用户'}
        </Text>
      </View>
      <Text
        style={{
          marginBottom: 8,
          fontSize: FONT_SIZES.md,
          color: COLORS.textPrimary,
          lineHeight: SPACING.xxl,
        }}
      >
        {comment.text}
      </Text>
      {comment.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {comment.images.map((img) => (
            <Image
              key={img}
              source={{ uri: img }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 4,
                marginRight: 8,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
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
  <View style={{ paddingHorizontal: 16 }}>
    <RecipeCommentItem comment={item} />
  </View>
);

const EmptyCommentsList = () => (
  <View style={{ paddingHorizontal: 16 }}>
    <Text
      style={{
        textAlign: 'center',
        paddingVertical: 16,
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
      }}
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

  const liked = recipe ? isLiked(recipe.id) : false;
  const favorited = recipe ? isFavorited(recipe.id) : false;
  const commentCount = recipe ? getCommentCount(recipe.id) : 0;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
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
      ListHeaderComponent={
        recipe ? (
          <RecipeDetailHeader
            recipe={recipe}
            liked={liked}
            favorited={favorited}
            commentCount={commentCount}
            recipeCommentsLength={recipeComments.length}
            commentsLoading={commentsLoading}
            onToggleLike={() => handleActionClick(() => handleToggleLike(recipe.id))}
            onToggleFavorite={() => handleActionClick(() => handleToggleFavorite(recipe.id))}
          />
        ) : null
      }
      ListEmptyComponent={!commentsLoading ? EmptyCommentsList : null}
      contentContainerStyle={{ paddingBottom: 24 }}
      style={{ backgroundColor: COLORS.background }}
    />
  );
}

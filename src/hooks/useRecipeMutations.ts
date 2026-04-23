/**
 * 菜谱交互 Mutation Hooks
 * 封装点赞、收藏、评论等写操作，基于 TanStack Query useMutation
 */
import { useMutation } from '@tanstack/react-query';
import {
  toggleLike as toggleLikeApi,
  toggleFavorite as toggleFavoriteApi,
  createComment as createCommentApi,
} from '@/api/endpoints';

/**
 * 点赞/取消点赞 Mutation
 */
export function useToggleLikeMutation() {
  return useMutation({
    mutationFn: (recipeId: number) => toggleLikeApi(recipeId),
  });
}

/**
 * 收藏/取消收藏 Mutation
 */
export function useToggleFavoriteMutation() {
  return useMutation({
    mutationFn: (recipeId: number) => toggleFavoriteApi(recipeId),
  });
}

/**
 * 发表评论 Mutation
 */
export function useAddCommentMutation() {
  return useMutation({
    mutationFn: ({
      recipeId,
      text,
      images,
    }: {
      recipeId: number;
      text: string;
      images: string[];
    }) => createCommentApi(recipeId, { text, images }),
  });
}

/**
 * 用户交互相关 API（点赞、收藏）
 */
import { api } from '@/api/client';
import type {
  Result,
  IPage,
  TocRecipeVO,
  TocLikeVO,
  TocFavoriteVO,
  TocCommentVO,
  PageParams,
} from '@/api/types';

/**
 * 点赞/取消点赞
 */
export const toggleLike = (recipeId: number) => {
  return api.post<Result<TocLikeVO>>(`/api/toc/v1/users/me/recipes/${recipeId}/like`);
};

/**
 * 收藏/取消收藏
 */
export const toggleFavorite = (recipeId: number) => {
  return api.post<Result<TocFavoriteVO>>(`/api/toc/v1/users/me/recipes/${recipeId}/favorite`);
};

/**
 * 获取我的点赞菜谱ID列表
 */
export const getMyLikedRecipeIds = () => {
  return api.get<Result<number[]>>('/api/toc/v1/users/me/likes');
};

/**
 * 获取我的收藏列表
 */
export const getMyFavorites = (params?: PageParams) => {
  return api.get<Result<IPage<TocRecipeVO>>>('/api/toc/v1/users/me/favorites', { params });
};

/**
 * 获取我的评论列表
 */
export const getMyComments = (params?: PageParams) => {
  return api.get<Result<IPage<TocCommentVO>>>('/api/toc/v1/users/me/comments', { params });
};

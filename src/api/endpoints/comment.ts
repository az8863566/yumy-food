/**
 * 评论相关 API
 */
import { api } from '@/api/client';
import type { Result, IPage, TocCommentVO, TocCommentCreateDTO, PageParams } from '@/api/types';

/**
 * 获取菜谱评论列表
 */
export const getComments = (recipeId: number, params?: PageParams) => {
  return api.get<Result<IPage<TocCommentVO>>>(`/api/toc/v1/recipes/${recipeId}/comments`, {
    params,
  });
};

/**
 * 发表评论
 */
export const createComment = (recipeId: number, data: TocCommentCreateDTO) => {
  return api.post<Result<void>>(`/api/toc/v1/recipes/${recipeId}/comments`, data);
};

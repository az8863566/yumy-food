/**
 * 菜谱相关 API
 */
import { api } from '@/api/client';
import type { Result, IPage, TocRecipeVO, TocRecipeDetailVO, RecipeQueryParams } from '@/api/types';

/**
 * 获取菜谱列表
 */
export const getRecipes = (params?: RecipeQueryParams) => {
  return api.get<Result<IPage<TocRecipeVO>>>('/api/toc/v1/recipes', { params });
};

/**
 * 获取菜谱详情
 */
export const getRecipeById = (recipeId: number) => {
  return api.get<Result<TocRecipeDetailVO>>(`/api/toc/v1/recipes/${recipeId}`);
};

/**
 * 搜索菜谱
 */
export const searchRecipes = (q: string, pageNum = 1, pageSize = 10) => {
  return api.get<Result<IPage<TocRecipeVO>>>('/api/toc/v1/recipes/search', {
    params: { q, pageNum, pageSize },
  });
};

/**
 * 获取人气排行榜
 */
export const getTopRanked = (limit = 3) => {
  return api.get<Result<TocRecipeVO[]>>('/api/toc/v1/recipes/top-ranked', {
    params: { limit },
  });
};

/**
 * 获取推荐菜谱
 */
export const getRecommended = (page = 1, pageSize = 10) => {
  return api.get<Result<IPage<TocRecipeVO>>>('/api/toc/v1/recipes/recommended', {
    params: { page, pageSize },
  });
};

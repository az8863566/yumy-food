/**
 * 菜谱详情 Hook
 * 基于 TanStack Query 封装单个菜谱详情获取和缓存逻辑
 * 返回前端兼容的 Recipe 类型（已做 number→string 转换）
 */
import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '@/api/endpoints';
import { adaptRecipe } from '@/api/adapter';
import type { IRecipe } from '@/types';

interface UseRecipeDetailReturn {
  recipe: IRecipe | null;
  loading: boolean;
  error: Error | null;
}

export function useRecipeDetail(recipeId: number | null): UseRecipeDetailReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipeDetail', recipeId],
    queryFn: async () => {
      if (!recipeId) return null;
      const response = await getRecipeById(recipeId);
      if (response.code === 0 && response.data) {
        return adaptRecipe(response.data);
      }
      throw new Error(response.msg ?? response.message ?? '获取菜谱详情失败');
    },
    enabled: !!recipeId,
  });

  return {
    recipe: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
  };
}

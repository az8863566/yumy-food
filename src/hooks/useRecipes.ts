/**
 * 菜谱列表 Hook
 * 基于 TanStack Query 封装菜谱列表获取、缓存和分页逻辑
 * 返回前端兼容的 Recipe 类型（已做 number→string 转换）
 */
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { RecipeQueryParams } from '@/api/types';
import type { IRecipe } from '@/types';

interface UseRecipesReturn {
  recipes: IRecipe[];
  loading: boolean;
  error: Error | null;
  total: number;
}

export function useRecipes(params?: RecipeQueryParams): UseRecipesReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes', params],
    queryFn: async () => {
      const response = await getRecipes(params);
      if (response.code === 0 && response.data) {
        return {
          recipes: adaptRecipes(response.data.records || []),
          total: response.data.total || 0,
        };
      }
      throw new Error(response.msg ?? response.message ?? '获取菜谱列表失败');
    },
  });

  return {
    recipes: data?.recipes ?? [],
    loading: isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    total: data?.total ?? 0,
  };
}

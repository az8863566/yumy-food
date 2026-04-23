/**
 * 分类菜谱查询 Hook
 * 基于 TanStack Query 根据子分类 ID 查询菜谱列表并缓存
 */
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { IRecipe } from '@/types';

interface UseCategoryRecipesReturn {
  recipes: IRecipe[];
  loading: boolean;
  error: Error | null;
}

export function useCategoryRecipes(categoryId: string | null): UseCategoryRecipesReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryRecipes', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const response = await getRecipes({
        categoryId: Number(categoryId),
        pageNum: 1,
        pageSize: 50,
      });
      if (response.code === 0 && response.data) {
        return adaptRecipes(response.data.records || []);
      }
      throw new Error(response.msg ?? response.message ?? '获取分类菜谱失败');
    },
    enabled: !!categoryId,
  });

  return {
    recipes: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
  };
}

/**
 * 分类菜谱查询 Hook
 * 根据子分类 ID 查询该分类下的菜谱列表
 */
import { useState, useEffect, useCallback } from 'react';
import { getRecipes } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { Recipe } from '@/@types';

interface UseCategoryRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: Error | null;
  fetchRecipesByCategory: (categoryId: string) => Promise<void>;
}

export function useCategoryRecipes(categoryId: string | null): UseCategoryRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipesByCategory = useCallback(async (catId: string) => {
    if (!catId) {
      setRecipes([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await getRecipes({
        categoryId: Number(catId),
        pageNum: 1,
        pageSize: 50,
      });
      if (response.code === 0 && response.data) {
        setRecipes(adaptRecipes(response.data.records || []));
      } else {
        throw new Error(response.msg || response.message || '获取分类菜谱失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('Failed to fetch category recipes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipesByCategory(categoryId || '');
  }, [categoryId, fetchRecipesByCategory]);

  return {
    recipes,
    loading,
    error,
    fetchRecipesByCategory,
  };
}

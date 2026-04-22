/**
 * 菜谱详情 Hook
 * 封装单个菜谱详情获取逻辑
 * 返回前端兼容的 Recipe 类型（已做 number→string 转换）
 */
import { useState, useEffect, useCallback } from 'react';
import { getRecipeById } from '@/api/endpoints';
import { adaptRecipe } from '@/api/adapter';
import type { Recipe } from '@/@types';

interface UseRecipeDetailReturn {
  recipe: Recipe | null;
  loading: boolean;
  error: Error | null;
  fetchRecipe: (recipeId: number) => Promise<void>;
}

export function useRecipeDetail(recipeId: number | null): UseRecipeDetailReturn {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipe = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRecipeById(id);

        if (response.code === 0 && response.data) {
          setRecipe(adaptRecipe(response.data));
        } else {
          throw new Error(response.msg || response.message || '获取菜谱详情失败');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('未知错误'));
        console.error('Failed to fetch recipe detail:', err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (recipeId) {
      fetchRecipe(recipeId);
    }
  }, [recipeId, fetchRecipe]);

  return {
    recipe,
    loading,
    error,
    fetchRecipe,
  };
}

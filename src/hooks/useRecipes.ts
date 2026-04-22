/**
 * 菜谱列表 Hook
 * 封装菜谱列表获取、搜索、分页等逻辑
 * 返回前端兼容的 Recipe 类型（已做 number→string 转换）
 */
import { useState, useEffect, useCallback } from 'react';
import { getRecipes } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { RecipeQueryParams } from '@/api/types';
import type { Recipe } from '@/@types';

interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: Error | null;
  total: number;
  fetchRecipes: (params?: RecipeQueryParams) => Promise<void>;
}

export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchRecipes = useCallback(async (params?: RecipeQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRecipes(params);
      
      if (response.code === 0 && response.data) {
        setRecipes(adaptRecipes(response.data.records || []));
        setTotal(response.data.total || 0);
      } else {
        throw new Error(response.msg || response.message || '获取菜谱列表失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    total,
    fetchRecipes,
  };
}

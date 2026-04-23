import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigationContext } from '@/store/NavigationContext';
import { searchRecipes, getTopRanked, getRecommended } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { IRecipe } from '@/types';

/**
 * 菜谱搜索和过滤相关 Hook
 * 基于 TanStack Query 封装食谱搜索、排行榜、推荐等逻辑
 * 所有数据均来自后端 API
 */
export function useSearchRecipes() {
  const { searchQuery } = useNavigationContext();

  // 搜索防抖
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: topData, isLoading: topLoading } = useQuery({
    queryKey: ['topRanked'],
    queryFn: async () => {
      const response = await getTopRanked(3);
      if (response.code === 0 && response.data) {
        return adaptRecipes(response.data);
      }
      return [] as IRecipe[];
    },
  });

  const { data: recommendedData, isLoading: recommendedLoading } = useQuery({
    queryKey: ['recommended'],
    queryFn: async () => {
      const response = await getRecommended(1, 10);
      if (response.code === 0 && response.data) {
        return adaptRecipes(response.data.records || []);
      }
      return [] as IRecipe[];
    },
  });

  const isSearching = debouncedQuery.trim().length > 0;

  const {
    data: searchData,
    isLoading: searchLoading,
    error,
  } = useQuery({
    queryKey: ['searchRecipes', debouncedQuery.trim()],
    queryFn: async () => {
      const query = debouncedQuery.trim();
      if (!query) return [] as IRecipe[];
      const response = await searchRecipes(query, 1, 20);
      if (response.code === 0 && response.data) {
        return adaptRecipes(response.data.records || []);
      }
      throw new Error(response.msg ?? response.message ?? '搜索失败');
    },
    enabled: isSearching,
  });

  const topRanked = topData ?? [];
  const recommended = recommendedData ?? [];
  const searchResults = searchData ?? [];
  const loading = topLoading || recommendedLoading || (isSearching && searchLoading);

  const displayRecipes = useMemo(() => {
    return isSearching ? (searchData ?? []) : (recommendedData ?? []);
  }, [isSearching, searchData, recommendedData]);

  return {
    topRanked,
    recommended,
    searchResults,
    displayRecipes,
    isSearching: searchQuery.trim().length > 0,
    loading,
    loadingSearch: searchLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    searchQuery,
  };
}

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigationContext } from '@/store/NavigationContext';
import { searchRecipes, getTopRanked, getRecommended } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { Recipe } from '@/@types';

/**
 * 菜谱搜索和过滤相关 Hook
 * 封装食谱搜索、排行榜、推荐等逻辑
 * 所有数据均来自后端 API
 */
export function useSearchRecipes() {
  const { searchQuery } = useNavigationContext();

  const [topRanked, setTopRanked] = useState<Recipe[]>([]);
  const [recommended, setRecommended] = useState<Recipe[]>([]);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 获取人气排行榜
   */
  const fetchTopRanked = useCallback(async () => {
    try {
      setLoadingTop(true);
      const response = await getTopRanked(3);
      if (response.code === 0 && response.data) {
        setTopRanked(adaptRecipes(response.data));
      }
    } catch (err) {
      console.error('Failed to fetch top ranked:', err);
    } finally {
      setLoadingTop(false);
    }
  }, []);

  /**
   * 获取推荐菜谱
   */
  const fetchRecommended = useCallback(async () => {
    try {
      setLoadingRecommended(true);
      const response = await getRecommended(1, 10);
      if (response.code === 0 && response.data) {
        setRecommended(adaptRecipes(response.data.records || []));
      }
    } catch (err) {
      console.error('Failed to fetch recommended:', err);
    } finally {
      setLoadingRecommended(false);
    }
  }, []);

  /**
   * 搜索菜谱（带防抖）
   */
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }
    try {
      setLoadingSearch(true);
      setError(null);
      const response = await searchRecipes(query.trim(), 1, 20);
      if (response.code === 0 && response.data) {
        setSearchResults(adaptRecipes(response.data.records || []));
      } else {
        throw new Error(response.msg || response.message || '搜索失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('搜索失败'));
      console.error('Failed to search recipes:', err);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  /**
   * 加载人气排行和推荐
   */
  useEffect(() => {
    fetchTopRanked();
    fetchRecommended();
  }, [fetchTopRanked, fetchRecommended]);

  /**
   * 搜索防抖
   */
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const isSearching = searchQuery.trim().length > 0;
  const loading = loadingTop || loadingRecommended || (isSearching && loadingSearch);

  /**
   * 最终展示列表：有搜索词时展示搜索结果，否则展示推荐
   */
  const displayRecipes = useMemo(() => {
    return isSearching ? searchResults : recommended;
  }, [isSearching, searchResults, recommended]);

  return {
    topRanked,
    recommended,
    searchResults,
    displayRecipes,
    isSearching,
    loading,
    loadingSearch,
    error,
    searchQuery,
  };
}

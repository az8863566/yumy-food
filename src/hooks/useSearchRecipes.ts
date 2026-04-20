import { useMemo } from 'react';
import { useRecipeContext } from '@/store/RecipeContext';
import { useNavigationContext } from '@/store/NavigationContext';

/**
 * 菜谱搜索和过滤相关 Hook
 * 封装食谱搜索、排行榜、推荐等逻辑
 */
export function useSearchRecipes() {
  const { recipes } = useRecipeContext();
  const { searchQuery } = useNavigationContext();

  /**
   * 根据搜索关键词过滤菜谱
   */
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;

    const query = searchQuery.toLowerCase();
    return recipes.filter(
      (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query),
    );
  }, [recipes, searchQuery]);

  /**
   * 获取人气排行榜（点赞数前3名）
   */
  const topRanked = useMemo(() => {
    return [...recipes].sort((a, b) => b.likes - a.likes).slice(0, 3);
  }, [recipes]);

  /**
   * 获取推荐菜谱（排除排行榜的菜谱）
   */
  const recommended = useMemo(() => {
    const topIds = new Set(topRanked.map((r) => r.id));
    return recipes.filter((r) => !topIds.has(r.id));
  }, [recipes, topRanked]);

  return {
    filteredRecipes,
    topRanked,
    recommended,
    searchQuery,
  };
}

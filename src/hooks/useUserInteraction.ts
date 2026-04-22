/**
 * 用户交互 Hook（点赞、收藏）
 * 封装点赞、收藏的状态管理和API调用
 */
import { useState, useEffect, useCallback } from 'react';
import { toggleLike, toggleFavorite, getMyLikedRecipeIds, getMyFavorites } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { Recipe } from '@/@types';

interface UseUserInteractionReturn {
  likedRecipeIds: Set<number>;
  favoritedRecipeIds: Set<number>;
  myFavorites: Recipe[];
  loading: boolean;
  toggleLikeAction: (recipeId: number) => Promise<void>;
  toggleFavoriteAction: (recipeId: number) => Promise<void>;
  isLiked: (recipeId: number) => boolean;
  isFavorited: (recipeId: number) => boolean;
  refreshInteraction: () => Promise<void>;
}

export function useUserInteraction(): UseUserInteractionReturn {
  const [likedRecipeIds, setLikedRecipeIds] = useState<Set<number>>(new Set());
  const [favoritedRecipeIds, setFavoritedRecipeIds] = useState<Set<number>>(new Set());
  const [myFavorites, setMyFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshInteraction = useCallback(async () => {
    try {
      setLoading(true);
      // 获取点赞列表
      const likesResponse = await getMyLikedRecipeIds();
      if (likesResponse.code === 0 && likesResponse.data) {
        setLikedRecipeIds(new Set(likesResponse.data));
      }

      // 获取收藏列表
      const favoritesResponse = await getMyFavorites();
      if (favoritesResponse.code === 0 && favoritesResponse.data) {
        const favoriteRecipes = adaptRecipes(favoritesResponse.data.records || []);
        setMyFavorites(favoriteRecipes);
        setFavoritedRecipeIds(new Set(favoriteRecipes.map((r) => Number(r.id))));
      }
    } catch (error) {
      console.error('Failed to refresh interaction:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInteraction();
  }, [refreshInteraction]);

  const toggleLikeAction = useCallback(async (recipeId: number) => {
    try {
      const response = await toggleLike(recipeId);
      if (response.code === 0 && response.data) {
        setLikedRecipeIds((prev) => {
          const newSet = new Set(prev);
          if (response.data.liked) {
            newSet.add(recipeId);
          } else {
            newSet.delete(recipeId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }, []);

  const toggleFavoriteAction = useCallback(async (recipeId: number) => {
    try {
      const response = await toggleFavorite(recipeId);
      if (response.code === 0 && response.data) {
        setFavoritedRecipeIds((prev) => {
          const newSet = new Set(prev);
          if (response.data.favorited) {
            newSet.add(recipeId);
          } else {
            newSet.delete(recipeId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, []);

  const isLiked = useCallback(
    (recipeId: number) => {
      return likedRecipeIds.has(recipeId);
    },
    [likedRecipeIds],
  );

  const isFavorited = useCallback(
    (recipeId: number) => {
      return favoritedRecipeIds.has(recipeId);
    },
    [favoritedRecipeIds],
  );

  return {
    likedRecipeIds,
    favoritedRecipeIds,
    myFavorites,
    loading,
    toggleLikeAction,
    toggleFavoriteAction,
    isLiked,
    isFavorited,
    refreshInteraction,
  };
}

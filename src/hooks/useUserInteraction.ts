/**
 * 用户交互 Hook（点赞、收藏）
 * 基于 TanStack Query 封装点赞、收藏的状态管理和 API 调用
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike, toggleFavorite, getMyLikedRecipeIds, getMyFavorites } from '@/api/endpoints';
import { adaptRecipes } from '@/api/adapter';
import type { IRecipe } from '@/types';

interface UseUserInteractionReturn {
  likedRecipeIds: Set<number>;
  favoritedRecipeIds: Set<number>;
  myFavorites: IRecipe[];
  loading: boolean;
  toggleLikeAction: (recipeId: number) => Promise<void>;
  toggleFavoriteAction: (recipeId: number) => Promise<void>;
  isLiked: (recipeId: number) => boolean;
  isFavorited: (recipeId: number) => boolean;
  refreshInteraction: () => Promise<void>;
}

export function useUserInteraction(): UseUserInteractionReturn {
  const queryClient = useQueryClient();

  const { data: likedRecipeIds = new Set<number>(), isLoading: likesLoading } = useQuery({
    queryKey: ['likedRecipeIds'],
    queryFn: async () => {
      const response = await getMyLikedRecipeIds();
      if (response.code === 0 && response.data) {
        return new Set(response.data);
      }
      return new Set<number>();
    },
  });

  const { data: myFavorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: async () => {
      const response = await getMyFavorites();
      if (response.code === 0 && response.data) {
        return adaptRecipes(response.data.records || []);
      }
      return [] as IRecipe[];
    },
  });

  const { data: favoritedRecipeIds = new Set<number>() } = useQuery({
    queryKey: ['favoritedRecipeIds'],
    queryFn: async () => {
      const response = await getMyFavorites();
      if (response.code === 0 && response.data) {
        const recipes = adaptRecipes(response.data.records || []);
        return new Set(recipes.map((r) => Number(r.id)));
      }
      return new Set<number>();
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likedRecipeIds'] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['favoritedRecipeIds'] });
    },
  });

  const toggleLikeAction = async (recipeId: number) => {
    await toggleLikeMutation.mutateAsync(recipeId);
  };

  const toggleFavoriteAction = async (recipeId: number) => {
    await toggleFavoriteMutation.mutateAsync(recipeId);
  };

  const isLiked = (recipeId: number) => likedRecipeIds.has(recipeId);
  const isFavorited = (recipeId: number) => favoritedRecipeIds.has(recipeId);

  const refreshInteraction = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['likedRecipeIds'] }),
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] }),
      queryClient.invalidateQueries({ queryKey: ['favoritedRecipeIds'] }),
    ]);
  };

  return {
    likedRecipeIds,
    favoritedRecipeIds,
    myFavorites,
    loading: likesLoading || favoritesLoading,
    toggleLikeAction,
    toggleFavoriteAction,
    isLiked,
    isFavorited,
    refreshInteraction,
  };
}

import React, {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import type { IRecipe, IComment } from '@/types';
import { initialRecipes, initialComments } from '@/data';
import { useRecipes } from '@/hooks/useRecipes';
import {
  useToggleLikeMutation,
  useToggleFavoriteMutation,
  useAddCommentMutation,
} from '@/hooks/useRecipeMutations';

interface RecipeContextType {
  recipes: IRecipe[];
  isLoading: boolean;
  comments: IComment[];
  likes: string[];
  favorites: string[];
  toggleLike: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addComment: (recipeId: string, text: string, images: string[]) => void;
  clearUserActions: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const { recipes: apiRecipes, loading: apiLoading } = useRecipes();
  const [recipes, setRecipes] = useState<IRecipe[]>(initialRecipes);
  const [comments, setComments] = useState<IComment[]>(initialComments);
  const [likes, setLikes] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleLikeMutation = useToggleLikeMutation();
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const addCommentMutation = useAddCommentMutation();

  // 当 API 数据加载后，更新本地状态（API 有数据则使用 API 数据，否则保留初始数据）
  useEffect(() => {
    if (apiRecipes.length > 0) {
      setRecipes(apiRecipes);
    }
  }, [apiRecipes]);

  const toggleLike = useCallback(
    (id: string) => {
      const isCurrentlyLiked = likes.includes(id);
      // 乐观更新本地状态
      setLikes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      setRecipes((old) =>
        old.map((r) =>
          r.id === id ? { ...r, likes: isCurrentlyLiked ? r.likes - 1 : r.likes + 1 } : r,
        ),
      );
      // 通过 useMutation 调用后端 API
      toggleLikeMutation.mutate(Number(id), {
        onSuccess: (response) => {
          if (response.code === 0 && response.data) {
            // 使用后端返回的最新点赞数同步
            setRecipes((old) =>
              old.map((r) => (r.id === id ? { ...r, likes: response.data.likesCount } : r)),
            );
          }
        },
        onError: (error) => {
          console.error('Toggle like API failed:', error);
        },
      });
    },
    [likes, toggleLikeMutation],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      // 乐观更新本地状态
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      // 通过 useMutation 调用后端 API
      toggleFavoriteMutation.mutate(Number(id), {
        onError: (error) => {
          console.error('Toggle favorite API failed:', error);
        },
      });
    },
    [toggleFavoriteMutation],
  );

  const addComment = useCallback(
    (recipeId: string, text: string, images: string[]) => {
      const tempId = `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newComment: IComment = {
        id: tempId,
        recipeId,
        text,
        images,
        date: new Date().toISOString().split('T')[0],
      };
      // 乐观更新本地状态
      setComments((prev) => [newComment, ...prev]);
      // 通过 useMutation 调用后端 API
      addCommentMutation.mutate(
        { recipeId: Number(recipeId), text, images },
        {
          onError: (error) => {
            console.error('Create comment API failed:', error);
          },
        },
      );
    },
    [addCommentMutation],
  );

  const clearUserActions = useCallback(() => {
    setLikes([]);
    setFavorites([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      recipes,
      isLoading: apiLoading,
      comments,
      likes,
      favorites,
      toggleLike,
      toggleFavorite,
      addComment,
      clearUserActions,
    }),
    [
      recipes,
      apiLoading,
      comments,
      likes,
      favorites,
      toggleLike,
      toggleFavorite,
      addComment,
      clearUserActions,
    ],
  );

  return <RecipeContext value={contextValue}>{children}</RecipeContext>;
}

export const useRecipeContext = () => {
  const context = use(RecipeContext);
  if (!context) throw new Error('useRecipeContext must be used within RecipeProvider');
  return context;
};

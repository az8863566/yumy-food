import React, { createContext, use, useCallback, useMemo, useState, ReactNode, useEffect } from 'react';
import type { Recipe, Comment } from '@/@types';
import { initialRecipes, initialComments } from '@/data';
import { useRecipes } from '@/hooks/useRecipes';
import {
  toggleLike as toggleLikeApi,
  toggleFavorite as toggleFavoriteApi,
  createComment as createCommentApi,
} from '@/api/endpoints';

interface RecipeContextType {
  recipes: Recipe[];
  isLoading: boolean;
  comments: Comment[];
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
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [likes, setLikes] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

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
      // 异步调用后端 API（fire-and-forget，失败不回滚）
      toggleLikeApi(Number(id))
        .then((response) => {
          if (response.code === 0 && response.data) {
            // 使用后端返回的最新点赞数同步
            setRecipes((old) =>
              old.map((r) => (r.id === id ? { ...r, likes: response.data.likesCount } : r)),
            );
          }
        })
        .catch((error) => {
          console.error('Toggle like API failed:', error);
        });
    },
    [likes],
  );

  const toggleFavorite = useCallback((id: string) => {
    // 乐观更新本地状态
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    // 异步调用后端 API
    toggleFavoriteApi(Number(id)).catch((error) => {
      console.error('Toggle favorite API failed:', error);
    });
  }, []);

  const addComment = useCallback((recipeId: string, text: string, images: string[]) => {
    const tempId = `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newComment: Comment = {
      id: tempId,
      recipeId,
      text,
      images,
      date: new Date().toISOString().split('T')[0],
    };
    // 乐观更新本地状态
    setComments((prev) => [newComment, ...prev]);
    // 异步调用后端 API
    createCommentApi(Number(recipeId), { text, images })
      .then((response) => {
        if (response.code !== 0) {
          console.error('Create comment API failed:', response.msg || response.message);
        }
      })
      .catch((error) => {
        console.error('Create comment API failed:', error);
      });
  }, []);

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
    [recipes, apiLoading, comments, likes, favorites, toggleLike, toggleFavorite, addComment, clearUserActions],
  );

  return <RecipeContext value={contextValue}>{children}</RecipeContext>;
}

export const useRecipeContext = () => {
  const context = use(RecipeContext);
  if (!context) throw new Error('useRecipeContext must be used within RecipeProvider');
  return context;
};

import React, { createContext, use, useCallback, useMemo, useState, ReactNode } from 'react';
import type { Recipe, Comment } from '@/@types';
import { initialRecipes, initialComments } from '@/data';

interface RecipeContextType {
  recipes: Recipe[];
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
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [likes, setLikes] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleLike = useCallback(
    (id: string) => {
      const isCurrentlyLiked = likes.includes(id);
      setLikes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      setRecipes((old) =>
        old.map((r) =>
          r.id === id ? { ...r, likes: isCurrentlyLiked ? r.likes - 1 : r.likes + 1 } : r,
        ),
      );
    },
    [likes],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const addComment = useCallback((recipeId: string, text: string, images: string[]) => {
    const newComment: Comment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipeId,
      text,
      images,
      date: new Date().toISOString().split('T')[0],
    };
    setComments((prev) => [newComment, ...prev]);
  }, []);

  const clearUserActions = useCallback(() => {
    setLikes([]);
    setFavorites([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      recipes,
      comments,
      likes,
      favorites,
      toggleLike,
      toggleFavorite,
      addComment,
      clearUserActions,
    }),
    [recipes, comments, likes, favorites, toggleLike, toggleFavorite, addComment, clearUserActions],
  );

  return <RecipeContext value={contextValue}>{children}</RecipeContext>;
}

export const useRecipeContext = () => {
  const context = use(RecipeContext);
  if (!context) throw new Error('useRecipeContext must be used within RecipeProvider');
  return context;
};

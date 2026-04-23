import React, { ReactNode } from 'react';
import { useAuthStore } from './useAuthStore';
import { RecipeProvider, useRecipeContext } from './RecipeContext';
import { NavigationProvider, useNavigationContext } from './NavigationContext';

/**
 * 应用 Provider 组合层
 * 聚合剩余 Context Provider（Recipe + Navigation），Auth 已迁移至 Zustand
 */
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <RecipeProvider>{children}</RecipeProvider>
    </NavigationProvider>
  );
}

/**
 * 兼容旧版 useAppStore Hook
 * 合并 Zustand Auth Store 与剩余 Context 状态，保持向后兼容
 */
export function useAppStore() {
  const auth = useAuthStore();
  const recipe = useRecipeContext();
  const navigation = useNavigationContext();

  return {
    // Auth 状态
    currentUser: auth.currentUser,
    showAuthModal: auth.showAuthModal,
    setShowAuthModal: auth.setShowAuthModal,
    login: auth.login,
    logout: async () => {
      await auth.logout();
      // 登出时清空点赞和收藏
      recipe.clearUserActions();
    },

    // Recipe 状态
    recipes: recipe.recipes,
    comments: recipe.comments,
    likes: recipe.likes,
    favorites: recipe.favorites,
    toggleLike: recipe.toggleLike,
    toggleFavorite: recipe.toggleFavorite,
    addComment: recipe.addComment,

    // Navigation 状态
    activeMinorCategoryId: navigation.activeMinorCategoryId,
    searchQuery: navigation.searchQuery,
    setActiveMinorCategoryId: navigation.setActiveMinorCategoryId,
    setSearchQuery: navigation.setSearchQuery,
  };
}

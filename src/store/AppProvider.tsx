import React, { ReactNode } from 'react';
import { AuthProvider, useAuthContext } from './AuthContext';
import { RecipeProvider, useRecipeContext } from './RecipeContext';
import { NavigationProvider, useNavigationContext } from './NavigationContext';

/**
 * 应用 Provider 组合层
 * 聚合所有 Context Provider，提供全局状态
 */
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <AuthProvider>
        <RecipeProvider>{children}</RecipeProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}

/**
 * 兼容旧版 useAppStore Hook
 * 合并所有 Context 的状态，保持向后兼容
 */
export function useAppStore() {
  const auth = useAuthContext();
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
    currentTab: navigation.currentTab,
    activeRecipeId: navigation.activeRecipeId,
    activeMinorCategoryId: navigation.activeMinorCategoryId,
    searchQuery: navigation.searchQuery,
    setCurrentTab: navigation.setCurrentTab,
    setActiveRecipeId: navigation.setActiveRecipeId,
    setActiveMinorCategoryId: navigation.setActiveMinorCategoryId,
    setSearchQuery: navigation.setSearchQuery,
  };
}

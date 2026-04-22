import React, { createContext, use, useMemo, useState, ReactNode } from 'react';
import type { TabType } from '@/@types';

interface NavigationContextType {
  currentTab: TabType;
  activeRecipeId: string | null;
  activeMinorCategoryId: string | null;
  searchQuery: string;
  showEditProfile: boolean;
  setCurrentTab: (tab: TabType) => void;
  setActiveRecipeId: (id: string | null) => void;
  setActiveMinorCategoryId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setShowEditProfile: (show: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [activeMinorCategoryId, setActiveMinorCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);

  const contextValue = useMemo(
    () => ({
      currentTab,
      activeRecipeId,
      activeMinorCategoryId,
      searchQuery,
      showEditProfile,
      setCurrentTab,
      setActiveRecipeId,
      setActiveMinorCategoryId,
      setSearchQuery,
      setShowEditProfile,
    }),
    [currentTab, activeRecipeId, activeMinorCategoryId, searchQuery, showEditProfile],
  );

  return <NavigationContext value={contextValue}>{children}</NavigationContext>;
}

export const useNavigationContext = () => {
  const context = use(NavigationContext);
  if (!context) throw new Error('useNavigationContext must be used within NavigationProvider');
  return context;
};

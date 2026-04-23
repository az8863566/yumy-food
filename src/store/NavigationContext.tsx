import React, { createContext, use, useMemo, useState, ReactNode } from 'react';

interface NavigationContextType {
  activeMinorCategoryId: string | null;
  searchQuery: string;
  setActiveMinorCategoryId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeMinorCategoryId, setActiveMinorCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const contextValue = useMemo(
    () => ({
      activeMinorCategoryId,
      searchQuery,
      setActiveMinorCategoryId,
      setSearchQuery,
    }),
    [activeMinorCategoryId, searchQuery],
  );

  return <NavigationContext value={contextValue}>{children}</NavigationContext>;
}

export const useNavigationContext = () => {
  const context = use(NavigationContext);
  if (!context) throw new Error('useNavigationContext must be used within NavigationProvider');
  return context;
};

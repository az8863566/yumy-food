import React, {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import type { User } from '@/@types';

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  setShowAuthModal: (show: boolean) => void;
  showAuthModal: boolean;
  /** 登录后待执行的回调（如跳转到菜谱详情） */
  pendingAction: (() => void) | null;
  /** 设置登录后待执行的回调 */
  setPendingAction: (action: (() => void) | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const setPendingAction = useCallback((action: (() => void) | null) => {
    pendingActionRef.current = action;
  }, []);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    pendingActionRef.current = null;
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      setShowAuthModal,
      showAuthModal,
      pendingAction: pendingActionRef.current,
      setPendingAction,
    }),
    [currentUser, showAuthModal, login, logout, setPendingAction],
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}

/**
 * 获取 AuthContext 值的自定义 Hook
 * 使用 React 19 的 use() 替代 useContext()：
 * - use() 在 Provider 缺失时会直接抛出 React 错误
 * - useContext() 在 Provider 缺失时返回 undefined，允许自定义处理
 * 当前实现通过手动检查 context 值来提供友好的错误信息
 */
export const useAuthContext = () => {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};

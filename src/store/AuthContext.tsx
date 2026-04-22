import React, {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { storageService } from '@/services/storage.service';
import type { User } from '@/@types';
import { login as loginApi, register as registerApi, getCurrentUser } from '@/api/endpoints';
import type { TocAuthRegisterDTO } from '@/api/types';
import { adaptUser } from '@/api/adapter';

interface AuthContextType {
  currentUser: User | null;
  isAuthLoading: boolean;
  login: (user: User) => void;
  loginAsync: (username: string, password: string) => Promise<void>;
  registerAsync: (data: TocAuthRegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUser: (user: Partial<User>) => void;
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
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  // 应用启动时尝试自动登录（Token 有效性校验）
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await storageService.getItemAsync('auth_token');
        if (token) {
          const response = await getCurrentUser();
          if (response.code === 0 && response.data) {
            setCurrentUser(adaptUser(response.data));
          } else {
            await storageService.deleteItemAsync('auth_token');
          }
        }
      } catch (error) {
        console.error('Init auth failed:', error);
        await storageService.deleteItemAsync('auth_token');
      }
    };
    initAuth();
  }, []);

  const setPendingAction = useCallback((action: (() => void) | null) => {
    pendingActionRef.current = action;
  }, []);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const loginAsync = useCallback(async (username: string, password: string) => {
    setIsAuthLoading(true);
    try {
      const response = await loginApi({ username, password });
      if (response.code === 0 && response.data) {
        await storageService.setItemAsync('auth_token', response.data.token);
        setCurrentUser(adaptUser(response.data.user));
      } else {
        throw new Error(response.msg || response.message || '登录失败');
      }
    } catch (error: any) {
      // 打印完整错误对象用于调试
      console.error('[loginAsync] Caught error:', {
        backendMessage: error?.backendMessage,
        responseData: error?.responseData,
        responseDataMsg: error?.responseData?.msg,
        responseDataMessage: error?.responseData?.message,
        axiosMsg: error?.response?.data?.msg,
        axiosMessage: error?.response?.data?.message,
        errorMessage: error?.message,
      });
      // 提取后端返回的业务错误消息或网络错误消息
      const message =
        error?.backendMessage ||
        error?.responseData?.msg ||
        error?.responseData?.message ||
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        '登录失败，请稍后重试';
      throw new Error(message);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const registerAsync = useCallback(async (data: TocAuthRegisterDTO) => {
    setIsAuthLoading(true);
    try {
      const response = await registerApi(data);
      if (response.code === 0 && response.data) {
        await storageService.setItemAsync('auth_token', response.data.token);
        setCurrentUser(adaptUser(response.data.user));
      } else {
        throw new Error(response.msg || response.message || '注册失败');
      }
    } catch (error: any) {
      // 打印完整错误对象用于调试
      console.error('[registerAsync] Caught error:', {
        backendMessage: error?.backendMessage,
        responseData: error?.responseData,
        responseDataMsg: error?.responseData?.msg,
        responseDataMessage: error?.responseData?.message,
        axiosMsg: error?.response?.data?.msg,
        axiosMessage: error?.response?.data?.message,
        errorMessage: error?.message,
      });
      // 提取后端返回的业务错误消息或网络错误消息
      const message =
        error?.backendMessage ||
        error?.responseData?.msg ||
        error?.responseData?.message ||
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        '注册失败，请稍后重试';
      throw new Error(message);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await storageService.deleteItemAsync('auth_token');
    setCurrentUser(null);
    pendingActionRef.current = null;
  }, []);

  const updateCurrentUser = useCallback((user: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...user } : null));
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      isAuthLoading,
      login,
      loginAsync,
      registerAsync,
      logout,
      updateCurrentUser,
      setShowAuthModal,
      showAuthModal,
      pendingAction: pendingActionRef.current,
      setPendingAction,
    }),
    [
      currentUser,
      isAuthLoading,
      showAuthModal,
      login,
      loginAsync,
      registerAsync,
      logout,
      updateCurrentUser,
      setPendingAction,
    ],
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

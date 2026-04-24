/**
 * 认证状态 Zustand Store
 * 替代原来的 AuthContext，管理用户会话状态
 */
import { create } from 'zustand';
import { storageService } from '@/services/storage.service';
import type { IUser } from '@/types';
import type { TocAuthRegisterDTO } from '@/api/types';
import { login as loginApi, register as registerApi, getCurrentUser } from '@/api/endpoints';
import { adaptUser } from '@/api/adapter';

interface AuthErrorLike {
  backendMessage?: string;
  responseData?: { msg?: string; message?: string };
  response?: { data?: { msg?: string; message?: string } };
  message?: string;
}

interface AuthState {
  /** 当前登录用户 */
  currentUser: IUser | null;
  /** 认证加载状态 */
  isAuthLoading: boolean;
  /** 是否显示登录弹窗 */
  showAuthModal: boolean;
  /** 登录成功后待执行的回调 */
  pendingAction: (() => void) | null;

  /** 设置当前用户 */
  login: (user: IUser) => void;
  /** 更新当前用户信息 */
  updateCurrentUser: (user: Partial<IUser>) => void;
  /** 异步登录 */
  loginAsync: (username: string, password: string) => Promise<void>;
  /** 异步注册 */
  registerAsync: (data: TocAuthRegisterDTO) => Promise<void>;
  /** 登出 */
  logout: () => Promise<void>;
  /** 设置登录弹窗显示状态 */
  setShowAuthModal: (show: boolean) => void;
  /** 设置登录后待执行回调 */
  setPendingAction: (action: (() => void) | null) => void;
  /** 应用启动时初始化认证状态 */
  initAuth: () => Promise<void>;
}

function extractErrorMessage(error: unknown): string {
  const err = error as AuthErrorLike;
  return (
    err.backendMessage ??
    err.responseData?.msg ??
    err.responseData?.message ??
    err.response?.data?.msg ??
    err.response?.data?.message ??
    err.message ??
    '操作失败，请稍后重试'
  );
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthLoading: false,
  showAuthModal: false,
  pendingAction: null,

  login: (user) => set({ currentUser: user }),

  updateCurrentUser: (user) =>
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...user } : null,
    })),

  loginAsync: async (username, password) => {
    set({ isAuthLoading: true });
    try {
      const response = await loginApi({ username, password });
      if (response.code === 0 && response.data) {
        await storageService.setItemAsync('auth_token', response.data.token);
        set({ currentUser: adaptUser(response.data.user) });
      } else {
        throw new Error(response.msg ?? response.message ?? '登录失败');
      }
    } catch (error: unknown) {
      console.error('[loginAsync] Caught error:', error);
      throw new Error(extractErrorMessage(error), { cause: error });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  registerAsync: async (data) => {
    set({ isAuthLoading: true });
    try {
      const response = await registerApi(data);
      if (response.code === 0 && response.data) {
        await storageService.setItemAsync('auth_token', response.data.token);
        set({ currentUser: adaptUser(response.data.user) });
      } else {
        throw new Error(response.msg ?? response.message ?? '注册失败');
      }
    } catch (error: unknown) {
      console.error('[registerAsync] Caught error:', error);
      throw new Error(extractErrorMessage(error), { cause: error });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  logout: async () => {
    await storageService.deleteItemAsync('auth_token');
    set({ currentUser: null, pendingAction: null });
  },

  setShowAuthModal: (show) => set({ showAuthModal: show }),

  setPendingAction: (action) => set({ pendingAction: action }),

  initAuth: async () => {
    try {
      const token = await storageService.getItemAsync('auth_token');
      if (token) {
        const response = await getCurrentUser();
        if (response.code === 0 && response.data) {
          set({ currentUser: adaptUser(response.data) });
        } else {
          await storageService.deleteItemAsync('auth_token');
        }
      }
    } catch (error: unknown) {
      console.error('Init auth failed:', error);
      await storageService.deleteItemAsync('auth_token');
    }
  },
}));

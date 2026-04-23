import { useAuthStore } from '@/store/useAuthStore';

/**
 * 认证相关 Hook
 * 封装登录状态检查和权限验证逻辑
 */
export function useAuth() {
  const { currentUser, setShowAuthModal, setPendingAction } = useAuthStore();

  /**
   * 检查用户是否已登录，未登录则显示登录弹窗
   * 登录成功后会自动执行 callback（如跳转到菜谱详情）
   * @param callback 登录成功后执行的回调函数
   */
  const checkAuth = (callback: () => void) => {
    if (!currentUser) {
      setPendingAction(callback);
      setShowAuthModal(true);
    } else {
      callback();
    }
  };

  return {
    currentUser,
    checkAuth,
    isAuthenticated: !!currentUser,
  };
}

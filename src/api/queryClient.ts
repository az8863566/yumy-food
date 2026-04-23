import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query 全局客户端配置
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分钟内数据视为新鲜
      gcTime: 1000 * 60 * 10, // 10 分钟垃圾回收
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

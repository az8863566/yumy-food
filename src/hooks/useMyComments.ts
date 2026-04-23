/**
 * 我的评论列表 Hook
 * 基于 TanStack Query 封装获取当前用户评论列表的逻辑
 */
import { useQuery } from '@tanstack/react-query';
import { getMyComments } from '@/api/endpoints';
import { adaptComments } from '@/api/adapter';
import type { IComment } from '@/types';

interface UseMyCommentsReturn {
  comments: IComment[];
  loading: boolean;
  error: Error | null;
  total: number;
}

export function useMyComments(): UseMyCommentsReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myComments'],
    queryFn: async () => {
      const response = await getMyComments();
      if (response.code === 0 && response.data) {
        return {
          comments: adaptComments(response.data.records || []),
          total: response.data.total || 0,
        };
      }
      throw new Error(response.msg ?? response.message ?? '获取我的评论失败');
    },
  });

  return {
    comments: data?.comments ?? [],
    loading: isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    total: data?.total ?? 0,
  };
}

/**
 * 菜谱评论列表 Hook
 * 基于 TanStack Query 根据菜谱 ID 获取评论列表并缓存
 */
import { useQuery } from '@tanstack/react-query';
import { getComments } from '@/api/endpoints';
import { adaptComments } from '@/api/adapter';
import type { IComment } from '@/types';

interface UseRecipeCommentsReturn {
  comments: IComment[];
  loading: boolean;
  error: Error | null;
  total: number;
}

export function useRecipeComments(recipeId: number | null): UseRecipeCommentsReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipeComments', recipeId],
    queryFn: async () => {
      if (!recipeId) return { comments: [] as IComment[], total: 0 };
      const response = await getComments(recipeId);
      if (response.code === 0 && response.data) {
        return {
          comments: adaptComments(response.data.records || []),
          total: response.data.total || 0,
        };
      }
      throw new Error(response.msg ?? response.message ?? '获取评论失败');
    },
    enabled: !!recipeId,
  });

  return {
    comments: data?.comments ?? [],
    loading: isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    total: data?.total ?? 0,
  };
}

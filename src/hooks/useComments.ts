/**
 * 评论 Hook
 * 基于 TanStack Query 封装评论列表获取和发表评论的逻辑
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment } from '@/api/endpoints';
import type { TocCommentVO, TocCommentCreateDTO, PageParams } from '@/api/types';

interface UseCommentsReturn {
  comments: TocCommentVO[];
  loading: boolean;
  error: Error | null;
  total: number;
  fetchComments: (recipeId: number, params?: PageParams) => Promise<void>;
  addComment: (recipeId: number, data: TocCommentCreateDTO) => Promise<void>;
}

export function useComments(): UseCommentsReturn {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => ({ comments: [] as TocCommentVO[], total: 0 }),
    enabled: false,
  });

  const fetchComments = async (recipeId: number, params?: PageParams) => {
    await queryClient.prefetchQuery({
      queryKey: ['comments', recipeId, params],
      queryFn: async () => {
        const response = await getComments(recipeId, params);
        if (response.code === 0 && response.data) {
          return {
            comments: response.data.records || [],
            total: response.data.total || 0,
          };
        }
        throw new Error(response.msg ?? response.message ?? '获取评论列表失败');
      },
    });
    await refetch();
  };

  const addCommentMutation = useMutation({
    mutationFn: async ({ recipeId, data }: { recipeId: number; data: TocCommentCreateDTO }) => {
      const response = await createComment(recipeId, data);
      if (response.code !== 0) {
        throw new Error(response.message ?? '发表评论失败');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['recipeComments'] });
      queryClient.invalidateQueries({ queryKey: ['myComments'] });
    },
  });

  const addComment = async (recipeId: number, data: TocCommentCreateDTO) => {
    await addCommentMutation.mutateAsync({ recipeId, data });
  };

  return {
    comments: data?.comments ?? [],
    loading: isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    total: data?.total ?? 0,
    fetchComments,
    addComment,
  };
}

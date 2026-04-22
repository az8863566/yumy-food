/**
 * 评论 Hook
 * 封装评论列表获取和发表评论的逻辑
 */
import { useState, useCallback } from 'react';
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
  const [comments, setComments] = useState<TocCommentVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchComments = useCallback(async (recipeId: number, params?: PageParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getComments(recipeId, params);

      if (response.code === 0 && response.data) {
        setComments(response.data.records || []);
        setTotal(response.data.total || 0);
      } else {
        throw new Error(response.msg || response.message || '获取评论列表失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (recipeId: number, data: TocCommentCreateDTO) => {
    try {
      const response = await createComment(recipeId, data);

      if (response.code === 0) {
        // 评论成功后刷新列表
        await fetchComments(recipeId);
      } else {
        throw new Error(response.message || '发表评论失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('Failed to add comment:', err);
      throw err;
    }
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    total,
    fetchComments,
    addComment,
  };
}

/**
 * 菜谱评论列表 Hook
 * 根据菜谱 ID 获取该菜谱的评论列表
 */
import { useState, useEffect, useCallback } from 'react';
import { getComments } from '@/api/endpoints';
import { adaptComments } from '@/api/adapter';
import type { Comment } from '@/@types';
import type { PageParams } from '@/api/types';

interface UseRecipeCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: Error | null;
  total: number;
  fetchComments: (params?: PageParams) => Promise<void>;
}

export function useRecipeComments(recipeId: number | null): UseRecipeCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchComments = useCallback(async (params?: PageParams) => {
    if (!recipeId) {
      setComments([]);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await getComments(recipeId, params);
      if (response.code === 0 && response.data) {
        setComments(adaptComments(response.data.records || []));
        setTotal(response.data.total || 0);
      } else {
        throw new Error(response.msg || response.message || '获取评论失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, total, fetchComments };
}

/**
 * 我的评论列表 Hook
 * 封装获取当前用户评论列表的逻辑
 */
import { useState, useEffect, useCallback } from 'react';
import { getMyComments } from '@/api/endpoints';
import { adaptComments } from '@/api/adapter';
import type { Comment } from '@/@types';
import type { PageParams } from '@/api/types';

interface UseMyCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: Error | null;
  total: number;
  fetchMyComments: (params?: PageParams) => Promise<void>;
}

export function useMyComments(): UseMyCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMyComments = useCallback(async (params?: PageParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyComments(params);

      if (response.code === 0 && response.data) {
        setComments(adaptComments(response.data.records || []));
        setTotal(response.data.total || 0);
      } else {
        throw new Error(response.msg || response.message || '获取我的评论失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('Failed to fetch my comments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyComments();
  }, [fetchMyComments]);

  return {
    comments,
    loading,
    error,
    total,
    fetchMyComments,
  };
}

/**
 * 分类列表 Hook
 * 封装分类数据获取逻辑
 * 返回前端兼容的 ParentCategory/SubCategory 类型（已做 number→string 转换）
 */
import { useState, useEffect, useCallback } from 'react';
import { getCategories, getHomeCategories } from '@/api/endpoints';
import {
  adaptParentCategories,
  adaptSubCategories,
} from '@/api/adapter';
import type { TocSubCategoryVO } from '@/api/types';
import type { ParentCategory, SubCategory } from '@/@types';

interface UseCategoriesReturn {
  parentCategories: ParentCategory[];
  subCategories: SubCategory[];
  homeCategories: SubCategory[];
  loading: boolean;
  error: Error | null;
  fetchCategories: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [homeCategories, setHomeCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 获取完整分类列表
      const response = await getCategories();

      if (response.code === 0 && response.data) {
        const allCategories = response.data;
        setParentCategories(adaptParentCategories(allCategories));

        // 打平所有子分类
        const allSubCats: TocSubCategoryVO[] = [];
        allCategories.forEach((cat) => {
          if (cat.subCategories && cat.subCategories.length > 0) {
            allSubCats.push(...cat.subCategories);
          }
        });
        setSubCategories(adaptSubCategories(allSubCats));
      } else {
        throw new Error(response.msg || response.message || '获取分类列表失败');
      }

      // 获取首页分类
      const homeResponse = await getHomeCategories();
      if (homeResponse.code === 0 && homeResponse.data) {
        setHomeCategories(adaptSubCategories(homeResponse.data));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    parentCategories,
    subCategories,
    homeCategories,
    loading,
    error,
    fetchCategories,
  };
}

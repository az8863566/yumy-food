/**
 * 分类相关 API
 */
import { api } from '@/api/client';
import type { Result, TocCategoryVO, TocSubCategoryVO } from '@/api/types';

/**
 * 获取完整分类列表（包含父子分类）
 */
export const getCategories = () => {
  return api.get<Result<TocCategoryVO[]>>('/api/toc/v1/categories');
};

/**
 * 获取首页分类（仅子分类）
 */
export const getHomeCategories = () => {
  return api.get<Result<TocSubCategoryVO[]>>('/api/toc/v1/categories/home');
};

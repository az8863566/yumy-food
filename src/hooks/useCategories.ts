/**
 * 分类列表 Hook
 * 基于 TanStack Query 封装分类数据获取和缓存逻辑
 * 返回前端兼容的 ParentCategory/SubCategory 类型（已做 number→string 转换）
 */
import { useQuery } from '@tanstack/react-query';
import { getCategories, getHomeCategories } from '@/api/endpoints';
import { adaptParentCategories, adaptSubCategories } from '@/api/adapter';
import type { TocSubCategoryVO } from '@/api/types';
import type { IParentCategory, ISubCategory } from '@/types';

interface UseCategoriesReturn {
  parentCategories: IParentCategory[];
  subCategories: ISubCategory[];
  homeCategories: ISubCategory[];
  loading: boolean;
  error: Error | null;
}

export function useCategories(): UseCategoriesReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const [response, homeResponse] = await Promise.all([getCategories(), getHomeCategories()]);

      let parentCategories: IParentCategory[] = [];
      let subCategories: ISubCategory[] = [];

      if (response.code === 0 && response.data) {
        parentCategories = adaptParentCategories(response.data);

        const allSubCats: TocSubCategoryVO[] = [];
        response.data.forEach((cat) => {
          if (cat.subCategories && cat.subCategories.length > 0) {
            allSubCats.push(...cat.subCategories);
          }
        });
        subCategories = adaptSubCategories(allSubCats);
      }

      let homeCategories: ISubCategory[] = [];
      if (homeResponse.code === 0 && homeResponse.data) {
        homeCategories = adaptSubCategories(homeResponse.data);
      }

      return { parentCategories, subCategories, homeCategories };
    },
  });

  return {
    parentCategories: data?.parentCategories ?? [],
    subCategories: data?.subCategories ?? [],
    homeCategories: data?.homeCategories ?? [],
    loading: isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
  };
}

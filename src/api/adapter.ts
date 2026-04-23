/**
 * API 数据适配层
 * 将后端 API 返回的数据类型转换为前端组件兼容的类型
 * 核心转换：number id → string id
 */
import type {
  TocRecipeVO,
  TocRecipeDetailVO,
  TocCategoryVO,
  TocSubCategoryVO,
  TocCommentVO,
  TocUserVO,
} from '@/api/types';
import type { IRecipe, ISubCategory, IParentCategory, IComment, IUser } from '@/types';

/**
 * 转换菜谱数据（支持列表项和详情）
 */
export function adaptRecipe(apiRecipe: TocRecipeVO | TocRecipeDetailVO): IRecipe {
  const detail = apiRecipe as TocRecipeDetailVO;
  return {
    id: String(apiRecipe.recipeId),
    title: apiRecipe.title,
    description: apiRecipe.description,
    image: apiRecipe.image,
    categoryId: String(apiRecipe.categoryId),
    likes: apiRecipe.likes,
    difficulty: apiRecipe.difficulty as IRecipe['difficulty'],
    time: apiRecipe.time,
    servings: apiRecipe.servings,
    ingredients: (detail.ingredients || []).map((i) => ({
      name: i.name,
      amount: i.amount,
    })),
    steps: (detail.steps || []).map((s) => ({
      id: s.id,
      description: s.description,
      image: s.image || '',
      ingredientsUsed: s.ingredientsUsed || [],
    })),
  };
}

/**
 * 转换菜谱列表
 */
export function adaptRecipes(apiRecipes: TocRecipeVO[]): IRecipe[] {
  return apiRecipes.map(adaptRecipe);
}

/**
 * 转换子分类数据
 */
export function adaptSubCategory(apiSubCategory: TocSubCategoryVO): ISubCategory {
  return {
    id: String(apiSubCategory.id),
    parentId: String(apiSubCategory.parentId),
    name: apiSubCategory.name,
    image: apiSubCategory.image || '',
  };
}

/**
 * 转换子分类列表
 */
export function adaptSubCategories(apiSubCategories: TocSubCategoryVO[]): ISubCategory[] {
  return apiSubCategories.map(adaptSubCategory);
}

/**
 * 转换父分类数据（从 API 的父分类 VO 中提取）
 */
export function adaptParentCategory(apiCategory: TocCategoryVO): IParentCategory {
  return {
    id: String(apiCategory.id),
    name: apiCategory.name,
  };
}

/**
 * 转换父分类列表
 */
export function adaptParentCategories(apiCategories: TocCategoryVO[]): IParentCategory[] {
  return apiCategories.map(adaptParentCategory);
}

/**
 * 转换评论数据
 */
export function adaptComment(apiComment: TocCommentVO): IComment {
  return {
    id: String(apiComment.commentId),
    recipeId: String(apiComment.recipeId),
    text: apiComment.text,
    images: apiComment.images || [],
    date: apiComment.createTime
      ? apiComment.createTime.split('T')[0]
      : new Date().toISOString().split('T')[0],
    username: apiComment.username,
    avatar: apiComment.avatar,
  };
}

/**
 * 转换评论列表
 */
export function adaptComments(apiComments: TocCommentVO[]): IComment[] {
  return apiComments.map(adaptComment);
}

/**
 * 转换用户数据
 */
export function adaptUser(apiUser: TocUserVO): IUser {
  return {
    id: String(apiUser.userId),
    username: apiUser.username,
    nickname: apiUser.nickname,
    signature: apiUser.signature,
    avatar: apiUser.avatar || '',
  };
}

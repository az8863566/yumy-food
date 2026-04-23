/**
 * 全局类型定义
 * 包含所有业务实体类型、组件 Props 类型、导航类型等
 */

/** 用户类型 */
export interface IUser {
  id: string;
  username: string;
  password?: string;
  avatar: string;
}

/** 食材类型 */
export interface IIngredient {
  name: string;
  amount: string;
}

/** 菜谱步骤类型 */
export interface IRecipeStep {
  id: number;
  description: string;
  image: string;
  ingredientsUsed: string[];
}

/** 评论类型 */
export interface IComment {
  id: string;
  recipeId: string;
  text: string;
  images: string[];
  date: string;
  username?: string;
  avatar?: string;
}

/** 菜谱类型 */
export interface IRecipe {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  likes: number;
  difficulty: '简单' | '中等' | '困难';
  time: string;
  servings: number;
  ingredients: IIngredient[];
  steps: IRecipeStep[];
}

/** 父级分类类型 */
export interface IParentCategory {
  id: string;
  name: string;
}

/** 子级分类类型 */
export interface ISubCategory {
  id: string;
  parentId: string;
  name: string;
  image: string;
}

/** 导航 Tab 类型 */
export type TabType = 'home' | 'categories' | 'profile';

/** 菜谱卡片组件 Props 类型 */
export interface IRecipeCardProps {
  recipe: IRecipe;
  indexRanking?: number;
}

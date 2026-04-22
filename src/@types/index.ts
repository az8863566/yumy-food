/**
 * 全局类型定义
 * 包含所有业务实体类型、组件 Props 类型、导航类型等
 */

/** 用户类型 */
export interface User {
  id: string;
  username: string;
  password?: string;
  avatar: string;
}

/** 食材类型 */
export interface Ingredient {
  name: string;
  amount: string;
}

/** 菜谱步骤类型 */
export interface RecipeStep {
  id: number;
  description: string;
  image: string;
  ingredientsUsed: string[];
}

/** 评论类型 */
export interface Comment {
  id: string;
  recipeId: string;
  text: string;
  images: string[];
  date: string;
  username?: string;
  avatar?: string;
}

/** 菜谱类型 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  likes: number;
  difficulty: '简单' | '中等' | '困难';
  time: string;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

/** 父级分类类型 */
export interface ParentCategory {
  id: string;
  name: string;
}

/** 子级分类类型 */
export interface SubCategory {
  id: string;
  parentId: string;
  name: string;
  image: string;
}

/** 导航 Tab 类型 */
export type TabType = 'home' | 'categories' | 'profile';

/** 菜谱卡片组件 Props 类型 */
export interface RecipeCardProps {
  recipe: Recipe;
  indexRanking?: number;
}

/**
 * API 类型定义
 * 基于 Swagger 文档的接口响应和请求类型
 */

/** 通用响应包装 */
export interface Result<T> {
  code: number;
  message: string;
  msg?: string;
  data: T;
  ok?: boolean;
  fail?: boolean;
}

/** 分页响应 */
export interface IPage<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/** C端用户信息 VO */
export interface TocUserVO {
  userId: number;
  username: string;
  nickname?: string;
  avatar?: string;
}

/** C端用户更新 DTO */
export interface TocUserUpdateDTO {
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

/** C端认证响应 VO */
export interface TocAuthVO {
  token: string;
  user: TocUserVO;
}

/** C端认证登录 DTO */
export interface TocAuthLoginDTO {
  username: string;
  password: string;
}

/** C端认证注册 DTO */
export interface TocAuthRegisterDTO {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
}

/** C端菜谱 VO（列表项） */
export interface TocRecipeVO {
  recipeId: number;
  title: string;
  description: string;
  image: string;
  categoryId: number;
  categoryName?: string;
  likes: number;
  difficulty: '简单' | '中等' | '困难';
  time: string;
  servings: number;
}

/** C端菜谱详情 VO */
export interface TocRecipeDetailVO {
  recipeId: number;
  title: string;
  description: string;
  image: string;
  categoryId: number;
  categoryName?: string;
  likes: number;
  difficulty: string;
  time: string;
  servings: number;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
}

/** 菜谱食材 */
export interface RecipeIngredient {
  name: string;
  amount: string;
}

/** 菜谱步骤 */
export interface RecipeStep {
  id: number;
  description: string;
  image?: string;
  ingredientsUsed?: string[];
}

/** C端评论 VO */
export interface TocCommentVO {
  commentId: number;
  recipeId: number;
  userId: number;
  username?: string;
  avatar?: string;
  text: string;
  images?: string[];
  createTime?: string;
}

/** C端评论创建 DTO */
export interface TocCommentCreateDTO {
  text: string;
  images?: string[];
}

/** C端点赞响应 VO */
export interface TocLikeVO {
  recipeId: number;
  liked: boolean;
  likesCount: number;
}

/** C端收藏响应 VO */
export interface TocFavoriteVO {
  recipeId: number;
  favorited: boolean;
}

/** C端分类 VO（父分类） */
export interface TocCategoryVO {
  id: number;
  name: string;
  parentId?: number;
  image?: string;
  sort?: number;
  subCategories?: TocSubCategoryVO[];
}

/** C端子分类 VO */
export interface TocSubCategoryVO {
  id: number;
  name: string;
  parentId: number;
  image?: string;
}

/** 分页查询参数 */
export interface PageParams {
  pageNum?: number;
  pageSize?: number;
}

/** 菜谱查询参数 */
export interface RecipeQueryParams extends PageParams {
  categoryId?: number;
  keyword?: string;
}

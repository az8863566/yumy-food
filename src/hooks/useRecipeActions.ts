import { useRecipeContext } from '@/store/RecipeContext';
import type { Recipe } from '@/@types';

/**
 * 菜谱操作相关 Hook
 * 封装点赞、收藏、评论等业务逻辑
 */
export function useRecipeActions() {
  const { recipes, likes, favorites, comments, toggleLike, toggleFavorite, addComment } =
    useRecipeContext();

  /**
   * 获取指定菜谱的评论数量
   */
  const getCommentCount = (recipeId: string): number => {
    return comments.filter((c) => c.recipeId === recipeId).length;
  };

  /**
   * 检查菜谱是否已点赞
   */
  const isLiked = (recipeId: string): boolean => {
    return likes.includes(recipeId);
  };

  /**
   * 检查菜谱是否已收藏
   */
  const isFavorited = (recipeId: string): boolean => {
    return favorites.includes(recipeId);
  };

  /**
   * 处理点赞操作
   */
  const handleToggleLike = (recipeId: string) => {
    toggleLike(recipeId);
  };

  /**
   * 处理收藏操作
   */
  const handleToggleFavorite = (recipeId: string) => {
    toggleFavorite(recipeId);
  };

  /**
   * 添加评论
   */
  const handleAddComment = (recipeId: string, text: string, images: string[]) => {
    addComment(recipeId, text, images);
  };

  /**
   * 获取菜谱详情
   */
  const getRecipeById = (recipeId: string | null): Recipe | undefined => {
    if (!recipeId) return undefined;
    return recipes.find((r) => r.id === recipeId);
  };

  return {
    recipes,
    likes,
    favorites,
    comments,
    getCommentCount,
    isLiked,
    isFavorited,
    handleToggleLike,
    handleToggleFavorite,
    handleAddComment,
    getRecipeById,
  };
}

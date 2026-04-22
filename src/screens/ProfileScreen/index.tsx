import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/store/AuthContext';
import { useRecipeContext } from '@/store/RecipeContext';
import { useNavigationContext } from '@/store/NavigationContext';
import { useUserInteraction, useMyComments } from '@/hooks';
import { RecipeCard } from '@components/RecipeCard';
import { COLORS, SPACING, SIZES, FONT_SIZES, LINE_HEIGHTS } from '@/constants';

type ProfileTab = 'favorites' | 'comments';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_INDICATOR_WIDTH = 80;

export function ProfileScreen() {
  const { currentUser, logout, setShowAuthModal } = useAuthContext();
  const { recipes } = useRecipeContext();
  const { myFavorites, loading: favoritesLoading } = useUserInteraction();
  const { comments: myComments, loading: commentsLoading } = useMyComments();
  const { setActiveRecipeId } = useNavigationContext();
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');

  const loading = favoritesLoading || commentsLoading;

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authIconWrapper}>
            <Ionicons name="person-outline" size={SIZES.iconLarge} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.authTitle}>未登录</Text>
          <Text style={styles.authSubtitle}>登录后即可查看收藏列表与美味评价记录</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => setShowAuthModal(true)}>
            <Text style={styles.loginBtnText}>立即登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const savedRecipes = myFavorites;
  const userComments = myComments;

  const tabIndicatorLeft =
    activeTab === 'favorites'
      ? SCREEN_WIDTH / 4 - TAB_INDICATOR_WIDTH / 2
      : (SCREEN_WIDTH * 3) / 4 - TAB_INDICATOR_WIDTH / 2;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* 右上角退出登录按钮 */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutBtnText}>退出登录</Text>
      </TouchableOpacity>

      {/* 个人信息头部 */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{currentUser.username}</Text>
          <Text style={styles.profileSubtitle}>发现属于你的味蕾惊喜</Text>
        </View>
      </View>

      {/* Tab 切换栏 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('favorites')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
            我的收藏 ({savedRecipes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('comments')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'comments' && styles.tabTextActive]}>
            我的评价 ({userComments.length})
          </Text>
        </TouchableOpacity>

        {/* 滑动指示条 */}
        <View style={[styles.tabIndicator, { left: tabIndicatorLeft }]} />
      </View>

      {/* Tab 内容区 */}
      <View style={styles.tabContent}>
        {activeTab === 'favorites' && (
          <>
            {savedRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
            {savedRecipes.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>还没有收藏任何菜谱</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'comments' && (
          <>
            {userComments.map((c) => {
              const recipe = recipes.find((r) => r.id === c.recipeId);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={styles.commentCard}
                  onPress={() => {
                    if (recipe) setActiveRecipeId(recipe.id);
                  }}
                  activeOpacity={0.7}
                >
                  {/* 评论关联的菜谱信息 */}
                  <View style={styles.commentRecipeRow}>
                    <View style={styles.commentRecipeThumb}>
                      <Image
                        source={{ uri: recipe?.image ?? '' }}
                        style={styles.commentRecipeImage}
                      />
                    </View>
                    <Text style={styles.commentRecipeTitle} numberOfLines={1}>
                      {recipe?.title ?? '已删除食谱'}
                    </Text>
                  </View>

                  {/* 评论内容 */}
                  <Text style={styles.commentText}>{c.text}</Text>

                  {/* 评论图片 */}
                  {c.images.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.commentImageScroll}
                    >
                      {c.images.map((img) => (
                        <Image key={img} source={{ uri: img }} style={styles.commentImage} />
                      ))}
                    </ScrollView>
                  )}

                  {/* 评论日期 */}
                  <Text style={styles.commentDate}>{c.date}</Text>
                </TouchableOpacity>
              );
            })}
            {userComments.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>还没有评价过任何菜谱</Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // 未登录状态
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  authTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  authSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxxl,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.borderRadiusXLarge,
  },
  loginBtnText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  // 退出登录按钮
  logoutBtn: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.borderRadiusXLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 10,
  },
  logoutBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  // 个人信息头部
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl + SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatar: {
    width: SIZES.avatar,
    height: SIZES.avatar,
    borderRadius: SIZES.avatar / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
    marginRight: SPACING.lg,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  profileSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  // Tab 切换栏
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: TAB_INDICATOR_WIDTH,
    height: 2,
    backgroundColor: COLORS.primary,
  },
  // Tab 内容区
  tabContent: {
    padding: SPACING.lg,
  },
  // 评论卡片
  commentCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: SIZES.borderRadiusLarge,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },
  commentRecipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  commentRecipeThumb: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadiusSmall,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  commentRecipeImage: {
    width: '100%',
    height: '100%',
  },
  commentRecipeTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  commentText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    opacity: 0.9,
    lineHeight: LINE_HEIGHTS.md,
  },
  commentImageScroll: {
    marginTop: SPACING.md,
  },
  commentImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.sm,
  },
  // 空状态
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

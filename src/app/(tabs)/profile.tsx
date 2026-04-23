import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/useAuthStore';
import { useRecipeContext } from '@/store/RecipeContext';
import { useUserInteraction, useMyComments } from '@/hooks';
import { AuthPrompt } from '@/components/business/AuthPrompt';
import { ProfileTabBar } from '@/components/business/ProfileTabBar';
import { CommentCard } from '@/components/business/CommentCard';
import { RecipeCard } from '@components/RecipeCard';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { IRecipe, IComment } from '@/types';

type ProfileTab = 'favorites' | 'comments';

const FavoriteItem: ListRenderItem<IRecipe> = ({ item }) => (
  <View className="px-4">
    <RecipeCard recipe={item} />
  </View>
);

function ProfileCommentItem({ item }: { item: IComment }) {
  const { recipes } = useRecipeContext();
  const recipe = recipes.find((r) => r.id === item.recipeId);
  return (
    <View className="px-4">
      <CommentCard comment={item} recipe={recipe} />
    </View>
  );
}

const CommentItem: ListRenderItem<IComment> = ({ item }) => <ProfileCommentItem item={item} />;

const EmptyFavoritesList = () => (
  <View className="items-center py-16 px-4">
    <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>还没有收藏任何菜谱</Text>
  </View>
);

const EmptyCommentsList = () => (
  <View className="items-center py-16 px-4">
    <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
      还没有评价过任何菜谱
    </Text>
  </View>
);

export default function ProfileScreen() {
  const { currentUser, logout, setShowAuthModal } = useAuthStore();
  const { myFavorites } = useUserInteraction();
  const { comments: myComments } = useMyComments();
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');

  const listHeader = useMemo(() => {
    if (!currentUser) return null;
    return (
      <>
        {/* 退出登录按钮 */}
        <TouchableOpacity
          className="absolute z-10 px-4 py-1"
          style={{
            top: SPACING.xl,
            right: SPACING.lg,
            borderRadius: SIZES.borderRadiusXLarge,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
          onPress={logout}
        >
          <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>退出登录</Text>
        </TouchableOpacity>

        {/* 个人信息头部 */}
        <View
          className="flex-row items-center"
          style={{
            backgroundColor: COLORS.surface,
            paddingHorizontal: SPACING.xl,
            paddingTop: SPACING.xxxl + SPACING.xl,
            paddingBottom: SPACING.xxl,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.borderLight,
          }}
        >
          <Image
            source={{ uri: currentUser.avatar }}
            className="mr-4"
            style={{
              width: SIZES.avatar,
              height: SIZES.avatar,
              borderRadius: SIZES.avatar / 2,
              borderWidth: 1,
              borderColor: 'rgba(255,107,107,0.2)',
            }}
            contentFit="cover"
            transition={200}
          />
          <View className="flex-1">
            <Text
              className="font-bold mb-1"
              style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
            >
              {currentUser.username}
            </Text>
            <Text
              style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '300' }}
            >
              发现属于你的味蕾惊喜
            </Text>
          </View>
        </View>

        <ProfileTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          favoritesCount={myFavorites.length}
          commentsCount={myComments.length}
        />
      </>
    );
  }, [currentUser, logout, activeTab, myFavorites.length, myComments.length]);

  if (!currentUser) {
    return <AuthPrompt onLogin={() => setShowAuthModal(true)} />;
  }

  if (activeTab === 'favorites') {
    return (
      <FlashList
        data={myFavorites}
        renderItem={FavoriteItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={200}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={EmptyFavoritesList}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }

  return (
    <FlashList
      data={myComments}
      renderItem={CommentItem}
      keyExtractor={(item) => item.id}
      estimatedItemSize={180}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={EmptyCommentsList}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

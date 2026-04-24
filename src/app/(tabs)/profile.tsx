import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
  <View style={{ paddingHorizontal: 16 }}>
    <RecipeCard recipe={item} />
  </View>
);

function ProfileCommentItem({ item }: { item: IComment }) {
  const { recipes } = useRecipeContext();
  const recipe = recipes.find((r) => r.id === item.recipeId);
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <CommentCard comment={item} recipe={recipe} />
    </View>
  );
}

const CommentItem: ListRenderItem<IComment> = ({ item }) => <ProfileCommentItem item={item} />;

const EmptyFavoritesList = () => (
  <View style={{ alignItems: 'center', paddingVertical: 64, paddingHorizontal: 16 }}>
    <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>还没有收藏任何菜谱</Text>
  </View>
);

const EmptyCommentsList = () => (
  <View style={{ alignItems: 'center', paddingVertical: 64, paddingHorizontal: 16 }}>
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
        {/* 顶部操作按钮 */}
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            flexDirection: 'row',
            top: SPACING.xl,
            right: SPACING.lg,
            gap: SPACING.sm,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={COLORS.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>编辑资料</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}
            onPress={logout}
          >
            <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>退出登录</Text>
          </TouchableOpacity>
        </View>

        {/* 个人信息头部 */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            paddingHorizontal: SPACING.xl,
            paddingTop: SPACING.xxxl + SPACING.xl,
            paddingBottom: SPACING.xxl,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <View
            style={{
              padding: 4,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: (SIZES.avatar + 8) / 2,
              borderWidth: 1,
              borderColor: 'rgba(197,160,89,0.2)',
              marginRight: SPACING.lg,
            }}
          >
            <Image
              source={{ uri: currentUser.avatar }}
              style={{
                width: SIZES.avatar,
                height: SIZES.avatar,
                borderRadius: SIZES.avatar / 2,
              }}
              contentFit="cover"
              transition={200}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 4,
                fontSize: FONT_SIZES.xxxl,
                color: COLORS.textPrimary,
              }}
            >
              {currentUser.username}
            </Text>
            <Text
              style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '300' }}
            >
              {currentUser?.phone ? `手机: ${currentUser.phone}` : '发现属于你的味蕾惊喜'}
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
        style={{ backgroundColor: COLORS.background }}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
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
      style={{ backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
    />
  );
}

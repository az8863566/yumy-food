import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useSearchRecipes, useCategories } from '@/hooks';
import { RecipeCard } from '@components/RecipeCard';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { ISubCategory } from '@/types';

/** 菜谱卡片骨架屏 */
function RecipeCardSkeleton() {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View style={{ width: 120, height: 100, backgroundColor: COLORS.border }} />
      <View style={{ flex: 1, padding: 16, justifyContent: 'center', gap: SPACING.sm }}>
        <View
          style={{ height: 16, width: '60%', borderRadius: 4, backgroundColor: COLORS.border }}
        />
        <View
          style={{ height: 12, width: '80%', borderRadius: 4, backgroundColor: COLORS.border }}
        />
        <View
          style={{ height: 12, width: '40%', borderRadius: 4, backgroundColor: COLORS.border }}
        />
      </View>
    </View>
  );
}

/** 快捷分类项组件（带按下高亮效果） */
function QuickCategoryItem({ cat, onPress }: { cat: ISubCategory; onPress: () => void }) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <TouchableOpacity
      style={{ width: '25%', alignItems: 'center', marginBottom: 16 }}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.8}
    >
      <View
        style={[
          {
            width: 56,
            height: 56,
            borderRadius: 28,
            overflow: 'hidden',
            marginBottom: 4,
            borderWidth: 1,
            borderColor: COLORS.border,
          },
          pressed && { borderColor: COLORS.primary, borderWidth: 2 },
        ]}
      >
        <Image
          source={{ uri: cat.image || 'https://picsum.photos/200' }}
          style={{ width: '100%', height: '100%', opacity: pressed ? 1 : 0.7 }}
          contentFit="cover"
          transition={200}
        />
      </View>
      <Text
        style={[
          { color: COLORS.textSecondary, fontSize: 12 },
          pressed && { color: COLORS.primary, fontWeight: '500' },
        ]}
      >
        {cat.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { searchQuery, setSearchQuery, setActiveMinorCategoryId } = useNavigationContext();
  const {
    topRanked,
    recommended,
    searchResults,
    isSearching,
    loading: searchLoading,
    loadingSearch,
  } = useSearchRecipes();
  const { homeCategories, loading: categoriesLoading } = useCategories();
  const [searchFocused, setSearchFocused] = React.useState(false);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
    >
      {/* 标题与搜索框 */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: FONT_SIZES.title, color: COLORS.textPrimary, fontWeight: 'bold' }}>
          甄味{' '}
          <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary, fontWeight: '300' }}>
            FlavorGuide
          </Text>
        </Text>
      </View>

      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingHorizontal: 16,
            marginBottom: 24,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          },
          searchFocused && { borderColor: COLORS.primary },
        ]}
      >
        <Ionicons
          name="search"
          size={SIZES.iconMedium}
          color={searchFocused ? COLORS.primary : COLORS.textSecondary}
          style={{ marginRight: SPACING.sm }}
        />
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 12,
            color: COLORS.textPrimary,
            fontSize: FONT_SIZES.md,
          }}
          placeholder="搜索食谱或食材..."
          placeholderTextColor="#A0A4AB"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {loadingSearch && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginLeft: SPACING.sm }}
          />
        )}
      </View>

      {isSearching ? (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: 16,
              fontSize: FONT_SIZES.xxl,
              color: COLORS.textPrimary,
            }}
          >
            搜索结果
          </Text>
          {loadingSearch ? (
            <View style={{ gap: SPACING.lg }}>
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </View>
          ) : searchResults.length > 0 ? (
            searchResults.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.textSecondary,
                fontSize: FONT_SIZES.md,
                marginVertical: SPACING.xl,
              }}
            >
              未找到相关食谱
            </Text>
          )}
        </View>
      ) : (
        <>
          {/* 今日美食推荐 Banner */}
          <View
            style={{
              position: 'relative',
              height: 192,
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 24,
              backgroundColor: COLORS.surface,
            }}
          >
            <Image
              source={{ uri: 'https://picsum.photos/seed/featuredFood/800/600' }}
              style={{ width: '100%', height: '100%', opacity: 0.6 }}
              contentFit="cover"
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 20,
                backgroundColor: 'transparent',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 4,
                  fontSize: FONT_SIZES.xxxl,
                  color: '#ffffff',
                }}
              >
                今日美食推荐
              </Text>
              <Text style={{ fontSize: FONT_SIZES.md, color: '#ffffff', opacity: 0.6 }}>
                探索春季时令鲜美，为生活加点料
              </Text>
            </View>
          </View>

          {/* 快捷分类入口 - 4列2行 */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              marginBottom: 24,
            }}
          >
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <View key={i} style={{ width: '25%', alignItems: 'center', marginBottom: 16 }}>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        marginBottom: 4,
                        backgroundColor: COLORS.border,
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: COLORS.border,
                      }}
                    />
                  </View>
                ))
              : homeCategories.slice(0, 8).map((cat) => (
                  <QuickCategoryItem
                    key={cat.id}
                    cat={cat}
                    onPress={() => {
                      setActiveMinorCategoryId(String(cat.id));
                      router.push('/(tabs)/categories');
                    }}
                  />
                ))}
          </View>

          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                gap: SPACING.sm,
              }}
            >
              <Ionicons name="flame" size={SIZES.iconMedium} color={COLORS.primary} />
              <Text
                style={{ fontWeight: 'bold', fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
              >
                人气排行榜
              </Text>
            </View>
            {searchLoading || topRanked.length === 0 ? (
              <View style={{ gap: SPACING.lg }}>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </View>
            ) : (
              topRanked.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} indexRanking={index + 1} />
              ))
            )}
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 16,
                fontSize: FONT_SIZES.xxl,
                color: COLORS.textPrimary,
              }}
            >
              猜你喜欢
            </Text>
            {searchLoading || recommended.length === 0 ? (
              <View style={{ gap: SPACING.lg }}>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </View>
            ) : (
              recommended.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

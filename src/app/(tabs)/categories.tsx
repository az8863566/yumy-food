import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useCategories, useCategoryRecipes } from '@/hooks';
import { CategorySidebar } from '@/components/business/CategorySidebar';
import { SubCategoryDetail } from '@/components/business/SubCategoryDetail';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { ISubCategory } from '@/types';

function MinorCategoryCard({ minor, onPress }: { minor: ISubCategory; onPress: () => void }) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <TouchableOpacity
      style={[
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 12,
          width: '47%',
          height: 112,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.05)',
          backgroundColor: COLORS.surface,
        },
        pressed && { borderColor: 'rgba(200,169,110,0.5)' },
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: minor.image || 'https://picsum.photos/200' }}
        style={{ width: '100%', height: '100%', opacity: pressed ? 0.9 : 0.6 }}
        contentFit="cover"
        transition={200}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: pressed ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: FONT_SIZES.md,
            fontWeight: 'bold',
            letterSpacing: 1,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {minor.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CategoryScreen() {
  const { activeMinorCategoryId, setActiveMinorCategoryId } = useNavigationContext();
  const {
    parentCategories,
    subCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    recipes: categoryRecipes,
    loading: categoryRecipesLoading,
    error: categoryRecipesError,
  } = useCategoryRecipes(activeMinorCategoryId);
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [localSearch, setLocalSearch] = useState('');

  // 当 parentCategories 加载完成后，自动选中第一个父分类
  useEffect(() => {
    if (parentCategories.length > 0 && !selectedParent) {
      setSelectedParent(parentCategories[0].id);
    }
  }, [parentCategories, selectedParent]);

  if (categoriesLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (categoriesError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <Ionicons name="warning-outline" size={SIZES.iconLarge} color={COLORS.textSecondary} />
        <Text
          style={{
            textAlign: 'center',
            color: COLORS.textSecondary,
            fontSize: FONT_SIZES.md,
          }}
        >
          分类加载失败
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 4,
            color: COLORS.textSecondary,
            fontSize: FONT_SIZES.sm,
          }}
        >
          {categoriesError.message}
        </Text>
      </View>
    );
  }

  // 子分类详情视图
  if (activeMinorCategoryId) {
    const cat = subCategories.find((c) => c.id === activeMinorCategoryId);
    return (
      <SubCategoryDetail
        cat={cat}
        recipes={categoryRecipes}
        loading={categoryRecipesLoading}
        error={categoryRecipesError}
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onBack={() => setActiveMinorCategoryId(null)}
      />
    );
  }

  // 左右结构主分类视图
  const activeMinors = subCategories.filter((sub) => sub.parentId === selectedParent);

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: COLORS.background }}>
      <CategorySidebar
        parentCategories={parentCategories}
        selectedParent={selectedParent}
        onSelectParent={setSelectedParent}
      />

      {/* 右侧子分类内容区 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontWeight: 'bold',
            marginBottom: 20,
            paddingBottom: 12,
            fontSize: FONT_SIZES.xxl,
            color: COLORS.textPrimary,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.05)',
          }}
        >
          {parentCategories.find((c) => c.id === selectedParent)?.name}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
          {activeMinors.map((minor) => (
            <MinorCategoryCard
              key={minor.id}
              minor={minor}
              onPress={() => setActiveMinorCategoryId(minor.id)}
            />
          ))}
        </View>
        {activeMinors.length === 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
            <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.md }}>
              该分类下暂无子选项
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

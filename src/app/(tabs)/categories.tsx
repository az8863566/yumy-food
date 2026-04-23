import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useCategories, useCategoryRecipes } from '@/hooks';
import { CategorySidebar } from '@/components/business/CategorySidebar';
import { SubCategoryDetail } from '@/components/business/SubCategoryDetail';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

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
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (categoriesError) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <Ionicons name="warning-outline" size={SIZES.iconLarge} color={COLORS.textSecondary} />
        <Text
          className="text-center"
          style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.md }}
        >
          分类加载失败
        </Text>
        <Text
          className="text-center mt-1"
          style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}
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
    <View className="flex-1 flex-row" style={{ backgroundColor: COLORS.background }}>
      <CategorySidebar
        parentCategories={parentCategories}
        selectedParent={selectedParent}
        onSelectParent={setSelectedParent}
      />

      {/* 右侧子分类内容区 */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="font-bold mb-4 pb-3"
          style={{
            fontSize: FONT_SIZES.xxl,
            color: COLORS.textPrimary,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.borderLight,
          }}
        >
          {parentCategories.find((c) => c.id === selectedParent)?.name}
        </Text>
        <View className="flex-row flex-wrap" style={{ gap: SPACING.md }}>
          {activeMinors.map((minor) => (
            <TouchableOpacity
              key={minor.id}
              className="relative overflow-hidden rounded-xl"
              style={{
                width: '47%',
                height: 112,
                borderWidth: 1,
                borderColor: COLORS.borderLight,
              }}
              onPress={() => setActiveMinorCategoryId(minor.id)}
            >
              <Image
                source={{ uri: minor.image }}
                className="w-full h-full"
                contentFit="cover"
                transition={200}
              />
              <View
                className="absolute inset-0 justify-center items-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
              >
                <Text className="font-bold" style={{ color: '#ffffff', fontSize: FONT_SIZES.md }}>
                  {minor.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {activeMinors.length === 0 && (
          <View className="items-center justify-center py-16">
            <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.md }}>
              该分类下暂无子选项
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

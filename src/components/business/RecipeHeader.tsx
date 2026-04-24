import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/constants';
import type { IRecipe } from '@/types';

interface RecipeHeaderProps {
  recipe: IRecipe;
  liked: boolean;
  favorited: boolean;
  commentCount: number;
  onToggleLike: () => void;
  onToggleFavorite: () => void;
}

const NavButton = ({ onPress, icon, color }: { onPress: () => void; icon: any; color: string }) => (
  <TouchableOpacity
    className="w-9 h-9 rounded-lg border justify-center items-center"
    style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}
    onPress={onPress}
    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
  >
    <Ionicons name={icon} size={20} color={color} />
  </TouchableOpacity>
);

export function RecipeHeader({
  recipe,
  liked,
  favorited,
  commentCount,
  onToggleLike,
  onToggleFavorite,
}: RecipeHeaderProps) {
  const { top: safeTop } = useSafeAreaInsets();

  return (
    <View className="w-full relative overflow-hidden" style={{ height: SIZES.detailImageHeight }}>
      {/* 图片层（用 View 包裹实现绝对定位） */}
      <View className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <Image
          source={{ uri: recipe.image }}
          style={{ width: '100%', height: '100%', opacity: 0.7 }}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* 底部渐变层（用 View 控制绝对定位，LinearGradient 只负责变色） */}
      <View className="absolute bottom-0 left-0 right-0 h-[200px] z-10">
        <LinearGradient colors={['transparent', COLORS.background]} style={{ flex: 1 }} />
      </View>

      {/* 顶部渐变层 */}
      <View className="absolute top-0 left-0 right-0 z-10" style={{ height: safeTop + 80 }}>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'transparent']} style={{ flex: 1 }} />
      </View>

      {/* 顶部导航栏 */}
      <View
        className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 z-30"
        style={{ paddingTop: safeTop + 16 }}
      >
        <NavButton onPress={() => router.back()} icon="chevron-back" color="#ffffff" />

        <View className="flex-row gap-3">
          <NavButton
            onPress={onToggleLike}
            icon={liked ? 'heart' : 'heart-outline'}
            color={liked ? COLORS.primary : '#ffffff'}
          />
          <NavButton
            onPress={onToggleFavorite}
            icon={favorited ? 'bookmark' : 'bookmark-outline'}
            color={favorited ? COLORS.primary : '#ffffff'}
          />
        </View>
      </View>

      {/* 内容区：绝对定位贴合图片底部 */}
      <View className="absolute bottom-0 left-0 right-0 px-4 z-30" style={{ paddingBottom: 24 }}>
        <Text
          className="font-bold mb-2 text-[28px] leading-8"
          style={{ color: COLORS.textPrimary }}
        >
          {recipe.title}
        </Text>

        <Text className="mb-4 text-sm opacity-80 leading-6" style={{ color: COLORS.textSecondary }}>
          {recipe.description}
        </Text>

        <View className="flex-row gap-5 mb-4">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="heart" size={14} color={COLORS.primary} />
            <Text className="text-xs" style={{ color: COLORS.textSecondary }}>
              {recipe.likes} 人点赞
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="chatbubble-outline" size={14} color={COLORS.textSecondary} />
            <Text className="text-xs" style={{ color: COLORS.textSecondary }}>
              {commentCount} 条评价
            </Text>
          </View>
        </View>

        {/* 信息卡片：难度 / 耗时 / 人数 */}
        <View
          className="flex-row items-center py-5 px-2 rounded-xl border-y border-x"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <View className="flex-col items-center gap-1 w-1/3">
            <Text className="text-xs tracking-widest" style={{ color: COLORS.textSecondary }}>
              难度
            </Text>
            <Text className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
              {recipe.difficulty}
            </Text>
          </View>

          <View
            className="flex-col items-center gap-1 w-1/3 border-x"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <Text className="text-xs tracking-widest" style={{ color: COLORS.textSecondary }}>
              耗时
            </Text>
            <Text className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
              {recipe.time}
            </Text>
          </View>

          <View className="flex-col items-center gap-1 w-1/3">
            <Text className="text-xs tracking-widest" style={{ color: COLORS.textSecondary }}>
              人数
            </Text>
            <Text className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
              {recipe.servings} 人份
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

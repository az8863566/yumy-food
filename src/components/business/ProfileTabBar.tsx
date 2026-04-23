import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES } from '@/constants';

type ProfileTab = 'favorites' | 'comments';

interface ProfileTabBarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  favoritesCount: number;
  commentsCount: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_INDICATOR_WIDTH = 80;

export function ProfileTabBar({
  activeTab,
  onTabChange,
  favoritesCount,
  commentsCount,
}: ProfileTabBarProps) {
  const tabIndicatorLeft =
    activeTab === 'favorites'
      ? SCREEN_WIDTH / 4 - TAB_INDICATOR_WIDTH / 2
      : (SCREEN_WIDTH * 3) / 4 - TAB_INDICATOR_WIDTH / 2;

  return (
    <View
      className="flex-row relative mt-1"
      style={{
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
      }}
    >
      <TouchableOpacity
        className="flex-1 py-4 items-center"
        onPress={() => onTabChange('favorites')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
            activeTab === 'favorites' && {
              color: COLORS.primary,
              fontWeight: '600',
              letterSpacing: 1,
            },
          ]}
        >
          我的收藏 ({favoritesCount})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 py-4 items-center"
        onPress={() => onTabChange('comments')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
            activeTab === 'comments' && {
              color: COLORS.primary,
              fontWeight: '600',
              letterSpacing: 1,
            },
          ]}
        >
          我的评价 ({commentsCount})
        </Text>
      </TouchableOpacity>

      <View
        className="absolute bottom-0 h-0.5"
        style={{
          left: tabIndicatorLeft,
          width: TAB_INDICATOR_WIDTH,
          backgroundColor: COLORS.primary,
        }}
      />
    </View>
  );
}

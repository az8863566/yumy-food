import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { COLORS, SIZES, FONT_SIZES, LINE_HEIGHTS } from '@/constants';
import type { IComment, IRecipe } from '@/types';

interface CommentCardProps {
  comment: IComment;
  recipe?: IRecipe;
}

export function CommentCard({ comment, recipe }: CommentCardProps) {
  return (
    <TouchableOpacity
      className="p-4 rounded-2xl mb-4"
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
      }}
      onPress={() => {
        if (recipe) router.push(`/recipe/${recipe.id}`);
      }}
      activeOpacity={0.7}
    >
      {/* 评论关联的菜谱信息 */}
      <View
        className="flex-row items-center pb-3 mb-3"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: COLORS.borderLight,
        }}
      >
        <View
          className="overflow-hidden mr-3"
          style={{
            width: 40,
            height: 40,
            borderRadius: SIZES.borderRadiusSmall,
          }}
        >
          <Image
            source={{ uri: recipe?.image ?? '' }}
            className="w-full h-full"
            contentFit="cover"
            transition={200}
          />
        </View>
        <Text
          className="flex-1 font-semibold"
          style={{ fontSize: FONT_SIZES.md, color: COLORS.textPrimary }}
          numberOfLines={1}
        >
          {recipe?.title ?? '已删除食谱'}
        </Text>
      </View>

      {/* 评论内容 */}
      <Text
        style={{
          fontSize: FONT_SIZES.md,
          color: COLORS.textPrimary,
          opacity: 0.9,
          lineHeight: LINE_HEIGHTS.md,
        }}
      >
        {comment.text}
      </Text>

      {/* 评论图片 */}
      {comment.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {comment.images.map((img) => (
            <Image
              key={img}
              source={{ uri: img }}
              className="w-20 h-20 rounded-xl mr-2"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
              contentFit="cover"
              transition={200}
            />
          ))}
        </ScrollView>
      )}

      {/* 评论日期 */}
      <Text
        className="text-right mt-2"
        style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}
      >
        {comment.date}
      </Text>
    </TouchableOpacity>
  );
}

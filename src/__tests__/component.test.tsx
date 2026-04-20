/**
 * React Native 组件测试示例
 * 展示如何使用 @testing-library/react-native 测试组件
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TouchableOpacity, Text, View } from 'react-native';

// 简单的测试组件
const SimpleButton = ({ onPress, title }: { onPress: () => void; title: string }) => (
  <TouchableOpacity onPress={onPress} testID="simple-button">
    <View>
      <Text>{title}</Text>
    </View>
  </TouchableOpacity>
);

describe('SimpleButton 组件', () => {
  test('应该正确渲染按钮文本', () => {
    const { getByText } = render(<SimpleButton onPress={() => {}} title="点击我" />);

    expect(getByText('点击我')).toBeTruthy();
  });

  test('点击时应该触发 onPress 回调', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<SimpleButton onPress={mockOnPress} title="点击我" />);

    fireEvent.press(getByTestId('simple-button'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('应该使用 testID 查找元素', () => {
    const { getByTestId } = render(<SimpleButton onPress={() => {}} title="测试" />);

    const button = getByTestId('simple-button');
    expect(button).toBeTruthy();
  });
});

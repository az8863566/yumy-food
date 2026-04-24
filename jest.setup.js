/**
 * Jest 设置文件
 * 用于处理 Expo 和 React Native 的测试环境兼容性
 */

// Mock import.meta（Expo 需要）
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {
    meta: {
      url: 'http://localhost',
    },
  };
}

// Mock Expo modules
jest.mock('expo', () => ({
  default: {},
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: require('react-native').Image,
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Link: require('react-native').View,
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => '/'),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: require('react-native').View,
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

// Mock @shopify/flash-list
jest.mock('@shopify/flash-list', () => ({
  FlashList: require('react-native').FlatList,
  ListRenderItem: jest.fn(),
}));

// 设置测试超时时间
jest.setTimeout(10000);

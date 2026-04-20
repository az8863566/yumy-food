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

// 设置测试超时时间
jest.setTimeout(10000);

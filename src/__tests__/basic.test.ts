/**
 * 示例测试文件 - 验证 Jest 配置是否正常
 */

describe('基础测试示例', () => {
  test('1 + 1 应该等于 2', () => {
    expect(1 + 1).toBe(2);
  });

  test('数组应该包含正确的元素', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  test('对象应该有正确的属性', () => {
    const obj = { name: 'Yumy-Food', version: '1.0.0' };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('Yumy-Food');
  });

  test('异步函数应该正确工作', async () => {
    const fetchData = () => Promise.resolve('success');
    const result = await fetchData();
    expect(result).toBe('success');
  });
});

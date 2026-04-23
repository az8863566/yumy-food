import { IParentCategory, ISubCategory, IRecipe, IComment } from '@/types';

export const parentCategories: IParentCategory[] = [
  { id: 'p1', name: '热门分类' },
  { id: 'p2', name: '菜系' },
  { id: 'p3', name: '烘焙甜品' },
];

export const subCategories: ISubCategory[] = [
  // p1 热门分类
  { id: 'c1', parentId: 'p1', name: '家常菜', image: 'https://picsum.photos/seed/c1/200' },
  { id: 'c2', parentId: 'p1', name: '下饭菜', image: 'https://picsum.photos/seed/c2/200' },
  { id: 'c3', parentId: 'p1', name: '蔬菜', image: 'https://picsum.photos/seed/c3/200' },
  { id: 'c4', parentId: 'p1', name: '肉类', image: 'https://picsum.photos/seed/c4/200' },
  { id: 'c5', parentId: 'p1', name: '减脂餐', image: 'https://picsum.photos/seed/c5/200' },
  // p2 菜系
  { id: 'c6', parentId: 'p2', name: '川菜', image: 'https://picsum.photos/seed/c6/200' },
  { id: 'c7', parentId: 'p2', name: '粤菜', image: 'https://picsum.photos/seed/c7/200' },
  { id: 'c8', parentId: 'p2', name: '西式简餐', image: 'https://picsum.photos/seed/c8/200' },
  // p3 甜点
  { id: 'c9', parentId: 'p3', name: '蛋糕', image: 'https://picsum.photos/seed/c9/200' },
  { id: 'c10', parentId: 'p3', name: '饮品', image: 'https://picsum.photos/seed/c10/200' },
];

export const initialComments: IComment[] = [
  {
    id: 'cmt1',
    recipeId: 'r1',
    text: '这红烧肉绝了，颜色太好看了！尝试着做了一次，全家人都夸好吃。特别推荐用冰糖，提亮效果非常棒。',
    images: ['https://picsum.photos/seed/cmtimg1/400', 'https://picsum.photos/seed/cmtimg2/400'],
    date: '2026-04-18',
  },
];

export const initialRecipes: IRecipe[] = [
  {
    id: 'r1',
    title: '秘制红烧肉',
    description: '肥而不腻，入口即化。经典的家常美味，每一口都是满足感。这道菜是传承多年的老味道。',
    image: 'https://picsum.photos/seed/pork/800/600',
    categoryId: 'c1',
    likes: 1254,
    difficulty: '中等',
    time: '60分钟',
    servings: 4,
    ingredients: [
      { name: '五花肉', amount: '500g' },
      { name: '冰糖', amount: '30g' },
      { name: '八角', amount: '2个' },
      { name: '生抽', amount: '2大勺' },
      { name: '老抽', amount: '1大勺' },
    ],
    steps: [
      {
        id: 1,
        description: '五花肉切块，冷水下锅焯水后捞出冲洗干净。',
        image: 'https://picsum.photos/seed/pork1/400/300',
        ingredientsUsed: ['五花肉'],
      },
      {
        id: 2,
        description: '锅中放少许油，下五花肉煸炒出油脂，盛出备用。',
        image: 'https://picsum.photos/seed/pork2/400/300',
        ingredientsUsed: ['五花肉'],
      },
      {
        id: 3,
        description: '底油放入冰糖炒出糖色，倒入五花肉翻炒均匀上色。',
        image: 'https://picsum.photos/seed/pork3/400/300',
        ingredientsUsed: ['冰糖'],
      },
      {
        id: 4,
        description: '加入生抽、老抽、八角以及漫过肉的开水，小火炖煮50分钟后大火收汁。',
        image: 'https://picsum.photos/seed/pork4/400/300',
        ingredientsUsed: ['八角', '生抽', '老抽'],
      },
    ],
  },
  {
    id: 'r2',
    title: '轻食鸡胸肉沙拉',
    description: '低卡高蛋白，清爽解腻。适合减脂期食用，饱腹感强且营养均衡。',
    image: 'https://picsum.photos/seed/salad/800/600',
    categoryId: 'c5',
    likes: 890,
    difficulty: '简单',
    time: '15分钟',
    servings: 1,
    ingredients: [
      { name: '鸡胸肉', amount: '150g' },
      { name: '混合生菜', amount: '100g' },
      { name: '小番茄', amount: '5个' },
      { name: '黑胡椒', amount: '少许' },
      { name: '橄榄油', amount: '1勺' },
    ],
    steps: [
      {
        id: 1,
        description: '鸡胸肉切块，加入盐和黑胡椒腌制10分钟。',
        image: 'https://picsum.photos/seed/salad1/400/300',
        ingredientsUsed: ['鸡胸肉', '黑胡椒'],
      },
      {
        id: 2,
        description: '平底锅倒少许橄榄油，将鸡胸肉煎至金黄熟透。',
        image: 'https://picsum.photos/seed/salad2/400/300',
        ingredientsUsed: ['橄榄油'],
      },
      {
        id: 3,
        description: '混合生菜洗净沥干水分，小番茄对半切开铺在碗底。',
        image: 'https://picsum.photos/seed/salad3/400/300',
        ingredientsUsed: ['混合生菜', '小番茄'],
      },
      {
        id: 4,
        description: '放上煎好的鸡块，淋上喜欢的低脂沙拉汁即可。',
        image: 'https://picsum.photos/seed/salad4/400/300',
        ingredientsUsed: [],
      },
    ],
  },
  {
    id: 'r3',
    title: '经典番茄炒蛋',
    description: '最家常的美味，酸甜可口，下饭神器。',
    image: 'https://picsum.photos/seed/tomatoegg/800/600',
    categoryId: 'c2',
    likes: 2108,
    difficulty: '简单',
    time: '10分钟',
    servings: 2,
    ingredients: [
      { name: '番茄', amount: '2个' },
      { name: '鸡蛋', amount: '3个' },
      { name: '盐', amount: '半勺' },
      { name: '糖', amount: '1勺' },
    ],
    steps: [
      {
        id: 1,
        description: '番茄洗净切块，鸡蛋打入碗中均匀打散散备用。',
        image: 'https://picsum.photos/seed/tomato1/400/300',
        ingredientsUsed: ['番茄', '鸡蛋'],
      },
      {
        id: 2,
        description: '热锅倒油，倒入鸡蛋液炒熟盛出。',
        image: 'https://picsum.photos/seed/tomato2/400/300',
        ingredientsUsed: ['鸡蛋'],
      },
      {
        id: 3,
        description: '另起锅炒软番茄，煸炒出红色汤汁。',
        image: 'https://picsum.photos/seed/tomato3/400/300',
        ingredientsUsed: ['番茄'],
      },
      {
        id: 4,
        description: '加入鸡蛋，放盐和糖翻炒均匀即可。',
        image: 'https://picsum.photos/seed/tomato4/400/300',
        ingredientsUsed: ['盐', '糖'],
      },
    ],
  },
  {
    id: 'r4',
    title: '熔岩巧克力蛋糕',
    description: '切开后巧克力浆如岩浆般流出，甜蜜浓郁的治愈系甜点。',
    image: 'https://picsum.photos/seed/cake/800/600',
    categoryId: 'c9',
    likes: 3450,
    difficulty: '困难',
    time: '40分钟',
    servings: 2,
    ingredients: [
      { name: '黑巧克力', amount: '100g' },
      { name: '黄油', amount: '50g' },
      { name: '鸡蛋', amount: '2个' },
      { name: '白糖', amount: '30g' },
      { name: '低筋面粉', amount: '20g' },
    ],
    steps: [
      {
        id: 1,
        description: '黑巧克力与黄油隔水加热融化至顺滑。',
        image: 'https://picsum.photos/seed/cake1/400/300',
        ingredientsUsed: ['黑巧克力', '黄油'],
      },
      {
        id: 2,
        description: '鸡蛋和白糖搅打均匀，无需打发。',
        image: 'https://picsum.photos/seed/cake2/400/300',
        ingredientsUsed: ['鸡蛋', '白糖'],
      },
      {
        id: 3,
        description: '将巧克力浆倒入蛋液中拌匀，筛入面粉翻拌均匀。',
        image: 'https://picsum.photos/seed/cake3/400/300',
        ingredientsUsed: ['低筋面粉'],
      },
      {
        id: 4,
        description: '倒入纸杯模具，放入预热好的烤箱200度烤10分钟。',
        image: 'https://picsum.photos/seed/cake4/400/300',
        ingredientsUsed: [],
      },
    ],
  },
];

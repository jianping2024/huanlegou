import { Product } from '../../types';

export const products: Product[] = [
  {
    id: 'p-1',
    title: '韩版可爱发夹套装 女儿童头饰边夹 批发',
    image: 'https://picsum.photos/seed/p1/400/400',
    images: [
      'https://picsum.photos/seed/p1/750/750',
      'https://picsum.photos/seed/p1b/750/750',
      'https://picsum.photos/seed/p1c/750/750',
    ],
    price: 0.85,
    minOrder: 50,
    unit: '套',
    shopId: 'shop-2',
    shopName: '饰界潮流饰品馆',
    categoryId: 'cat-2',
    sales: 12800,
    tags: ['爆款', '一件代发'],
    priceTiers: [
      { minQty: 50, price: 0.85 },
      { minQty: 200, price: 0.72 },
      { minQty: 1000, price: 0.58 },
    ],
  },
  {
    id: 'p-2',
    title: '透明收纳盒 桌面整理神器 多规格可选',
    image: 'https://picsum.photos/seed/p2/400/400',
    images: [
      'https://picsum.photos/seed/p2/750/750',
      'https://picsum.photos/seed/p2b/750/750',
    ],
    price: 2.3,
    minOrder: 20,
    unit: '个',
    shopId: 'shop-1',
    shopName: '义乌小商品源头工厂店',
    categoryId: 'cat-1',
    sales: 8600,
    tags: ['源头工厂'],
    priceTiers: [
      { minQty: 20, price: 2.3 },
      { minQty: 100, price: 1.95 },
      { minQty: 500, price: 1.6 },
    ],
  },
  {
    id: 'p-3',
    title: 'Type-C快充数据线 1米2米 安卓苹果通用',
    image: 'https://picsum.photos/seed/p3/400/400',
    images: [
      'https://picsum.photos/seed/p3/750/750',
      'https://picsum.photos/seed/p3b/750/750',
    ],
    price: 1.5,
    minOrder: 100,
    unit: '条',
    shopId: 'shop-1',
    shopName: '义乌小商品源头工厂店',
    categoryId: 'cat-7',
    sales: 25600,
    tags: ['热销'],
    priceTiers: [
      { minQty: 100, price: 1.5 },
      { minQty: 500, price: 1.2 },
      { minQty: 2000, price: 0.95 },
    ],
  },
  {
    id: 'p-4',
    title: '创意钥匙扣 卡通动物挂件 小礼品批发',
    image: 'https://picsum.photos/seed/p4/400/400',
    images: ['https://picsum.photos/seed/p4/750/750'],
    price: 0.35,
    minOrder: 200,
    unit: '个',
    shopId: 'shop-2',
    shopName: '饰界潮流饰品馆',
    categoryId: 'cat-2',
    sales: 45200,
    tags: ['超低价'],
    priceTiers: [
      { minQty: 200, price: 0.35 },
      { minQty: 1000, price: 0.28 },
    ],
  },
  {
    id: 'p-5',
    title: '毛绒玩具公仔 25cm 抓机娃娃 批发',
    image: 'https://picsum.photos/seed/p5/400/400',
    images: [
      'https://picsum.photos/seed/p5/750/750',
      'https://picsum.photos/seed/p5b/750/750',
    ],
    price: 6.8,
    minOrder: 10,
    unit: '只',
    shopId: 'shop-3',
    shopName: '童乐玩具批发中心',
    categoryId: 'cat-3',
    sales: 3200,
    tags: ['CE认证'],
    priceTiers: [
      { minQty: 10, price: 6.8 },
      { minQty: 50, price: 5.9 },
      { minQty: 200, price: 4.8 },
    ],
  },
  {
    id: 'p-6',
    title: '中性笔0.5mm 办公文具 黑蓝红三色',
    image: 'https://picsum.photos/seed/p6/400/400',
    images: ['https://picsum.photos/seed/p6/750/750'],
    price: 0.18,
    minOrder: 500,
    unit: '支',
    shopId: 'shop-4',
    shopName: '文具优品供应链',
    categoryId: 'cat-4',
    sales: 98000,
    tags: ['工厂直供'],
    priceTiers: [
      { minQty: 500, price: 0.18 },
      { minQty: 2000, price: 0.15 },
      { minQty: 10000, price: 0.12 },
    ],
  },
  {
    id: 'p-7',
    title: '帆布袋环保购物袋 可定制LOGO 空白款',
    image: 'https://picsum.photos/seed/p7/400/400',
    images: [
      'https://picsum.photos/seed/p7/750/750',
      'https://picsum.photos/seed/p7b/750/750',
    ],
    price: 1.8,
    minOrder: 100,
    unit: '个',
    shopId: 'shop-1',
    shopName: '义乌小商品源头工厂店',
    categoryId: 'cat-6',
    sales: 15600,
    tags: ['可定制'],
    priceTiers: [
      { minQty: 100, price: 1.8 },
      { minQty: 500, price: 1.5 },
      { minQty: 2000, price: 1.2 },
    ],
  },
  {
    id: 'p-8',
    title: '手机壳透明软壳 多型号 防摔保护套',
    image: 'https://picsum.photos/seed/p8/400/400',
    images: ['https://picsum.photos/seed/p8/750/750'],
    price: 0.65,
    minOrder: 100,
    unit: '个',
    shopId: 'shop-1',
    shopName: '义乌小商品源头工厂店',
    categoryId: 'cat-7',
    sales: 67800,
    tags: ['全型号'],
    priceTiers: [
      { minQty: 100, price: 0.65 },
      { minQty: 500, price: 0.52 },
    ],
  },
  {
    id: 'p-9',
    title: '创意笔记本 A5线圈本 学生文具批发',
    image: 'https://picsum.photos/seed/p9/400/400',
    images: ['https://picsum.photos/seed/p9/750/750'],
    price: 1.2,
    minOrder: 50,
    unit: '本',
    shopId: 'shop-4',
    shopName: '文具优品供应链',
    categoryId: 'cat-4',
    sales: 8900,
    tags: ['学生热销'],
    priceTiers: [
      { minQty: 50, price: 1.2 },
      { minQty: 200, price: 1.0 },
    ],
  },
  {
    id: 'p-10',
    title: 'LED小夜灯 充电款 卧室床头灯 批发',
    image: 'https://picsum.photos/seed/p10/400/400',
    images: [
      'https://picsum.photos/seed/p10/750/750',
      'https://picsum.photos/seed/p10b/750/750',
    ],
    price: 4.5,
    minOrder: 20,
    unit: '个',
    shopId: 'shop-1',
    shopName: '义乌小商品源头工厂店',
    categoryId: 'cat-7',
    sales: 5400,
    tags: ['新品'],
    priceTiers: [
      { minQty: 20, price: 4.5 },
      { minQty: 100, price: 3.8 },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProductsByShop(shopId: string): Product[] {
  return products.filter((p) => p.shopId === shopId);
}

export function searchProducts(keyword: string): Product[] {
  const q = keyword.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.shopName.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q)),
  );
}

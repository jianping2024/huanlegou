import { Shop } from '../../types';

export const shops: Shop[] = [
  {
    id: 'shop-1',
    name: '义乌小商品源头工厂店',
    avatar: 'https://picsum.photos/seed/shop1/80/80',
    banner: 'https://picsum.photos/seed/shopbanner1/750/300',
    market: '国际商贸城一区',
    stall: 'A2-1388',
    rating: 4.9,
    productCount: 1280,
    description: '专注日用百货批发10年，支持一件代发，欢迎实地看样。',
  },
  {
    id: 'shop-2',
    name: '饰界潮流饰品馆',
    avatar: 'https://picsum.photos/seed/shop2/80/80',
    banner: 'https://picsum.photos/seed/shopbanner2/750/300',
    market: '国际商贸城二区',
    stall: 'B3-2156',
    rating: 4.8,
    productCount: 856,
    description: '日韩风饰品源头，新款每周更新，起订量低。',
  },
  {
    id: 'shop-3',
    name: '童乐玩具批发中心',
    avatar: 'https://picsum.photos/seed/shop3/80/80',
    banner: 'https://picsum.photos/seed/shopbanner3/750/300',
    market: '国际商贸城一区',
    stall: 'C1-0921',
    rating: 4.7,
    productCount: 620,
    description: '毛绒、积木、遥控玩具全品类，CE/3C认证齐全。',
  },
  {
    id: 'shop-4',
    name: '文具优品供应链',
    avatar: 'https://picsum.photos/seed/shop4/80/80',
    banner: 'https://picsum.photos/seed/shopbanner4/750/300',
    market: '国际商贸城三区',
    stall: 'D4-3310',
    rating: 4.9,
    productCount: 2100,
    description: '办公文具、学生用品一站式采购，支持定制LOGO。',
  },
];

export function getShopById(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}

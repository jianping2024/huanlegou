import { Category } from '../../types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: '日用百货',
    icon: '🏠',
    children: [
      { id: 'sub-1-1', name: '收纳整理', image: 'https://picsum.photos/seed/yw1/120/120' },
      { id: 'sub-1-2', name: '厨房用品', image: 'https://picsum.photos/seed/yw2/120/120' },
      { id: 'sub-1-3', name: '清洁工具', image: 'https://picsum.photos/seed/yw3/120/120' },
      { id: 'sub-1-4', name: '雨伞雨具', image: 'https://picsum.photos/seed/yw4/120/120' },
    ],
  },
  {
    id: 'cat-2',
    name: '饰品配件',
    icon: '💎',
    children: [
      { id: 'sub-2-1', name: '发饰头饰', image: 'https://picsum.photos/seed/yw5/120/120' },
      { id: 'sub-2-2', name: '项链手链', image: 'https://picsum.photos/seed/yw6/120/120' },
      { id: 'sub-2-3', name: '耳饰戒指', image: 'https://picsum.photos/seed/yw7/120/120' },
      { id: 'sub-2-4', name: '钥匙扣挂件', image: 'https://picsum.photos/seed/yw8/120/120' },
    ],
  },
  {
    id: 'cat-3',
    name: '玩具童车',
    icon: '🧸',
    children: [
      { id: 'sub-3-1', name: '毛绒玩具', image: 'https://picsum.photos/seed/yw9/120/120' },
      { id: 'sub-3-2', name: '益智积木', image: 'https://picsum.photos/seed/yw10/120/120' },
      { id: 'sub-3-3', name: '遥控玩具', image: 'https://picsum.photos/seed/yw11/120/120' },
      { id: 'sub-3-4', name: '童车滑板', image: 'https://picsum.photos/seed/yw12/120/120' },
    ],
  },
  {
    id: 'cat-4',
    name: '办公文具',
    icon: '✏️',
    children: [
      { id: 'sub-4-1', name: '笔类本册', image: 'https://picsum.photos/seed/yw13/120/120' },
      { id: 'sub-4-2', name: '文件收纳', image: 'https://picsum.photos/seed/yw14/120/120' },
      { id: 'sub-4-3', name: '办公设备', image: 'https://picsum.photos/seed/yw15/120/120' },
      { id: 'sub-4-4', name: '学生文具', image: 'https://picsum.photos/seed/yw16/120/120' },
    ],
  },
  {
    id: 'cat-5',
    name: '服装内衣',
    icon: '👕',
    children: [
      { id: 'sub-5-1', name: 'T恤卫衣', image: 'https://picsum.photos/seed/yw17/120/120' },
      { id: 'sub-5-2', name: '袜子内衣', image: 'https://picsum.photos/seed/yw18/120/120' },
      { id: 'sub-5-3', name: '帽子围巾', image: 'https://picsum.photos/seed/yw19/120/120' },
      { id: 'sub-5-4', name: '运动服饰', image: 'https://picsum.photos/seed/yw20/120/120' },
    ],
  },
  {
    id: 'cat-6',
    name: '箱包皮具',
    icon: '👜',
    children: [
      { id: 'sub-6-1', name: '双肩背包', image: 'https://picsum.photos/seed/yw21/120/120' },
      { id: 'sub-6-2', name: '手提女包', image: 'https://picsum.photos/seed/yw22/120/120' },
      { id: 'sub-6-3', name: '旅行拉杆', image: 'https://picsum.photos/seed/yw23/120/120' },
      { id: 'sub-6-4', name: '钱包卡包', image: 'https://picsum.photos/seed/yw24/120/120' },
    ],
  },
  {
    id: 'cat-7',
    name: '电子电器',
    icon: '📱',
    children: [
      { id: 'sub-7-1', name: '手机配件', image: 'https://picsum.photos/seed/yw25/120/120' },
      { id: 'sub-7-2', name: '数据线充', image: 'https://picsum.photos/seed/yw26/120/120' },
      { id: 'sub-7-3', name: '小家电', image: 'https://picsum.photos/seed/yw27/120/120' },
      { id: 'sub-7-4', name: 'LED灯具', image: 'https://picsum.photos/seed/yw28/120/120' },
    ],
  },
  {
    id: 'cat-8',
    name: '体育户外',
    icon: '⚽',
    children: [
      { id: 'sub-8-1', name: '健身器材', image: 'https://picsum.photos/seed/yw29/120/120' },
      { id: 'sub-8-2', name: '球类运动', image: 'https://picsum.photos/seed/yw30/120/120' },
      { id: 'sub-8-3', name: '露营户外', image: 'https://picsum.photos/seed/yw31/120/120' },
      { id: 'sub-8-4', name: '游泳用品', image: 'https://picsum.photos/seed/yw32/120/120' },
    ],
  },
];

export interface Category {
  id: string;
  name: string;
  icon: string;
  children?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  images: string[];
  price: number;
  minOrder: number;
  unit: string;
  shopId: string;
  shopName: string;
  categoryId: string;
  sales: number;
  tags?: string[];
  priceTiers?: PriceTier[];
}

export interface PriceTier {
  minQty: number;
  price: number;
}

export interface Shop {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  market: string;
  stall: string;
  rating: number;
  productCount: number;
  description: string;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  subtitle?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { productId: string };
  Search: undefined;
  Shop: { shopId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Category: undefined;
  Cart: undefined;
  Profile: undefined;
};

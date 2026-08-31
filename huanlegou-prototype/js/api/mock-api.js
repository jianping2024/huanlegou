/**
 * Mock 数据提供者 — 实现与 http-api.js 相同的方法签名。
 * 页面层（app.js）只调用 window.api，不直接读 Catalog / AppStore。
 */
const MockApi = {
  formatPrice,

  getBanners() {
    return Catalog.banners;
  },

  getQuickEntries() {
    return Catalog.quickEntries;
  },

  getCategories() {
    return Catalog.categories;
  },

  getCategoryTree() {
    return Catalog.categoryTree;
  },

  getMarkets() {
    return Catalog.markets;
  },

  getHotKeywords() {
    return Catalog.hotKeywords;
  },

  getProducts(filters = {}) {
    let list = Catalog.products;
    if (filters.categoryId) {
      list = list.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters.shopId) {
      list = list.filter((p) => p.shopId === filters.shopId);
    }
    if (filters.query) {
      const q = filters.query.trim().toLowerCase();
      if (q) {
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.shop.toLowerCase().includes(q) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))),
        );
      }
    }
    if (filters.excludeId) {
      list = list.filter((p) => p.id !== filters.excludeId);
    }
    if (typeof filters.limit === 'number') {
      list = list.slice(0, filters.limit);
    }
    return list;
  },

  getProduct(id) {
    return Catalog.products.find((p) => p.id === id) || null;
  },

  getShop(id) {
    return Catalog.shops[id] || null;
  },

  getProductsByShop(shopId) {
    return this.getProducts({ shopId });
  },

  getCartCount() {
    return AppStore.cart.length;
  },

  getCartLineItems() {
    return AppStore.cart
      .map((item) => {
        const product = this.getProduct(item.productId);
        if (!product) return null;
        return { ...item, product, sub: product.price * item.qty };
      })
      .filter(Boolean);
  },

  addToCart(productId, qty, spec) {
    const existing = AppStore.cart.find((i) => i.productId === productId && i.spec === spec);
    if (existing) {
      existing.qty += qty;
    } else {
      AppStore.cart.push({ productId, qty, spec });
    }
    return this.getCartLineItems();
  },

  clearCart() {
    AppStore.cart = [];
  },

  getOrders() {
    return [...AppStore.orders];
  },

  getOrderCounts() {
    const counts = { 待付款: 0, 待发货: 0, 待收货: 0, 待评价: 0, 退款: 0 };
    AppStore.orders.forEach((o) => {
      if (o.status in counts) counts[o.status]++;
      else if (o.status === '已完成') counts['待评价']++;
    });
    counts['退款'] = 1;
    return counts;
  },

  createOrder({ total, items, status = '待付款' }) {
    const order = {
      id: `o${Date.now()}`,
      status,
      total,
      items,
      time: new Date().toISOString().slice(0, 10),
    };
    AppStore.orders.unshift(order);
    return order;
  },
};

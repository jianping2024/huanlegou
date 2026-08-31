/**
 * 远程 API 提供者（占位）。
 * 对接后端时在此实现 fetch，并与 MockApi 保持相同方法名。
 *
 * 示例：
 *   async getProducts(filters = {}) {
 *     const qs = new URLSearchParams(filters).toString();
 *     const res = await fetch(`${ApiConfig.baseUrl}/api/products?${qs}`, {
 *       headers: ApiConfig.headers(),
 *     });
 *     if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *     return res.json();
 *   }
 */
const HttpApi = {
  formatPrice,

  async getBanners() {
    throw new Error('HttpApi.getBanners 尚未实现，请设置 ApiConfig.mode = "mock" 或补全接口');
  },
};

// 未实现的方法统一报错，避免静默失败
[
  'getQuickEntries',
  'getCategories',
  'getCategoryTree',
  'getMarkets',
  'getHotKeywords',
  'getProducts',
  'getProduct',
  'getShop',
  'getProductsByShop',
  'getCartItems',
  'getCartCount',
  'getCartLineItems',
  'addToCart',
  'clearCart',
  'getOrders',
  'getOrderCounts',
  'createOrder',
].forEach((name) => {
  if (typeof HttpApi[name] !== 'function') {
    HttpApi[name] = () => {
      throw new Error(`HttpApi.${name} 尚未实现`);
    };
  }
});

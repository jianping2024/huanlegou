/** 页面统一入口：api.getProducts() / api.addToCart() … */
const api = ApiConfig.mode === 'remote' ? HttpApi : MockApi;

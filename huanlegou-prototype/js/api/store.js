/** 运行时购物车 / 订单（mock 模式本地可变；remote 模式由 API 同步） */
const AppStore = {
  cart: SessionSeed.cart.map((item) => ({ ...item })),
  orders: SessionSeed.orders.map((order) => ({ ...order })),
};

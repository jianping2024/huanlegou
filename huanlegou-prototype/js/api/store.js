/** 运行时购物车 / 订单（mock 模式本地可变；remote 模式由 API 同步） */
const AppStore = {
  cart: [],
  orders: [],

  reset() {
    this.cart = SessionSeed.cart.map((item) => ({ ...item }));
    this.orders = SessionSeed.orders.map((order) => ({ ...order }));
  },
};

AppStore.reset();

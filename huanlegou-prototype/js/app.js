(function () {
  'use strict';

  const state = {
    tab: 'home',
    stack: [],
    categoryIndex: 0,
    currentProductId: null,
    searchQuery: '',
    galleryIndex: 0,
    selectedSpec: '',
    listSort: 'default',
    listPriceAsc: true,
    listProducts: [],
    detailScrollHandler: null,
    sheetIntent: 'select',
    sheetQty: 100,
    loggedIn: false,
    orderFilter: '',
    searchHistory: ['钥匙扣', '文具套装', '毛绒玩具'],
    checkoutSource: 'buy',
  };

  const QUICK_ENTRY_SVGS = {
    '🗺️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    '🌏': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
    '📺': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="13" rx="2"/><path d="M8 3l4 4 4-4"/></svg>',
    '📦': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>',
    '🏪': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const TAB_SCREENS = {
    home: 'screen-home',
    category: 'screen-category',
    market: 'screen-market',
    cart: 'screen-cart',
    profile: 'screen-profile',
  };

  const SUB_SCREENS = ['screen-search', 'screen-detail', 'screen-shop', 'screen-list', 'screen-checkout', 'screen-orders'];

  const BACK_BTN_MINIMAL = `<button class="back-btn back-btn-minimal" id="back-btn" aria-label="返回">
        <svg class="back-btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>`;

  const FLOAT_NAV_HTML = `<div class="float-nav">
        <button class="back-btn back-btn-float" data-action="back" aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="float-nav-actions">
          <button class="nav-icon-btn" data-action="toast" data-msg="分享 · 静态演示" aria-label="分享">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v10M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="nav-icon-btn" data-action="toast" data-msg="更多 · 静态演示" aria-label="更多">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>
          </button>
        </div>
      </div>`;

  function getActiveScreen() {
    return $('.screen.active');
  }

  function resetScreenScroll(screenEl) {
    const el = screenEl || getActiveScreen();
    if (el) el.scrollTop = 0;
    const listGrid = $('#list-products');
    if (listGrid && el?.id === 'screen-list') listGrid.scrollTop = 0;
  }

  function getDetailScrollRoot() {
    return $('#screen-detail');
  }

  function scrollWithin(root, targetEl, offset = 48) {
    if (!root || !targetEl) return;
    const rootRect = root.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const top = root.scrollTop + (targetRect.top - rootRect.top) - offset;
    root.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  const ORDER_STATUS_ICONS = {
    待付款: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    待发货: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.3 7.7L12 12l8.7-4.3M12 22V12"/></svg>',
    待收货: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="6" width="15" height="10" rx="1"/><path d="M16 10h4l2 3v3h-6v-6z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    待评价: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    退款: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 109-9v4M3 7v5h5"/></svg>',
  };

  function renderProfile() {
    const root = $('#profile-root');
    if (!root) return;
    const counts = api.getOrderCounts();
    const orderStatuses = ['待付款', '待发货', '待收货', '待评价', '退款'];
    const name = state.loggedIn ? '张先生' : '登录 / 注册';
    const desc = state.loggedIn ? '138****6688 · 金牌采购商' : '登录后可同步订单与收藏';

    root.innerHTML = `
      <div class="profile-page">
        <div class="profile-hero">
          <div class="profile-top-actions">
            <button type="button" class="profile-action-btn" data-action="toast" data-msg="扫码 · 静态演示" aria-label="扫码">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7V4h3M20 7V4h-3M4 17v3h3M20 17v3h-3"/><rect x="7" y="7" width="4" height="4" rx="1"/><rect x="13" y="7" width="4" height="4" rx="1"/><rect x="7" y="13" width="4" height="4" rx="1"/><path d="M13 13h4v4"/></svg>
            </button>
            <button type="button" class="profile-action-btn" data-action="toast" data-msg="消息 · 静态演示" aria-label="消息">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </button>
            <button type="button" class="profile-action-btn" data-action="toast" data-msg="设置 · 静态演示" aria-label="设置">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button>
          </div>
          <div class="profile-user-row" data-action="toggle-login">
            <div class="profile-avatar">
              ${state.loggedIn
                ? '<img src="assets/shops/s1-avatar.jpg" alt="" loading="lazy" />'
                : '<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'}
            </div>
            <div class="profile-user-info">
              <div class="profile-username">${name}</div>
              <div class="profile-user-desc">${desc}</div>
            </div>
            <span class="profile-chevron">›</span>
          </div>
          ${state.loggedIn ? `
          <div class="profile-vip-bar">
            <span class="vip-badge">VIP</span>
            <span>金牌采购商 · 实体市场认证 · 7天无理由</span>
            <span class="vip-more">权益 ›</span>
          </div>` : ''}
        </div>
        <div class="profile-stats">
          <div class="stat" data-action="toast" data-msg="我的收藏 · 静态演示"><div class="num">12</div><div class="label">收藏</div></div>
          <div class="stat-divider"></div>
          <div class="stat" data-action="toast" data-msg="关注店铺 · 静态演示"><div class="num">5</div><div class="label">关注店铺</div></div>
          <div class="stat-divider"></div>
          <div class="stat" data-action="toast" data-msg="浏览足迹 · 静态演示"><div class="num">28</div><div class="label">足迹</div></div>
          <div class="stat-divider"></div>
          <div class="stat" data-action="toast" data-msg="优惠券 · 静态演示"><div class="num">3</div><div class="label">优惠券</div></div>
        </div>
        <div class="profile-card order-section">
          <div class="card-head">
            <h3>我的订单</h3>
            <button type="button" class="card-head-link" data-action="orders-all">查看全部 ›</button>
          </div>
          <div class="order-icons">
            ${orderStatuses
              .map(
                (status) => `
              <div class="order-icon-item" data-action="orders-filter" data-status="${status}">
                <div class="order-icon-wrap">
                  ${ORDER_STATUS_ICONS[status]}
                  ${counts[status] > 0 ? `<span class="order-badge">${counts[status]}</span>` : ''}
                </div>
                <span>${status}</span>
              </div>`,
              )
              .join('')}
          </div>
        </div>
        <div class="profile-card b2b-section">
          <div class="card-head"><h3>采购工具</h3></div>
          <div class="b2b-grid">
            <div class="b2b-item" data-action="go-cart">
              <div class="b2b-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L4 2H1"/></svg></div>
              <span>进货单</span>
            </div>
            <div class="b2b-item" data-action="toast" data-msg="询价记录 · 静态演示">
              <div class="b2b-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg></div>
              <span>询价记录</span>
            </div>
            <div class="b2b-item" data-action="toast" data-msg="发票中心 · 静态演示">
              <div class="b2b-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></svg></div>
              <span>发票中心</span>
            </div>
            <div class="b2b-item" data-action="toast" data-msg="对账单 · 静态演示">
              <div class="b2b-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
              <span>对账单</span>
            </div>
          </div>
        </div>
        <div class="profile-card menu-group">
          <div class="menu-item" data-action="toast" data-msg="收货地址 · 静态演示">
            <span class="menu-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
            收货地址<span class="arrow">›</span>
          </div>
          <div class="menu-item" data-action="toast" data-msg="预约导购 · 静态演示">
            <span class="menu-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
            预约市场导购<span class="arrow">›</span>
          </div>
          <div class="menu-item" data-action="toast" data-msg="360°看店 · 静态演示">
            <span class="menu-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg></span>
            360°全景看店<span class="arrow">›</span>
          </div>
        </div>
        <div class="profile-card menu-group">
          <div class="menu-item" data-action="toast" data-msg="客服中心 · 0579-81530000">
            <span class="menu-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></span>
            客服中心<span class="arrow">›</span>
          </div>
          <div class="menu-item" data-action="toast" data-msg="设置 · 静态演示">
            <span class="menu-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></span>
            设置<span class="arrow">›</span>
          </div>
        </div>
      </div>`;
  }

  function renderOrdersList(statusFilter = '') {
    state.orderFilter = statusFilter;
    let orders = [...api.getOrders()];
    if (statusFilter && statusFilter !== '全部') {
      if (statusFilter === '待评价') {
        orders = orders.filter((o) => o.status === '已完成' || o.status === '待评价');
      } else if (statusFilter === '退款') {
        orders = [];
      } else {
        orders = orders.filter((o) => o.status === statusFilter);
      }
    }

    const tabs = ['全部', '待付款', '待发货', '待收货', '待评价'];
    $('#orders-list').innerHTML = `
      <div class="orders-tabs">
        ${tabs
          .map(
            (t) => `<button type="button" class="orders-tab ${statusFilter === t || (!statusFilter && t === '全部') ? 'active' : ''}" data-action="orders-filter" data-status="${t}">${t}</button>`,
          )
          .join('')}
      </div>
      <div class="orders-body">
        ${orders.length
          ? orders
              .map(
                (o) => `
            <div class="order-card" data-action="toast" data-msg="订单 ${o.id} · ${o.status}">
              <div class="order-card-head">
                <span>订单号 ${o.id}</span>
                <span class="order-status ${o.status === '待付款' ? 'highlight' : ''}">${o.status}</span>
              </div>
              <div class="order-card-body">
                <div class="order-card-meta">${o.items} 件商品 · ${o.time}</div>
                <div class="order-card-total">合计 <strong>${api.formatPrice(o.total)}</strong></div>
              </div>
              <div class="order-card-actions">
                ${o.status === '待付款' ? '<button type="button" class="order-btn primary" data-action="toast" data-msg="去支付 · 静态演示">去支付</button>' : ''}
                <button type="button" class="order-btn" data-action="toast" data-msg="查看详情 · 静态演示">查看详情</button>
              </div>
            </div>`,
              )
              .join('')
          : `<div class="empty-state"><div class="empty-icon">📋</div><p>暂无${statusFilter || ''}订单</p></div>`}
      </div>`;

    $('#sub-title').textContent = statusFilter && statusFilter !== '全部' ? statusFilter : '我的订单';
  }

  function openOrdersList(statusFilter = '') {
    pushScreen('screen-orders', () => renderOrdersList(statusFilter));
  }

  function toggleLogin() {
    state.loggedIn = !state.loggedIn;
    renderProfile();
    showToast(state.loggedIn ? '登录成功 · 欢迎回来' : '已退出登录');
  }

  function showToast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function updateMainHeaderForTab(tab) {
    const header = $('#main-header');
    if (!header) return;

    $$('.header-mode').forEach((m) => m.classList.remove('active'));

    if (tab === 'profile') {
      header.style.display = 'none';
      return;
    }

    header.style.display = 'flex';
    header.className = tab === 'home' ? 'app-header home-header' : 'app-header tab-title-header';

    const modeMap = {
      home: 'header-home',
      category: 'header-category',
      cart: 'header-cart',
      market: 'header-market',
    };
    const modeId = modeMap[tab] || 'header-home';
    $(`#${modeId}`)?.classList.add('active');
  }

  function productCardHTML(p) {
    return `
      <article class="product-card" data-product="${p.id}">
        <div class="product-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="card-wholesale">批发</span>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">${api.formatPrice(p.price)}<small>/${p.unit}</small></div>
          <div class="product-meta">${p.minOrder}${p.unit}起批 · 已售${p.sales}</div>
          <div class="product-tags">${(p.tags || []).slice(0, 2).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </article>`;
  }

  function openBannerLink(banner) {
    const link = banner?.link;
    if (!link?.type) {
      showToast(`${banner?.title || '活动'} · 静态演示`);
      return;
    }

    if (link.type === 'list') {
      pushScreen('screen-list', () => renderList(link.title || banner.title, link.categoryId));
      return;
    }
    if (link.type === 'shop' && link.shopId) {
      pushScreen('screen-shop', () => renderShop(link.shopId), 'immersive');
      return;
    }
    if (link.type === 'product' && link.productId) {
      pushScreen('screen-detail', () => renderDetail(link.productId), 'immersive');
      return;
    }
    if (link.type === 'toast') {
      showToast(link.msg || `${banner.title} · 静态演示`);
      return;
    }

    showToast(`${banner.title} · 静态演示`);
  }

  function renderBanners() {
    BannerSwiper.mount($('#banner-swiper'), api.getBanners(), {
      onNavigate: openBannerLink,
    });
  }

  function renderQuickEntries() {
    $('#quick-entries').innerHTML = api.getQuickEntries()
      .map(
        (e) => `
      <div class="quick-entry" data-action="toast" data-msg="${e.name} · 静态演示">
        <div class="quick-icon" style="background:${e.color}12;color:${e.color}">${QUICK_ENTRY_SVGS[e.icon] || e.icon}</div>
        <span>${e.name}</span>
      </div>`,
      )
      .join('');
  }

  function renderHomeCategories() {
    $('#home-categories').innerHTML = api.getCategories()
      .map(
        (c) => `
      <div class="category-item" data-category="${c.id}">
        <div class="cat-icon"><img src="${c.image}" alt="${c.name}" loading="lazy" /></div>
        <span class="cat-name">${c.name}</span>
      </div>`,
      )
      .join('');
  }

  function renderProductGrid(containerId, products) {
    const el = $(containerId);
    if (!el) return;
    el.innerHTML = products.map(productCardHTML).join('');
  }

  function renderCategorySidebar() {
    $('#category-sidebar').innerHTML = api.getCategoryTree()
      .map(
        (c, i) => `
      <div class="side-item ${i === state.categoryIndex ? 'active' : ''}" data-category-id="${c.id}">${c.name}</div>`,
      )
      .join('');
    renderCategoryMain();
  }

  function renderCategoryMain() {
    const cat = api.getCategoryTree()[state.categoryIndex];
    if (!cat) return;
    $('#category-main').innerHTML = `
      <div class="subcat-title">${cat.name}</div>
      <div class="subcat-grid">
        ${cat.children
          .map(
            (sub) => `
          <div class="subcat-item" data-action="list" data-title="${sub.name}" data-list-category="${cat.id}">
            <div class="sub-icon"><img src="${sub.image}" alt="${sub.name}" loading="lazy" /></div>
            <div>${sub.name}</div>
          </div>`,
          )
          .join('')}
      </div>
      <div class="section-title"><span>热门${cat.name}</span></div>
      <div class="product-grid" id="cat-products"></div>`;
    const filtered = api.getProducts({ categoryId: cat.id });
    renderProductGrid('#cat-products', filtered.length ? filtered : api.getProducts({ limit: 4 }));
  }

  function getCategoryIndex(categoryId) {
    const idx = api.getCategoryTree().findIndex((c) => c.id === categoryId);
    return idx >= 0 ? idx : 0;
  }

  function openCategoryTab(categoryId) {
    state.categoryIndex = getCategoryIndex(categoryId);
    state.tab = 'category';
    state.stack = [];
    setHeaderMode('main');

    $$('.screen').forEach((s) => s.classList.remove('active'));
    $('#screen-category').classList.add('active');
    $$('.tab-item').forEach((t) => t.classList.toggle('active', t.dataset.tab === 'category'));

    updateMainHeaderForTab('category');
    renderCategorySidebar();
    resetScreenScroll($('#screen-category'));
  }

  function renderMarkets() {
    $('#market-list').innerHTML = api.getMarkets()
      .map(
        (m) => `
      <div class="market-card" data-action="toast" data-msg="${m.name} · 静态演示">
        <div class="market-icon"><img src="${m.image}" alt="${m.name}" loading="lazy" /></div>
        <div class="market-info">
          <div class="market-card-top">
            <h3>${m.name}</h3>
            <span class="market-tag">${m.tag}</span>
          </div>
          <p class="market-shops">${m.shops.toLocaleString()} 家商铺 · 实体认证</p>
          <div class="market-card-bottom">
            <span class="market-360">360°全景看店</span>
            <span class="market-enter">进入 ›</span>
          </div>
        </div>
      </div>`,
      )
      .join('');
  }

  function renderCartRecommend() {
    const el = $('#cart-recommend');
    if (!el) return;
    const picks = api.getProducts({ limit: 4 });
    el.innerHTML = `
      <div class="section-title section-title-row"><span>猜你想进</span></div>
      <div class="product-grid cart-rec-grid">${picks.map(productCardHTML).join('')}</div>`;
  }

  function renderCart() {
    const items = api.getCartLineItems();
    const total = items.reduce((s, i) => s + i.sub, 0);

    if (!items.length) {
      $('#cart-list').innerHTML = `
        <div class="empty-state cart-empty">
          <div class="empty-icon-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg></div>
          <p>进货单还是空的</p>
          <button type="button" class="btn-outline" data-action="go-home">去逛逛</button>
        </div>`;
      $('#cart-footer').innerHTML = '';
      renderCartRecommend();
      return;
    }

    $('#cart-list').innerHTML = items
      .map(
        (item) => `
      <div class="cart-item" data-product="${item.product.id}">
        <div class="cart-check checked" data-action="toast" data-msg="选择 · 静态演示">✓</div>
        <div class="cart-img"><img src="${item.product.image}" alt="" loading="lazy" /></div>
        <div class="cart-detail">
          <div class="cart-shop">${item.product.shop}</div>
          <div class="cart-name">${item.product.name}</div>
          <div class="cart-spec-row" data-action="open-spec" data-intent="select">${item.spec} ›</div>
          <div class="cart-bottom">
            <span class="cart-price">${api.formatPrice(item.product.price)}<small>/${item.product.unit}</small></span>
            <div class="cart-qty-stepper">
              <button type="button" class="qty-btn-sm" data-action="toast" data-msg="数量 · 静态演示">−</button>
              <span>${item.qty}</span>
              <button type="button" class="qty-btn-sm" data-action="toast" data-msg="数量 · 静态演示">+</button>
            </div>
          </div>
        </div>
      </div>`,
      )
      .join('');

    $('#cart-footer').innerHTML = `
      <div class="cart-select-all" data-action="toast" data-msg="全选 · 静态演示"><span class="cart-check checked">✓</span> 全选</div>
      <div class="cart-footer-right">
        <div class="total">合计 <strong>${api.formatPrice(total)}</strong></div>
        <button type="button" class="btn-primary cart-checkout" data-action="go-checkout">去结算(${items.length})</button>
      </div>`;
    renderCartRecommend();
  }

  function renderSearchHistory() {
    const el = $('#search-history');
    if (!el || !state.searchHistory.length) {
      if (el) el.innerHTML = '';
      return;
    }
    el.innerHTML = `
      <div class="section-title-row">
        <h4>最近搜索</h4>
        <button type="button" class="text-link" data-action="clear-history">清空</button>
      </div>
      <div class="keyword-tags">
        ${state.searchHistory.map((k) => `<span class="keyword-tag history" data-keyword="${k}">${k}</span>`).join('')}
      </div>`;
  }

  function addSearchHistory(q) {
    if (!q) return;
    state.searchHistory = [q, ...state.searchHistory.filter((k) => k !== q)].slice(0, 8);
    renderSearchHistory();
  }

  function renderSearch() {
    renderSearchHistory();
    $('#hot-keywords').innerHTML = api.getHotKeywords()
      .map((k) => `<span class="keyword-tag hot" data-keyword="${k}">${k}</span>`)
      .join('');
    doSearch('');
  }

  function doSearch(q) {
    state.searchQuery = q;
    const label = $('#search-result-label');
    if (label) label.textContent = q ? `“${q}” 的搜索结果` : '推荐商品';
    if (q) addSearchHistory(q);
    const results = api.getProducts({ query: q });
    renderProductGrid('#search-results', results);
  }

  function renderDetail(productId) {
    const p = api.getProduct(productId);
    if (!p) return;
    state.currentProductId = productId;
    state.galleryIndex = 0;
    state.selectedSpec = p.specs[0] || '默认';
    state.sheetQty = p.minOrder;

    const originPrice = (p.price * 1.35).toFixed(2);
    const recommends = api.getProducts({ excludeId: productId, limit: 4 });
    const reviews = [
      { user: '采购商***8', text: '质量很好，混色发货均匀，会回购', tag: '回头客' },
      { user: '义乌***2', text: '老板态度好，48小时发货，推荐', tag: '已购100+件' },
    ];

    $('#detail-content').innerHTML = `
      <div class="detail-gallery-wrap" id="section-goods">
        ${FLOAT_NAV_HTML}
        <div class="detail-gallery" id="detail-gallery">
          <div class="gallery-track" id="gallery-track">
            ${p.images
              .map(
                (img, i) => `
              <div class="gallery-slide" data-index="${i}">
                <img src="${img}" alt="${p.name}" draggable="false" />
              </div>`,
              )
              .join('')}
          </div>
          <div class="gallery-counter" id="gallery-counter">1 / ${p.images.length}</div>
          <div class="gallery-pagination" id="gallery-pagination">
            ${p.images.map((_, i) => `<span class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
          </div>
        </div>
        <div class="gallery-thumbs" id="gallery-thumbs">
          ${p.images
            .map(
              (img, i) => `
            <button type="button" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="第${i + 1}张">
              <img src="${img}" alt="" draggable="false" />
            </button>`,
            )
            .join('')}
        </div>
      </div>
      <div class="detail-body">
        <div class="price-row">
          <span class="detail-price">${api.formatPrice(p.price)}<small>/${p.unit}</small></span>
          <span class="price-origin">¥${originPrice}</span>
          <span class="wholesale-badge">批发价</span>
        </div>
        <div class="detail-name">${p.name}</div>
        <div class="detail-meta">
          <span>已售 ${p.sales}</span>
          <span>${p.minOrder}${p.unit}起批</span>
          <span>${p.market}</span>
        </div>
        <div class="detail-tags">${(p.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="service-strip">
        <span class="service-item">✓ 源头工厂</span>
        <span class="service-item">✓ 7天包退</span>
        <span class="service-item">✓ 48h发货</span>
        <span class="service-item">✓ 实体认证</span>
      </div>
      <div class="detail-cells">
        <div class="detail-cell" data-action="open-spec">
          <span class="cell-label">已选</span>
          <span class="cell-value" id="selected-spec-text">${state.selectedSpec}，${p.minOrder}${p.unit}起批</span>
          <span class="cell-arrow">›</span>
        </div>
        <div class="detail-cell" data-action="toast" data-msg="配送 · 浙江义乌发货，满500免运费">
          <span class="cell-label">配送</span>
          <span class="cell-value">浙江义乌 · 预计2-3天送达</span>
          <span class="cell-arrow">›</span>
        </div>
        <div class="detail-cell" data-action="toast" data-msg="保障 · 实体市场认证 · 诚信保障">
          <span class="cell-label">保障</span>
          <span class="cell-value">市场认证 · 7天无理由 · 极速退款</span>
          <span class="cell-arrow">›</span>
        </div>
        <div class="detail-cell" data-action="toast" data-msg="阶梯价格 · 静态演示">
          <span class="cell-label">阶梯价</span>
          <span class="cell-value">${p.tierPrices.map((t) => `${t.qty} ${api.formatPrice(t.price)}`).join(' · ')}</span>
          <span class="cell-arrow">›</span>
        </div>
      </div>
      <div class="shop-bar" data-shop="${p.shopId}">
        <div class="shop-avatar"><img src="${api.getShop(p.shopId)?.avatar || p.image}" alt="" loading="lazy" /></div>
        <div class="shop-bar-info">
          <div class="shop-name">${p.shop}</div>
          <div class="shop-meta">${p.market} · 进店逛逛 ›</div>
        </div>
        <button type="button" class="shop-enter-btn" data-action="nav-shop">进店</button>
      </div>
      <div class="review-section" id="section-reviews">
        <div class="section-head">
          <span class="section-head-title">评价 <em>128</em></span>
          <span class="section-head-extra">好评率 98%</span>
        </div>
        ${reviews
          .map(
            (r) => `
          <div class="review-item">
            <div class="review-user">${r.user} <span class="review-tag">${r.tag}</span></div>
            <div class="review-stars">★★★★★</div>
            <div class="review-text">${r.text}</div>
          </div>`,
          )
          .join('')}
        <button type="button" class="section-more-btn" data-action="toast" data-msg="查看全部评价 · 静态演示">查看全部评价 ›</button>
      </div>
      <div class="recommend-section">
        <div class="section-head">
          <span class="section-head-title">看了又看</span>
        </div>
        <div class="recommend-grid">
          ${recommends.map(productCardHTML).join('')}
        </div>
      </div>
      <div class="detail-desc" id="section-detail">
        <div class="section-head">
          <span class="section-head-title">商品详情</span>
        </div>
        <div class="detail-desc-imgs">
          ${p.images.map((img) => `<img src="${img}" alt="" loading="lazy" />`).join('')}
        </div>
      </div>`;

    $('#sub-title').textContent = '商品详情';
    initProductGallery(p.images.length);
    initDetailScroll();
    resetStickyTabs();
  }

  function resetStickyTabs() {
    $$('.sticky-tab').forEach((tab, i) => tab.classList.toggle('active', i === 0));
  }

  function teardownDetailScroll() {
    const root = getDetailScrollRoot();
    if (state.detailScrollHandler && root) {
      root.removeEventListener('scroll', state.detailScrollHandler);
      state.detailScrollHandler = null;
    }
    const stickyBar = $('#sticky-detail-bar');
    stickyBar?.classList.remove('visible');
    stickyBar?.setAttribute('aria-hidden', 'true');
    document.querySelector('.float-nav')?.classList.remove('fade-out');
  }

  function initDetailScroll() {
    teardownDetailScroll();
    const scrollRoot = getDetailScrollRoot();
    const gallery = $('.detail-gallery-wrap');
    const stickyBar = $('#sticky-detail-bar');
    if (!scrollRoot || !gallery || !stickyBar) return;

    const getThreshold = () => Math.max(gallery.offsetHeight - 72, 200);

    state.detailScrollHandler = () => {
      if (getActiveScreen()?.id !== 'screen-detail') return;

      const show = scrollRoot.scrollTop > getThreshold();
      stickyBar.classList.toggle('visible', show);
      stickyBar.setAttribute('aria-hidden', show ? 'false' : 'true');
      document.querySelector('.float-nav')?.classList.toggle('fade-out', show);

      const sections = [
        { id: 'section-goods', tab: 'section-goods' },
        { id: 'section-reviews', tab: 'section-reviews' },
        { id: 'section-detail', tab: 'section-detail' },
      ];
      const scrollPos = scrollRoot.scrollTop + 100;
      const rootTop = scrollRoot.getBoundingClientRect().top;
      let active = 'section-goods';
      sections.forEach(({ id, tab }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const sectionTop = el.getBoundingClientRect().top - rootTop + scrollRoot.scrollTop;
        if (sectionTop <= scrollPos) active = tab;
      });
      $$('.sticky-tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.anchor === active);
      });
    };

    scrollRoot.addEventListener('scroll', state.detailScrollHandler, { passive: true });
  }

  function scrollToDetailSection(anchorId) {
    const el = document.getElementById(anchorId);
    const scrollRoot = getDetailScrollRoot();
    if (!el || !scrollRoot) return;
    scrollWithin(scrollRoot, el, 90);
    $$('.sticky-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.anchor === anchorId);
    });
  }

  function updateCartBadges() {
    const count = api.getCartCount();
    $$('#cart-badge, #detail-cart-badge, .footer-cart-badge').forEach((el) => {
      if (el) el.textContent = count;
    });
  }

  function updateSelectedSpecDisplay() {
    const p = api.getProduct(state.currentProductId);
    const text = $('#selected-spec-text');
    if (p && text) {
      text.textContent = `${state.selectedSpec}，${state.sheetQty}${p.unit}`;
    }
  }

  function getSheetTotalPrice() {
    const p = api.getProduct(state.currentProductId);
    if (!p) return 0;
    return p.price * state.sheetQty;
  }

  function renderSpecSheetBody() {
    const p = api.getProduct(state.currentProductId);
    if (!p) return;
    $('#sheet-body').innerHTML = `
      <div class="sheet-spec-group">
        <div class="sheet-label">规格</div>
        <div class="spec-options sheet-spec-options">
          ${p.specs.map((s) => `<button type="button" class="spec-btn ${s === state.selectedSpec ? 'active' : ''}" data-spec="${s}">${s}</button>`).join('')}
        </div>
      </div>
      <div class="sheet-qty-row">
        <span class="sheet-label">数量</span>
        <div class="qty-stepper">
          <button type="button" class="qty-btn" data-action="sheet-qty-minus" aria-label="减少">−</button>
          <span class="qty-num" id="sheet-qty-num">${state.sheetQty}</span>
          <button type="button" class="qty-btn" data-action="sheet-qty-plus" aria-label="增加">+</button>
        </div>
        <span class="qty-hint">${p.minOrder}${p.unit}起批</span>
      </div>
      <div class="sheet-subtotal">小计 <strong id="sheet-subtotal">${api.formatPrice(getSheetTotalPrice())}</strong></div>`;
  }

  function updateSpecSheetUI() {
    const p = api.getProduct(state.currentProductId);
    if (!p) return;
    const thumb = p.images[state.galleryIndex] || p.image;
    $('#sheet-thumb').src = thumb;
    $('#sheet-price').textContent = `${api.formatPrice(p.price)}/${p.unit}`;
    $('#sheet-stock').textContent = `库存充足 · ${p.minOrder}${p.unit}起批`;
    const qtyEl = $('#sheet-qty-num');
    if (qtyEl) qtyEl.textContent = state.sheetQty;
    const subtotalEl = $('#sheet-subtotal');
    if (subtotalEl) subtotalEl.textContent = api.formatPrice(getSheetTotalPrice());
    $$('#sheet-body .spec-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.spec === state.selectedSpec);
    });
    const labels = { select: '确定', cart: '加入进货单', buy: '立即下单' };
    const confirmBtn = $('#sheet-confirm');
    if (confirmBtn) confirmBtn.textContent = labels[state.sheetIntent] || '确定';
  }

  function openSpecSheet(intent = 'select') {
    const p = api.getProduct(state.currentProductId);
    if (!p) return;
    state.sheetIntent = intent;
    state.sheetQty = Math.max(p.minOrder, state.sheetQty || p.minOrder);
    if (!p.specs.includes(state.selectedSpec)) {
      state.selectedSpec = p.specs[0] || '默认';
    }
    renderSpecSheetBody();
    updateSpecSheetUI();
    $('#sheet-mask').classList.remove('hidden');
    document.body.classList.add('sheet-open');
  }

  function closeSpecSheet() {
    $('#sheet-mask').classList.add('hidden');
    document.body.classList.remove('sheet-open');
  }

  function adjustSheetQty(delta) {
    const p = api.getProduct(state.currentProductId);
    if (!p) return;
    const step = p.minOrder >= 100 ? 10 : 1;
    const next = state.sheetQty + delta * step;
    state.sheetQty = Math.max(p.minOrder, next);
    updateSpecSheetUI();
  }

  function addToCart(productId, qty, spec) {
    api.addToCart(productId, qty, spec);
    updateCartBadges();
    renderCart();
  }

  function confirmSpecSheet() {
    const p = api.getProduct(state.currentProductId);
    if (!p) return;
    updateSelectedSpecDisplay();
    closeSpecSheet();

    if (state.sheetIntent === 'cart') {
      addToCart(p.id, state.sheetQty, state.selectedSpec);
      showToast(`已加入进货单 · ${state.selectedSpec} ×${state.sheetQty}${p.unit}`);
      return;
    }

    if (state.sheetIntent === 'buy') {
      state.checkoutSource = 'buy';
      pushScreen('screen-checkout', () => renderCheckout());
      return;
    }

    showToast(`已选：${state.selectedSpec}，${state.sheetQty}${p.unit}`);
  }

  function openCartCheckout() {
    const items = api.getCartLineItems();
    if (!items.length) {
      showToast('进货单是空的');
      return;
    }
    state.checkoutSource = 'cart';
    state.currentProductId = items[0].productId;
    state.selectedSpec = items[0].spec;
    state.sheetQty = items[0].qty;
    pushScreen('screen-checkout', () => renderCheckout());
  }

  function renderCheckout() {
    if (state.checkoutSource === 'cart') {
      renderCartCheckout();
      return;
    }

    const p = api.getProduct(state.currentProductId);
    if (!p) return;
    const shop = api.getShop(p.shopId);
    const total = getSheetTotalPrice();

    $('#checkout-content').innerHTML = `
      <div class="checkout-address">
        <div class="checkout-addr-icon">📍</div>
        <div class="checkout-addr-info">
          <div class="checkout-addr-name">张先生 138****6688</div>
          <div class="checkout-addr-text">浙江省金华市义乌市稠州北路999号 · 义乌国际商贸城</div>
        </div>
        <span class="cell-arrow">›</span>
      </div>
      <div class="checkout-shop-bar">
        <span class="checkout-shop-name">${shop?.name || p.shop}</span>
        <span class="checkout-shop-tag">实体认证</span>
      </div>
      <div class="checkout-item">
        <img src="${p.images[0] || p.image}" alt="" />
        <div class="checkout-item-info">
          <div class="checkout-item-name">${p.name}</div>
          <div class="checkout-item-spec">${state.selectedSpec}</div>
          <div class="checkout-item-bottom">
            <span class="checkout-item-price">${api.formatPrice(p.price)}</span>
            <span class="checkout-item-qty">×${state.sheetQty}</span>
          </div>
        </div>
      </div>
      <div class="checkout-cells">
        <div class="checkout-cell"><span>配送方式</span><span>快递免运费</span></div>
        <div class="checkout-cell"><span>预计发货</span><span>48小时内</span></div>
        <div class="checkout-cell"><span>买家留言</span><span class="muted">选填 ›</span></div>
      </div>
      <div class="checkout-summary">
        <span>共 ${state.sheetQty}${p.unit}，合计</span>
        <strong>${api.formatPrice(total)}</strong>
      </div>`;

    $('#checkout-footer').innerHTML = `
      <div class="checkout-total">应付 <strong>${api.formatPrice(total)}</strong></div>
      <button type="button" class="btn-primary checkout-submit" data-action="submit-order">提交订单</button>`;

    $('#sub-title').textContent = '确认订单';
  }

  function renderCartCheckout() {
    const items = api.getCartLineItems();
    if (!items.length) return;
    const total = items.reduce((sum, item) => sum + item.sub, 0);
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

    $('#checkout-content').innerHTML = `
      <div class="checkout-address">
        <div class="checkout-addr-icon">📍</div>
        <div class="checkout-addr-info">
          <div class="checkout-addr-name">张先生 138****6688</div>
          <div class="checkout-addr-text">浙江省金华市义乌市稠州北路999号 · 义乌国际商贸城</div>
        </div>
        <span class="cell-arrow">›</span>
      </div>
      ${items
        .map((item) => {
          const shop = api.getShop(item.product.shopId);
          return `
      <div class="checkout-shop-bar">
        <span class="checkout-shop-name">${shop?.name || item.product.shop}</span>
        <span class="checkout-shop-tag">实体认证</span>
      </div>
      <div class="checkout-item">
        <img src="${item.product.images[0] || item.product.image}" alt="" />
        <div class="checkout-item-info">
          <div class="checkout-item-name">${item.product.name}</div>
          <div class="checkout-item-spec">${item.spec}</div>
          <div class="checkout-item-bottom">
            <span class="checkout-item-price">${api.formatPrice(item.product.price)}</span>
            <span class="checkout-item-qty">×${item.qty}</span>
          </div>
        </div>
      </div>`;
        })
        .join('')}
      <div class="checkout-cells">
        <div class="checkout-cell"><span>配送方式</span><span>快递免运费</span></div>
        <div class="checkout-cell"><span>预计发货</span><span>48小时内</span></div>
        <div class="checkout-cell"><span>买家留言</span><span class="muted">选填 ›</span></div>
      </div>
      <div class="checkout-summary">
        <span>共 ${totalQty} 件，合计</span>
        <strong>${api.formatPrice(total)}</strong>
      </div>`;

    $('#checkout-footer').innerHTML = `
      <div class="checkout-total">应付 <strong>${api.formatPrice(total)}</strong></div>
      <button type="button" class="btn-primary checkout-submit" data-action="submit-order">提交订单</button>`;

    $('#sub-title').textContent = '确认订单';
  }

  function submitOrder() {
    if (state.checkoutSource === 'cart') {
      const items = api.getCartLineItems();
      if (!items.length) return;
      const total = items.reduce((sum, item) => sum + item.sub, 0);
      api.createOrder({ total, items: items.length });
      api.clearCart();
      updateCartBadges();
      renderCart();
      renderProfile();
      showToast('订单提交成功 · 请完成付款');
      setTimeout(() => {
        while (state.stack.length) popScreen();
        showTab('profile');
      }, 800);
      return;
    }

    const p = api.getProduct(state.currentProductId);
    if (!p) return;
    const total = getSheetTotalPrice();
    addToCart(p.id, state.sheetQty, state.selectedSpec);
    api.createOrder({ total, items: 1 });
    renderProfile();
    showToast('订单提交成功 · 请完成付款');
    setTimeout(() => {
      while (state.stack.length) popScreen();
      showTab('profile');
    }, 1200);
  }

  function goCartTab() {
    closeSpecSheet();
    while (state.stack.length) popScreen();
    showTab('cart');
  }

  function sortListProducts(products, sort, priceAsc) {
    const list = [...products];
    if (sort === 'sales') {
      list.sort((a, b) => {
        const sa = parseFloat(String(a.sales).replace(/[^\d.]/g, '')) || 0;
        const sb = parseFloat(String(b.sales).replace(/[^\d.]/g, '')) || 0;
        return sb - sa;
      });
    } else if (sort === 'price') {
      list.sort((a, b) => (priceAsc ? a.price - b.price : b.price - a.price));
    }
    return list;
  }

  function applyListSort(sort) {
    if (sort === 'more') {
      showToast('筛选 · 静态演示');
      return;
    }
    if (sort === 'price' && state.listSort === 'price') {
      state.listPriceAsc = !state.listPriceAsc;
    } else {
      state.listPriceAsc = true;
    }
    state.listSort = sort;
    $$('#list-filter-bar .filter-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.filter === sort);
    });
    const priceItem = $('#list-filter-bar .filter-item[data-filter="price"]');
    if (priceItem) {
      const arrow = priceItem.querySelector('.sort-arrow');
      if (arrow) {
        arrow.textContent = state.listSort === 'price' ? (state.listPriceAsc ? '↑' : '↓') : '↕';
      }
    }
    const sorted = sortListProducts(state.listProducts, state.listSort, state.listPriceAsc);
    renderProductGrid('#list-products', sorted.length ? sorted : api.getProducts({ limit: 4 }));
  }

  function initProductGallery(total) {
    const track = $('#gallery-track');
    if (!track || total <= 0) return;

    let index = 0;

    const syncUI = (i) => {
      index = i;
      state.galleryIndex = i;
      $('#gallery-counter').textContent = `${i + 1} / ${total}`;
      $$('.gallery-dot').forEach((dot, di) => dot.classList.toggle('active', di === i));
      $$('.gallery-thumb').forEach((thumb, ti) => thumb.classList.toggle('active', ti === i));
    };

    const scrollToIndex = (i, smooth = true) => {
      const next = Math.max(0, Math.min(total - 1, i));
      const slide = track.children[next];
      if (!slide) return;
      track.scrollTo({ left: slide.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
      syncUI(next);
    };

    track.addEventListener(
      'scroll',
      () => {
        const width = track.clientWidth || 1;
        const next = Math.round(track.scrollLeft / width);
        if (next !== index) syncUI(next);
      },
      { passive: true },
    );

    $('#gallery-pagination')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.gallery-dot');
      if (!dot) return;
      scrollToIndex(+dot.dataset.index);
    });

    $('#gallery-thumbs')?.addEventListener('click', (e) => {
      const thumb = e.target.closest('.gallery-thumb');
      if (!thumb) return;
      scrollToIndex(+thumb.dataset.index);
    });

    syncUI(0);
  }

  function renderShop(shopId) {
    const shop = api.getShop(shopId);
    if (!shop) return;
    const products = api.getProductsByShop(shopId);

    $('#shop-content').innerHTML = `
      <div class="shop-banner-wrap">
        ${FLOAT_NAV_HTML}
        <div class="shop-banner"><img src="${shop.banner}" alt="${shop.name}" /></div>
      </div>
      <div class="shop-header-card">
        <div class="shop-avatar-lg"><img src="${shop.avatar}" alt="" loading="lazy" /></div>
        <div class="shop-header-info">
          <div class="shop-title">${shop.name}</div>
          <div class="shop-sub">${shop.market} · ${shop.booth}</div>
          <div class="shop-tags-row">${shop.tags.map((t) => `<span class="stag">${t}</span>`).join('')}</div>
        </div>
        <button type="button" class="btn-follow" data-action="toast" data-msg="已关注店铺">+ 关注</button>
      </div>
      <div class="shop-info-bar">
        <div><strong>${shop.rating}</strong><span>评分</span></div>
        <div><strong>${shop.followers}</strong><span>粉丝</span></div>
        <div><strong>${shop.products}</strong><span>商品</span></div>
        <div><strong>${shop.years}年</strong><span>经营</span></div>
      </div>
      <div class="shop-desc-bar">
        <span>360°全景看店</span>
        <button type="button" data-action="toast" data-msg="360°全景 · 静态演示">立即查看 ›</button>
      </div>
      <p class="shop-desc-text">${shop.desc}</p>
      <div class="shop-tabs">
        <button type="button" class="shop-tab active" data-action="toast" data-msg="全部商品">全部</button>
        <button type="button" class="shop-tab" data-action="toast" data-msg="新品">新品</button>
        <button type="button" class="shop-tab" data-action="toast" data-msg="热销">热销</button>
        <button type="button" class="shop-tab" data-action="toast" data-msg="视频看货">视频看货</button>
      </div>
      <div class="product-grid shop-product-grid" id="shop-products"></div>`;

    renderProductGrid('#shop-products', products.length ? products : api.getProducts({ limit: 4 }));
    $('#sub-title').textContent = shop.name;
  }

  function renderList(title, categoryId) {
    $('#sub-title').textContent = title || '商品列表';
    let products = categoryId
      ? api.getProducts({ categoryId })
      : api.getProducts();
    if (title && products.length > 1) {
      const narrowed = products.filter((p) => p.name.includes(title) || title.includes(p.name.slice(0, 2)));
      if (narrowed.length) products = narrowed;
    }
    state.listProducts = products.length ? products : api.getProducts({ limit: 4 });
    state.listSort = 'default';
    state.listPriceAsc = true;
    $$('#list-filter-bar .filter-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.filter === 'default');
    });
    const arrow = $('#list-filter-bar .sort-arrow');
    if (arrow) arrow.textContent = '↕';
    renderProductGrid('#list-products', state.listProducts);
  }

  function restoreSubHeader() {
    const header = $('#sub-header');
    header.innerHTML = `
      ${BACK_BTN_MINIMAL}
      <span class="title" id="sub-title">详情</span>`;
    bindBackBtn();
  }

  function setHeaderMode(mode, headerStyle = 'bar') {
    const isMain = mode === 'main';
    const sub = $('#sub-header');
    const app = $('#app');

    $('#main-header').style.display = isMain ? 'flex' : 'none';
    $('#tab-bar').style.display = isMain ? 'flex' : 'none';
    $('#main-content').classList.toggle('no-tab', !isMain);
    app.classList.toggle('immersive-page', !isMain && headerStyle === 'immersive');

    if (isMain) {
      updateMainHeaderForTab(state.tab);
      sub.style.display = 'none';
      sub.classList.remove('immersive');
      restoreSubHeader();
      return;
    }

    $('#main-header').style.display = 'none';

    if (headerStyle === 'immersive') {
      sub.style.display = 'none';
    } else {
      sub.style.display = 'flex';
      sub.classList.remove('immersive');
      if (!$('#back-btn')) restoreSubHeader();
    }
  }

  function showTab(tab) {
    state.tab = tab;
    state.stack = [];
    setHeaderMode('main');

    $$('.screen').forEach((s) => s.classList.remove('active'));
    $(`#${TAB_SCREENS[tab]}`).classList.add('active');

    $$('.tab-item').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));

    if (tab === 'category') {
      renderCategorySidebar();
    }
    if (tab === 'cart') renderCart();
    if (tab === 'profile') renderProfile();

    updateMainHeaderForTab(tab);
    resetScreenScroll($(`#${TAB_SCREENS[tab]}`));
  }

  function pushScreen(screenId, renderFn, headerStyle = 'bar') {
    const current = $('.screen.active');
    if (current) state.stack.push(current.id);
    $$('.screen').forEach((s) => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
    setHeaderMode('sub', headerStyle);
    if (renderFn) renderFn();
    resetScreenScroll($(`#${screenId}`));
  }

  function headerStyleForScreen(screenId) {
    return screenId === 'screen-detail' || screenId === 'screen-shop' ? 'immersive' : 'bar';
  }

  function popScreen() {
    closeSpecSheet();
    teardownDetailScroll();
    if (!state.stack.length) {
      showTab(state.tab);
      return;
    }
    const prevId = state.stack.pop();
    $$('.screen').forEach((s) => s.classList.remove('active'));
    $(`#${prevId}`).classList.add('active');

    if (SUB_SCREENS.includes(prevId)) {
      setHeaderMode('sub', headerStyleForScreen(prevId));
    } else {
      setHeaderMode('main');
      updateMainHeaderForTab(state.tab);
      $$('.tab-item').forEach((t) => t.classList.toggle('active', t.dataset.tab === state.tab));
    }
    resetScreenScroll(getActiveScreen());
  }

  function openSearch() {
    pushScreen('screen-search', () => {
      renderSearch();
      $('#sub-title').textContent = '搜索';
      const input = $('#search-input');
      input.value = state.searchQuery;
      input.oninput = (e) => doSearch(e.target.value.trim());
      setTimeout(() => input.focus(), 300);
    });
  }

  function bindBackBtn() {
    const btn = $('#back-btn');
    if (btn) btn.onclick = popScreen;
  }

  function initPromoImages() {
    const products = api.getProducts();
    $('#promo-img-1').src = products[0].image;
    $('#promo-img-2').src = products[4].image;
  }

  function handleAppClick(e) {
    // Banner 自己处理跳转；避免与全局商品点击冲突
    if (e.target.closest('#banner-swiper')) return;

    const activeScreen = $('.screen.active');
    if (!activeScreen) return;

    const productEl = e.target.closest('[data-product]');
    if (productEl && activeScreen.contains(productEl)) {
      pushScreen('screen-detail', () => renderDetail(productEl.dataset.product), 'immersive');
      return;
    }

    const shopBar = e.target.closest('[data-shop]');
    if (shopBar && activeScreen.contains(shopBar)) {
      pushScreen('screen-shop', () => renderShop(shopBar.dataset.shop), 'immersive');
      return;
    }

    if (e.target.closest('[data-action="back"]')) {
      popScreen();
      return;
    }

    const homeCat = e.target.closest('#screen-home .category-item[data-category]');
    if (homeCat) {
      openCategoryTab(homeCat.dataset.category);
      return;
    }

    const sideItem = e.target.closest('#screen-category .side-item[data-category-id]');
    if (sideItem) {
      state.categoryIndex = getCategoryIndex(sideItem.dataset.categoryId);
      renderCategorySidebar();
      $('#category-main').scrollTop = 0;
      return;
    }

    const listBtn = e.target.closest('[data-action="list"]');
    if (listBtn && activeScreen.contains(listBtn)) {
      pushScreen('screen-list', () =>
        renderList(listBtn.dataset.title, listBtn.dataset.listCategory),
      );
      return;
    }

    const kw = e.target.closest('[data-keyword]');
    if (kw && activeScreen.contains(kw)) {
      doSearch(kw.dataset.keyword);
      return;
    }

    const toastEl = e.target.closest('[data-action="toast"]');
    if (toastEl) {
      showToast(toastEl.dataset.msg);
      return;
    }

    if (e.target.closest('[data-action="nav-shop"]') && state.currentProductId) {
      const p = api.getProduct(state.currentProductId);
      if (p) pushScreen('screen-shop', () => renderShop(p.shopId), 'immersive');
      return;
    }

    if (e.target.closest('[data-action="open-spec"]')) {
      const trigger = e.target.closest('[data-action="open-spec"]');
      openSpecSheet(trigger?.dataset.intent || 'select');
      return;
    }

    if (e.target.closest('[data-action="close-sheet"]')) {
      closeSpecSheet();
      return;
    }

    if (e.target.closest('[data-action="confirm-spec"]')) {
      confirmSpecSheet();
      return;
    }

    if (e.target.closest('[data-action="sheet-qty-minus"]')) {
      adjustSheetQty(-1);
      return;
    }

    if (e.target.closest('[data-action="sheet-qty-plus"]')) {
      adjustSheetQty(1);
      return;
    }

    if (e.target.closest('[data-action="go-cart"]')) {
      goCartTab();
      return;
    }

    if (e.target.closest('[data-action="go-checkout"]')) {
      openCartCheckout();
      return;
    }

    if (e.target.closest('[data-action="submit-order"]')) {
      submitOrder();
      return;
    }

    if (e.target.closest('[data-action="toggle-login"]')) {
      toggleLogin();
      return;
    }

    if (e.target.closest('[data-action="orders-all"]')) {
      openOrdersList('');
      return;
    }

    const orderFilterBtn = e.target.closest('[data-action="orders-filter"]');
    if (orderFilterBtn) {
      const status = orderFilterBtn.dataset.status;
      if (activeScreen?.id === 'screen-orders') {
        renderOrdersList(status === '全部' ? '' : status);
      } else {
        openOrdersList(status === '全部' ? '' : status);
      }
      return;
    }

    if (e.target.closest('[data-action="go-home"]')) {
      showTab('home');
      return;
    }

    if (e.target.closest('[data-action="clear-history"]')) {
      state.searchHistory = [];
      renderSearchHistory();
      showToast('已清空搜索历史');
      return;
    }

    const specInSheet = e.target.closest('[data-spec]');
    if (specInSheet) {
      state.selectedSpec = specInSheet.dataset.spec;
      specInSheet.parentElement.querySelectorAll('.spec-btn').forEach((b) => b.classList.remove('active'));
      specInSheet.classList.add('active');
      return;
    }

    const stickyTab = e.target.closest('.sticky-tab');
    if (stickyTab?.dataset.anchor) {
      scrollToDetailSection(stickyTab.dataset.anchor);
      return;
    }

    const filterItem = e.target.closest('#list-filter-bar .filter-item[data-filter]');
    if (filterItem && activeScreen.id === 'screen-list') {
      applyListSort(filterItem.dataset.filter);
    }
  }

  function bindEvents() {
    $$('.tab-item').forEach((tab) => {
      tab.addEventListener('click', () => showTab(tab.dataset.tab));
    });

    $('#open-search').addEventListener('click', openSearch);
    const backBtn = $('#back-btn');
    if (backBtn) backBtn.addEventListener('click', popScreen);

    document.addEventListener('click', handleAppClick);

    $('#sheet-mask')?.addEventListener('click', (e) => {
      if (e.target.id === 'sheet-mask') closeSpecSheet();
    });

    $('.sticky-back')?.addEventListener('click', popScreen);
  }

  function init() {
    renderBanners();
    renderQuickEntries();
    renderHomeCategories();
    renderProductGrid('#home-products', api.getProducts());
    renderMarkets();
    renderCart();
    renderProfile();
    initPromoImages();
    updateCartBadges();
    updateMainHeaderForTab('home');
    bindEvents();
    bindBackBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

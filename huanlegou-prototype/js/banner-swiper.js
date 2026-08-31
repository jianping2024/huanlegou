/**
 * 首页 Banner — Swiper 封装（无限循环 / 自动播放 / 指示点 / 点击跳转）
 * 依赖 vendor/swiper/swiper-bundle.min.js
 *
 * 跳转模型对齐义乌购：每张 Banner 带 link（list / shop / product / toast），
 * 由 mount 的 onNavigate 回调交给业务层处理。
 */
(function () {
  'use strict';

  const AUTO_MS = 4000;
  const TRANSITION_MS = 520;

  function slideHtml(b) {
    return `
      <div class="swiper-slide banner-slide" data-banner-id="${b.id}" role="button" tabindex="0">
        <div class="banner-bg" style="background-image:url('${b.image}')"></div>
        <div class="banner-overlay">
          <div class="banner-title">${b.title}</div>
          <div class="banner-sub">${b.subtitle}</div>
        </div>
      </div>`;
  }

  function BannerSwiperInstance(wrap, banners, options) {
    this.wrap = wrap;
    this.banners = banners;
    this.onNavigate = typeof options?.onNavigate === 'function' ? options.onNavigate : null;
    this.swiper = null;
  }

  BannerSwiperInstance.prototype.emitNavigate = function (banner) {
    if (!banner || !this.onNavigate) return;
    this.onNavigate(banner);
  };

  BannerSwiperInstance.prototype.syncKenBurns = function () {
    this.wrap.querySelectorAll('.banner-slide').forEach((slide) => {
      slide.classList.remove('is-active');
    });
    const active = this.wrap.querySelector('.swiper-slide-active.banner-slide');
    if (active) active.classList.add('is-active');
  };

  BannerSwiperInstance.prototype.bindSingleClick = function () {
    const slide = this.wrap.querySelector('.banner-slide');
    if (!slide) return;
    this._onSingleClick = (e) => {
      e.stopPropagation();
      setTimeout(() => this.emitNavigate(this.banners[0]), 0);
    };
    slide.addEventListener('click', this._onSingleClick);
  };

  BannerSwiperInstance.prototype.mount = function () {
    const count = this.banners.length;

    if (!count) {
      this.wrap.innerHTML = '';
      return;
    }

    if (count === 1) {
      this.wrap.innerHTML = `
        <div class="banner-swiper-inner">
          <div class="swiper-wrapper">${slideHtml(this.banners[0])}</div>
          <div class="banner-dots"><span class="active"></span></div>
        </div>`;
      this.wrap.querySelector('.banner-slide')?.classList.add('is-active');
      this.bindSingleClick();
      return;
    }

    this.wrap.innerHTML = `
      <div class="banner-swiper-inner swiper">
        <div class="swiper-wrapper">
          ${this.banners.map(slideHtml).join('')}
        </div>
        <div class="banner-dots swiper-pagination"></div>
      </div>`;

    const root = this.wrap.querySelector('.banner-swiper-inner');

    this.swiper = new Swiper(root, {
      loop: true,
      speed: TRANSITION_MS,
      effect: 'cube',
      cubeEffect: {
        slideShadows: true,
        shadow: true,
        shadowOffset: 24,
        shadowScale: 0.92,
      },
      // 更容易翻页，减少「半拖弹回」触发 cube animating 卡住的概率
      threshold: 3,
      longSwipesRatio: 0.22,
      longSwipesMs: 280,
      shortSwipes: true,
      grabCursor: true,
      touchStartPreventDefault: false,
      autoplay: {
        delay: AUTO_MS,
        disableOnInteraction: false,
      },
      pagination: {
        el: root.querySelector('.banner-dots'),
        clickable: true,
        bulletClass: 'banner-dot',
        bulletActiveClass: 'active',
        renderBullet(index, className) {
          return `<span class="${className}" data-index="${index}"></span>`;
        },
      },
      on: {
        init: () => this.syncKenBurns(),
        slideChangeTransitionStart: () => this.syncKenBurns(),
        touchStart: () => this.wrap.classList.add('is-dragging'),
        touchEnd: () => this.wrap.classList.remove('is-dragging'),
        transitionEnd: () => this.syncKenBurns(),
        // Swiper 在滑动后会抑制 click；只有真正点击才触发。
        // 必须异步跳转：若在 touchEnd/click 同步 pushScreen，后续 click 会落到新页商品卡上误开详情。
        click: (swiper, event) => {
          if (event.target.closest('.banner-dots, .banner-dot')) return;
          event.stopPropagation?.();
          const slide = swiper.clickedSlide;
          const bannerId = slide?.getAttribute?.('data-banner-id');
          const banner =
            (bannerId && this.banners.find((b) => String(b.id) === String(bannerId))) ||
            this.banners[swiper.realIndex];
          const target = banner;
          setTimeout(() => this.emitNavigate(target), 0);
        },
      },
    });
  };

  BannerSwiperInstance.prototype.destroy = function () {
    if (this._onSingleClick) {
      this.wrap.querySelector('.banner-slide')?.removeEventListener('click', this._onSingleClick);
      this._onSingleClick = null;
    }
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    this.wrap.classList.remove('is-dragging');
    this.wrap.innerHTML = '';
  };

  window.BannerSwiper = {
    _active: null,
    mount(wrap, banners, options) {
      if (!wrap) return null;
      if (typeof Swiper === 'undefined') {
        console.error('[BannerSwiper] Swiper 未加载，请检查 vendor/swiper/swiper-bundle.min.js');
        return null;
      }
      if (this._active) this._active.destroy();
      const inst = new BannerSwiperInstance(wrap, banners, options);
      inst.mount();
      this._active = inst;
      return inst;
    },
  };
})();

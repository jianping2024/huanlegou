/**
 * 首页 Banner — Swiper 封装（无限循环 / 自动播放 / 指示点）
 * 依赖 vendor/swiper/swiper-bundle.min.js
 */
(function () {
  'use strict';

  const AUTO_MS = 4000;
  const TRANSITION_MS = 520;

  function slideHtml(b) {
    return `
      <div class="swiper-slide banner-slide">
        <div class="banner-bg" style="background-image:url('${b.image}')"></div>
        <div class="banner-overlay">
          <div class="banner-title">${b.title}</div>
          <div class="banner-sub">${b.subtitle}</div>
        </div>
      </div>`;
  }

  function BannerSwiperInstance(wrap, banners) {
    this.wrap = wrap;
    this.banners = banners;
    this.swiper = null;
  }

  BannerSwiperInstance.prototype.syncKenBurns = function () {
    this.wrap.querySelectorAll('.banner-slide').forEach((slide) => {
      slide.classList.remove('is-active');
    });
    const active = this.wrap.querySelector('.swiper-slide-active.banner-slide');
    if (active) active.classList.add('is-active');
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
      },
    });
  };

  BannerSwiperInstance.prototype.destroy = function () {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    this.wrap.classList.remove('is-dragging');
    this.wrap.innerHTML = '';
  };

  window.BannerSwiper = {
    _active: null,
    mount(wrap, banners) {
      if (!wrap) return null;
      if (typeof Swiper === 'undefined') {
        console.error('[BannerSwiper] Swiper 未加载，请检查 vendor/swiper/swiper-bundle.min.js');
        return null;
      }
      if (this._active) this._active.destroy();
      const inst = new BannerSwiperInstance(wrap, banners);
      inst.mount();
      this._active = inst;
      return inst;
    },
  };
})();

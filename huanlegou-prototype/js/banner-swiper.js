/**
 * 首页 Banner — 唯一实现：clone 无限循环 + 拖动/snap 3D 转场
 *
 * 手势：touch 优先（Android WebView 可靠），pointer 仅用于鼠标。
 * touch-action:none，避免浏览器抢走横滑。
 */
(function () {
  'use strict';

  const AUTO_MS = 4000;
  const SWIPE_THRESHOLD = 0.16;
  const AXIS_LOCK_PX = 6;
  const TRANSITION =
    'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease';

  function slideHtml(b) {
    return `
      <div class="banner-slide">
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
    this.count = banners.length;
    this.trackIndex = 1;
    this.logicalIndex = 0;
    this.width = 0;
    this.dragX = 0;
    this.dragging = false;
    this.startX = 0;
    this.startY = 0;
    this.axis = null; // 'x' | 'y' | null
    this.timer = null;
    this.usingTouch = false;
    this.onTransitionEnd = this.handleTransitionEnd.bind(this);

    this.render();
    this.bind();
    this.applyTransform({ animate: false, dragging: false });
    this.startAuto();
  }

  BannerSwiperInstance.prototype.render = function () {
    if (!this.count) {
      this.wrap.innerHTML = '';
      return;
    }

    if (this.count === 1) {
      this.wrap.innerHTML = `
        <div class="banner-track">${slideHtml(this.banners[0])}</div>
        <div class="banner-dots"><span class="active" data-index="0"></span></div>`;
    } else {
      const last = this.banners[this.count - 1];
      const first = this.banners[0];
      this.wrap.innerHTML = `
        <div class="banner-track">
          ${slideHtml(last)}
          ${this.banners.map(slideHtml).join('')}
          ${slideHtml(first)}
        </div>
        <div class="banner-dots">${this.banners
          .map((_, i) => `<span data-index="${i}" class="${i === 0 ? 'active' : ''}"></span>`)
          .join('')}</div>`;
    }

    this.track = this.wrap.querySelector('.banner-track');
    this.slides = this.track ? [...this.track.querySelectorAll('.banner-slide')] : [];
    this.trackIndex = this.count === 1 ? 0 : 1;
    this.logicalIndex = 0;
  };

  BannerSwiperInstance.prototype.logicalToTrack = function (logical) {
    return logical + 1;
  };

  BannerSwiperInstance.prototype.trackToLogical = function (trackIndex) {
    if (this.count <= 1) return 0;
    if (trackIndex === 0) return this.count - 1;
    if (trackIndex === this.count + 1) return 0;
    return trackIndex - 1;
  };

  BannerSwiperInstance.prototype.updateDots = function () {
    this.wrap.querySelectorAll('.banner-dots span').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.logicalIndex);
    });
  };

  BannerSwiperInstance.prototype.applySlideEffects = function (offset, dragging) {
    if (!this.width || !this.slides.length) return;

    this.slides.forEach((slide, i) => {
      const slideLeft = i * this.width + offset;
      const progress = -slideLeft / this.width;
      const clamped = Math.max(-1.25, Math.min(1.25, progress));
      const scale = 1 - Math.abs(clamped) * 0.1;
      const rotateY = clamped * -12;
      const opacity = Math.max(0.45, 1 - Math.abs(clamped) * 0.45);

      slide.style.transition = dragging ? 'none' : TRANSITION;
      slide.style.transform = `scale(${scale}) rotateY(${rotateY}deg)`;
      slide.style.opacity = String(opacity);
      slide.classList.toggle('is-active', Math.abs(progress) < 0.35);
    });
  };

  BannerSwiperInstance.prototype.applyTransform = function ({
    animate = true,
    dragging = false,
    dragPx = 0,
  } = {}) {
    if (!this.track) return;

    this.width = this.wrap.offsetWidth;
    if (!this.width) return;

    const offset = -this.trackIndex * this.width + dragPx;
    this.track.style.transition =
      dragging || !animate ? 'none' : 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1)';
    this.track.classList.toggle('is-dragging', dragging);
    this.wrap.classList.toggle('is-dragging', dragging);
    this.track.style.transform = `translate3d(${offset}px, 0, 0)`;

    this.logicalIndex = this.trackToLogical(this.trackIndex);
    this.updateDots();
    this.applySlideEffects(offset, dragging);
  };

  BannerSwiperInstance.prototype.handleTransitionEnd = function (e) {
    if (e.target !== this.track || e.propertyName !== 'transform') return;
    if (this.count <= 1) return;

    if (this.trackIndex === this.count + 1) {
      this.track.removeEventListener('transitionend', this.onTransitionEnd);
      this.trackIndex = 1;
      this.logicalIndex = 0;
      this.applyTransform({ animate: false, dragging: false });
    } else if (this.trackIndex === 0) {
      this.track.removeEventListener('transitionend', this.onTransitionEnd);
      this.trackIndex = this.count;
      this.logicalIndex = this.count - 1;
      this.applyTransform({ animate: false, dragging: false });
    }
  };

  BannerSwiperInstance.prototype.goToTrack = function (trackIndex, animate) {
    if (this.count <= 1) return;
    this.trackIndex = trackIndex;
    this.logicalIndex = this.trackToLogical(trackIndex);
    this.applyTransform({ animate, dragging: false });

    if (animate && (trackIndex === 0 || trackIndex === this.count + 1)) {
      this.track.addEventListener('transitionend', this.onTransitionEnd);
    }
  };

  BannerSwiperInstance.prototype.goToLogical = function (logical, animate = true) {
    if (this.count <= 1) return;
    this.goToTrack(this.logicalToTrack(logical), animate);
  };

  BannerSwiperInstance.prototype.goNext = function (animate = true) {
    if (this.count <= 1) return;
    this.goToTrack(this.trackIndex + 1, animate);
  };

  BannerSwiperInstance.prototype.goPrev = function (animate = true) {
    if (this.count <= 1) return;
    this.goToTrack(this.trackIndex - 1, animate);
  };

  BannerSwiperInstance.prototype.stopAuto = function () {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  };

  BannerSwiperInstance.prototype.startAuto = function () {
    this.stopAuto();
    if (this.count <= 1) return;
    this.timer = setInterval(() => this.goNext(true), AUTO_MS);
  };

  BannerSwiperInstance.prototype.beginDrag = function (x, y) {
    this.stopAuto();
    this.track.removeEventListener('transitionend', this.onTransitionEnd);
    this.dragging = true;
    this.axis = null;
    this.startX = x;
    this.startY = y;
    this.dragX = 0;
    this.applyTransform({ animate: false, dragging: true });
  };

  BannerSwiperInstance.prototype.moveDrag = function (x, y, event) {
    if (!this.dragging) return;

    const dx = x - this.startX;
    const dy = y - this.startY;

    if (!this.axis) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      this.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      if (this.axis === 'y') {
        // 交给页面纵向滚动，本轮不再接管
        this.dragging = false;
        this.wrap.classList.remove('is-dragging');
        this.track.classList.remove('is-dragging');
        this.applyTransform({ animate: false, dragging: false });
        this.startAuto();
        return;
      }
    }

    if (this.axis !== 'x') return;
    if (event) event.preventDefault();

    this.dragX = dx;
    this.applyTransform({ animate: false, dragging: true, dragPx: this.dragX });
  };

  BannerSwiperInstance.prototype.endDrag = function () {
    if (!this.dragging) return;
    this.dragging = false;

    if (this.axis === 'x') {
      const threshold = this.width * SWIPE_THRESHOLD;
      if (this.dragX < -threshold) this.goNext(true);
      else if (this.dragX > threshold) this.goPrev(true);
      else this.applyTransform({ animate: true, dragging: false });
    } else {
      this.applyTransform({ animate: false, dragging: false });
    }

    this.dragX = 0;
    this.axis = null;
    this.startAuto();
  };

  BannerSwiperInstance.prototype.bind = function () {
    this.onTouchStart = (e) => {
      if (this.count <= 1) return;
      if (e.target.closest('.banner-dots')) return;
      if (e.touches.length !== 1) return;
      this.usingTouch = true;
      const t = e.touches[0];
      this.beginDrag(t.clientX, t.clientY);
    };

    this.onTouchMove = (e) => {
      if (!this.usingTouch || !this.dragging) return;
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      this.moveDrag(t.clientX, t.clientY, e);
    };

    this.onTouchEnd = () => {
      if (!this.usingTouch) return;
      this.usingTouch = false;
      this.endDrag();
    };

    this.onPointerDown = (e) => {
      if (this.count <= 1) return;
      if (e.pointerType === 'touch') return; // touch 走 touch 事件
      if (e.target.closest('.banner-dots')) return;
      this.usingTouch = false;
      this.beginDrag(e.clientX, e.clientY);
    };

    this.onPointerMove = (e) => {
      if (this.usingTouch || e.pointerType === 'touch') return;
      if (!this.dragging) return;
      this.moveDrag(e.clientX, e.clientY, e);
    };

    this.onPointerUp = (e) => {
      if (this.usingTouch || e.pointerType === 'touch') return;
      this.endDrag();
    };

    this.onResizeBound = () => this.applyTransform({ animate: false, dragging: false });

    this.wrap.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.wrap.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.wrap.addEventListener('touchend', this.onTouchEnd);
    this.wrap.addEventListener('touchcancel', this.onTouchEnd);

    this.wrap.addEventListener('pointerdown', this.onPointerDown);
    this.wrap.addEventListener('pointermove', this.onPointerMove);
    this.wrap.addEventListener('pointerup', this.onPointerUp);
    this.wrap.addEventListener('pointercancel', this.onPointerUp);
    window.addEventListener('resize', this.onResizeBound);

    this.wrap.querySelectorAll('.banner-dots span').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const i = Number(dot.dataset.index);
        if (Number.isNaN(i)) return;
        this.stopAuto();
        this.track.removeEventListener('transitionend', this.onTransitionEnd);
        this.goToLogical(i, true);
        this.startAuto();
      });
    });
  };

  BannerSwiperInstance.prototype.destroy = function () {
    this.stopAuto();
    this.track?.removeEventListener('transitionend', this.onTransitionEnd);
    this.wrap.removeEventListener('touchstart', this.onTouchStart);
    this.wrap.removeEventListener('touchmove', this.onTouchMove);
    this.wrap.removeEventListener('touchend', this.onTouchEnd);
    this.wrap.removeEventListener('touchcancel', this.onTouchEnd);
    this.wrap.removeEventListener('pointerdown', this.onPointerDown);
    this.wrap.removeEventListener('pointermove', this.onPointerMove);
    this.wrap.removeEventListener('pointerup', this.onPointerUp);
    this.wrap.removeEventListener('pointercancel', this.onPointerUp);
    window.removeEventListener('resize', this.onResizeBound);
  };

  window.BannerSwiper = {
    _active: null,
    mount(wrap, banners) {
      if (!wrap) return null;
      if (this._active) this._active.destroy();
      this._active = new BannerSwiperInstance(wrap, banners);
      return this._active;
    },
  };
})();

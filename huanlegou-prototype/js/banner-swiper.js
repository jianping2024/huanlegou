/**
 * 首页 Banner — 唯一实现：clone 无限循环 + touch 拖动
 */
(function () {
  'use strict';

  const AUTO_MS = 4000;
  const SWIPE_THRESHOLD = 0.16;
  const AXIS_LOCK_PX = 6;
  const LOOP_RESET_MS = 540;

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
    this.dotIndex = 0;
    this.width = 0;
    this.dragX = 0;
    this.dragging = false;
    this.startX = 0;
    this.startY = 0;
    this.axis = null;
    this.timer = null;
    this.loopResetTimer = null;
    this.usingTouch = false;
    this.onTransitionEnd = this.handleTransitionEnd.bind(this);
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
    this.dotIndex = 0;
  };

  BannerSwiperInstance.prototype.mount = function () {
    this.render();
    this.bind();
    this.applyTransform({ animate: false, dragging: false });
    this.startAuto();
  };

  BannerSwiperInstance.prototype.logicalToTrack = function (logical) {
    return logical + 1;
  };

  BannerSwiperInstance.prototype.clampDragPx = function (dragPx) {
    if (this.count <= 1 || !this.width) return dragPx;
    const w = this.width;
    const t = this.trackIndex;
    const minOffset = -(t + 1) * w;
    const maxOffset = -(t - 1) * w;
    const rawOffset = -t * w + dragPx;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, rawOffset));
    return clampedOffset + t * w;
  };

  BannerSwiperInstance.prototype.syncActiveSlide = function (offset) {
    if (!this.slides.length) return;
    let activeIdx = this.trackIndex;
    if (this.dragging && this.width) {
      activeIdx = Math.round(-offset / this.width);
      activeIdx = Math.max(0, Math.min(this.slides.length - 1, activeIdx));
    }
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === activeIdx);
    });
  };

  BannerSwiperInstance.prototype.updateDots = function () {
    if (this.trackIndex >= 1 && this.trackIndex <= this.count) {
      this.dotIndex = this.trackIndex - 1;
    }
    this.wrap.querySelectorAll('.banner-dots span').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.dotIndex);
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

    const safeDragPx = dragging ? this.clampDragPx(dragPx) : 0;
    const offset = -this.trackIndex * this.width + safeDragPx;

    this.track.style.transition =
      dragging || !animate ? 'none' : 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1)';
    this.track.classList.toggle('is-dragging', dragging);
    this.wrap.classList.toggle('is-dragging', dragging);
    this.track.style.transform = `translate3d(${offset}px, 0, 0)`;

    this.updateDots();
    this.syncActiveSlide(offset);
  };

  BannerSwiperInstance.prototype.clearLoopReset = function () {
    if (this.loopResetTimer) {
      clearTimeout(this.loopResetTimer);
      this.loopResetTimer = null;
    }
    this.track?.removeEventListener('transitionend', this.onTransitionEnd);
    this.wrap.classList.remove('is-resetting');
  };

  BannerSwiperInstance.prototype.performLoopReset = function () {
    if (this.count <= 1) return;
    this.clearLoopReset();

    if (this.trackIndex === this.count + 1) {
      this.wrap.classList.add('is-resetting');
      this.trackIndex = 1;
      this.dotIndex = 0;
      this.applyTransform({ animate: false, dragging: false });
      this.wrap.classList.remove('is-resetting');
    } else if (this.trackIndex === 0) {
      this.wrap.classList.add('is-resetting');
      this.trackIndex = this.count;
      this.dotIndex = this.count - 1;
      this.applyTransform({ animate: false, dragging: false });
      this.wrap.classList.remove('is-resetting');
    }
  };

  BannerSwiperInstance.prototype.scheduleLoopReset = function () {
    this.clearLoopReset();
    this.track.addEventListener('transitionend', this.onTransitionEnd);
    this.loopResetTimer = setTimeout(() => this.performLoopReset(), LOOP_RESET_MS);
  };

  BannerSwiperInstance.prototype.handleTransitionEnd = function (e) {
    if (e.target !== this.track || e.propertyName !== 'transform') return;
    this.performLoopReset();
  };

  BannerSwiperInstance.prototype.goToTrack = function (trackIndex, animate) {
    if (this.count <= 1) return;
    this.clearLoopReset();
    this.trackIndex = trackIndex;
    this.applyTransform({ animate, dragging: false });

    if (animate && (trackIndex === 0 || trackIndex === this.count + 1)) {
      this.scheduleLoopReset();
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
    this.clearLoopReset();
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

    this.dragX = this.clampDragPx(dx);
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
      if (e.pointerType === 'touch') return;
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
        this.clearLoopReset();
        this.goToLogical(i, true);
        this.startAuto();
      });
    });
  };

  BannerSwiperInstance.prototype.destroy = function () {
    this.stopAuto();
    this.clearLoopReset();
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
      const inst = new BannerSwiperInstance(wrap, banners);
      inst.mount();
      this._active = inst;
      return inst;
    },
  };
})();

/* ============================================================
   AMAP Animations — Intersection observer, counters, gauge fills
   ============================================================ */

const Animations = (() => {

  /* ---- Animated Counter ---- */
  function animateCounter(el, target, duration = 1500, suffix = '') {
    const start = 0;
    const startTime = performance.now();
    const isDecimal = String(target).includes('.') || suffix === '%';

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * ease;

      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.round(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /* ---- Animate SVG Gauge ---- */
  function animateGauge(circleEl, percentage, duration = 1800) {
    const circumference = parseFloat(circleEl.getAttribute('data-circumference')) || 339.29;
    const targetOffset = circumference - (percentage / 100) * circumference;
    circleEl.style.strokeDasharray = circumference;
    circleEl.style.strokeDashoffset = circumference;

    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = circumference - (circumference - targetOffset) * ease;
      circleEl.style.strokeDashoffset = current;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ---- Animate Progress Bar ---- */
  function animateProgressBar(el, targetWidth, duration = 1200) {
    el.style.width = '0%';
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        el.style.width = targetWidth;
      }, 50);
    });
  }

  /* ---- Intersection Observer for Fade-In ---- */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger counters
          if (entry.target.hasAttribute('data-counter')) {
            const target = parseFloat(entry.target.getAttribute('data-counter'));
            const suffix = entry.target.getAttribute('data-suffix') || '';
            animateCounter(entry.target, target, 1500, suffix);
          }
          // Trigger gauges
          const gaugeCircle = entry.target.querySelector('.gauge-fill[data-percentage]');
          if (gaugeCircle) {
            const pct = parseFloat(gaugeCircle.getAttribute('data-percentage'));
            animateGauge(gaugeCircle, pct);
          }
          // Trigger progress bars
          const progressFill = entry.target.querySelector('.progress-fill[data-width]');
          if (progressFill) {
            animateProgressBar(progressFill, progressFill.getAttribute('data-width'));
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  /* ---- Stagger children animation ---- */
  function staggerChildren(parentSelector, delayStep = 60) {
    document.querySelectorAll(parentSelector).forEach(parent => {
      Array.from(parent.children).forEach((child, i) => {
        child.style.animationDelay = `${i * delayStep}ms`;
      });
    });
  }

  /* ---- Pipeline flow animation ---- */
  function initPipelineAnimation() {
    const dots = document.querySelectorAll('.flow-dot');
    dots.forEach((dot, i) => {
      dot.style.animationDelay = `${i * 0.3}s`;
    });
  }

  return {
    animateCounter,
    animateGauge,
    animateProgressBar,
    initScrollAnimations,
    staggerChildren,
    initPipelineAnimation,
  };
})();

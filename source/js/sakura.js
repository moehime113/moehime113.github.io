(function () {
  'use strict';

  var rafId = null;
  var canvas = null;
  var ctx = null;
  var petals = [];

  // 可选值: sakura / leaf / mix
  var effectType = window.__fallEffectType || 'mix';

  // 你可以替换成自己的图片地址
  var sakuraImg = new Image();
  sakuraImg.src = 'https://npm.elemecdn.com/tzy-blog/lib/img/other/sakura.png';

  var leafImg = new Image();
  leafImg.src = 'https://img.cdn.nesxc.com/upload/wordpress/202202251325420webp';

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    var fromTop = Math.random() > 0.4;
    return {
      x: fromTop ? random(0, window.innerWidth) : window.innerWidth + random(0, 40),
      y: fromTop ? random(-120, 0) : random(0, window.innerHeight),
      s: random(0.45, 1.1),
      r: random(0, Math.PI * 2),
      vx: random(-1.9, -0.9),
      vy: random(1.2, 2.2),
      vr: random(0.005, 0.03),
      type:
        effectType === 'sakura'
          ? 'sakura'
          : effectType === 'leaf'
            ? 'leaf'
            : Math.random() > 0.5
              ? 'sakura'
              : 'leaf'
    };
  }

  function resetParticle(p) {
    var np = createParticle();
    p.x = np.x;
    p.y = np.y;
    p.s = np.s;
    p.r = np.r;
    p.vx = np.vx;
    p.vy = np.vy;
    p.vr = np.vr;
    p.type = np.type;
  }

  function ensureCanvas() {
    removeCanvas();

    canvas = document.createElement('canvas');
    canvas.id = 'canvas_sakura';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.setAttribute(
      'style',
      'position:fixed;left:0;top:0;z-index:9997;pointer-events:none;width:100%;height:100%;'
    );

    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }

  function removeCanvas() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    var old = document.getElementById('canvas_sakura');
    if (old && old.parentNode) old.parentNode.removeChild(old);

    canvas = null;
    ctx = null;
  }

  function drawFallback(p, size) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);

    if (p.type === 'leaf') {
      ctx.fillStyle = 'rgba(233, 142, 71, 0.86)';
      ctx.beginPath();
      ctx.ellipse(size * 0.45, size * 0.45, size * 0.36, size * 0.2, -0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(255, 183, 197, 0.88)';
      ctx.beginPath();
      ctx.arc(size * 0.3, size * 0.26, size * 0.18, 0, Math.PI * 2);
      ctx.arc(size * 0.55, size * 0.26, size * 0.18, 0, Math.PI * 2);
      ctx.arc(size * 0.3, size * 0.52, size * 0.18, 0, Math.PI * 2);
      ctx.arc(size * 0.55, size * 0.52, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawOne(p) {
    var img = p.type === 'leaf' ? leafImg : sakuraImg;
    var size = 20 * p.s;

    if (!img || !img.complete || img.naturalWidth === 0) {
      drawFallback(p, size);
      return;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.drawImage(img, 0, 0, size, size);
    ctx.restore();
  }

  function updateOne(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;

    if (p.x < -80 || p.x > window.innerWidth + 80 || p.y > window.innerHeight + 80 || p.y < -80) {
      resetParticle(p);
    }
  }

  function tick() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < petals.length; i++) {
      updateOne(petals[i]);
      drawOne(petals[i]);
    }

    rafId = requestAnimationFrame(tick);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function start() {
    if (!document.body) return;

    ensureCanvas();

    petals = [];
    for (var i = 0; i < 50; i++) {
      petals.push(createParticle());
    }

    tick();
  }

  sakuraImg.onload = start;
  leafImg.onload = start;

  window.addEventListener('resize', resize);
  document.addEventListener('DOMContentLoaded', start);
  document.addEventListener('pjax:complete', start);
})();

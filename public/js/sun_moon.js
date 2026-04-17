(function () {
  'use strict';

  var OVERLAY_FADE_DELAY = 2000;
  var OVERLAY_REMOVE_DELAY = 1000;
  var ICON_SWAP_DELAY = 1000;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function syncDarkClass() {
    if (isDark()) document.body.classList.add('DarkMode');
    else document.body.classList.remove('DarkMode');
  }

  function notify(title, message) {
    try {
      if (window.Vue && window.ELEMENT) {
        new Vue({
          data: function () {
            this.$notify({
              title: title,
              message: message,
              position: 'top-left',
              offset: 50,
              showClose: true,
              type: 'success',
              duration: 5000
            });
          }
        });
        return;
      }
    } catch (err) {}

    if (window.btf && typeof window.btf.snackbarShow === 'function') {
      window.btf.snackbarShow(message);
    }
  }

  function ensureSprite() {
    if (document.getElementById('sun-moon-sprite')) return;

    var sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sprite.setAttribute('id', 'sun-moon-sprite');
    sprite.setAttribute('aria-hidden', 'true');
    sprite.style.position = 'absolute';
    sprite.style.overflow = 'hidden';
    sprite.style.width = '0';
    sprite.style.height = '0';

    sprite.innerHTML = [
      '<symbol id="icon-sun" viewBox="0 0 1024 1024">',
      '<path d="M960 512l-128 128v192h-192l-128 128-128-128H192v-192l-128-128 128-128V192h192l128-128 128 128h192v192z" fill="#FFD878"></path>',
      '<path d="M736 512a224 224 0 1 0-448 0 224 224 0 1 0 448 0z" fill="#FFE4A9"></path>',
      '<path d="M512 109.248L626.752 224H800v173.248L914.752 512 800 626.752V800h-173.248L512 914.752 397.248 800H224v-173.248L109.248 512 224 397.248V224h173.248L512 109.248M512 64l-128 128H192v192l-128 128 128 128v192h192l128 128 128-128h192v-192l128-128-128-128V192h-192l-128-128z" fill="#4D5152"></path>',
      '<path d="M512 320c105.888 0 192 86.112 192 192s-86.112 192-192 192-192-86.112-192-192 86.112-192 192-192m0-32a224 224 0 1 0 0 448 224 224 0 0 0 0-448z" fill="#4D5152"></path>',
      '</symbol>',
      '<symbol id="icon-moon" viewBox="0 0 1024 1024">',
      '<path d="M611.370667 167.082667a445.013333 445.013333 0 0 1-38.4 161.834666 477.824 477.824 0 0 1-244.736 244.394667 445.141333 445.141333 0 0 1-161.109334 38.058667 85.077333 85.077333 0 0 0-65.066666 135.722666A462.08 462.08 0 1 0 747.093333 102.058667a85.077333 85.077333 0 0 0-135.722666 65.024z" fill="#FFB531"></path>',
      '<path d="M329.728 274.133333l35.157333-35.157333a21.333333 21.333333 0 1 0-30.165333-30.165333l-35.157333 35.157333-35.114667-35.157333a21.333333 21.333333 0 0 0-30.165333 30.165333l35.114666 35.157333-35.114666 35.157334a21.333333 21.333333 0 1 0 30.165333 30.165333l35.114667-35.157333 35.157333 35.157333a21.333333 21.333333 0 1 0 30.165333-30.165333z" fill="#030835"></path>',
      '</symbol>'
    ].join('');

    document.body.appendChild(sprite);
  }

  function updateModeIcon() {
    var modeicon = document.getElementById('modeicon');
    if (!modeicon) return;
    modeicon.setAttribute('xlink:href', isDark() ? '#icon-sun' : '#icon-moon');
  }

  function clearOverlay() {
    var old = document.querySelector('.Cuteen_DarkSky');
    if (old) old.remove();
  }

  function createOverlay() {
    clearOverlay();
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"><div id="sun"></div><div id="moon"></div></div></div>'
    );
  }

  function saveTheme(mode) {
    if (window.btf && window.btf.saveToLocal && typeof window.btf.saveToLocal.set === 'function') {
      window.btf.saveToLocal.set('theme', mode, 2);
    } else {
      localStorage.setItem('theme', mode);
    }
  }

  function applyDark() {
    if (window.btf && typeof window.btf.activateDarkMode === 'function') {
      window.btf.activateDarkMode();
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    document.body.classList.add('DarkMode');
    saveTheme('dark');
  }

  function applyLight() {
    if (window.btf && typeof window.btf.activateLightMode === 'function') {
      window.btf.activateLightMode();
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    document.body.classList.remove('DarkMode');
    saveTheme('light');
  }

  function safeThemeHooks() {
    typeof window.utterancesTheme === 'function' && window.utterancesTheme();
    typeof window.FB === 'object' && window.loadFBComment && window.loadFBComment();
    if (window.DISQUS && document.getElementById('disqus_thread') && document.getElementById('disqus_thread').children.length) {
      setTimeout(function () {
        window.disqusReset && window.disqusReset();
      }, 200);
    }
  }

  function animatePlanet(toDark) {
    var sun = document.getElementById('sun');
    var moon = document.getElementById('moon');
    if (!sun || !moon) return;

    if (toDark) {
      sun.style.opacity = '1';
      moon.style.opacity = '0';
      setTimeout(function () {
        sun.style.opacity = '0';
        moon.style.opacity = '1';
      }, ICON_SWAP_DELAY);
    } else {
      sun.style.opacity = '0';
      moon.style.opacity = '1';
      setTimeout(function () {
        sun.style.opacity = '1';
        moon.style.opacity = '0';
      }, ICON_SWAP_DELAY);
    }
  }

  window.switchNightMode = function () {
    var toDark = !isDark();

    createOverlay();
    animatePlanet(toDark);

    if (toDark) {
      applyDark();
      setTimeout(function () {
        notify('关灯啦🌙', '当前已成功切换至夜间模式！');
      }, OVERLAY_FADE_DELAY);
    } else {
      applyLight();
      setTimeout(function () {
        notify('开灯啦🌞', '当前已成功切换至白天模式！');
      }, OVERLAY_FADE_DELAY);
    }

    updateModeIcon();

    setTimeout(function () {
      var sky = document.querySelector('.Cuteen_DarkSky');
      if (!sky) return;
      sky.style.transition = 'opacity 3s';
      sky.style.opacity = '0';
      setTimeout(function () {
        sky.remove();
      }, OVERLAY_REMOVE_DELAY);
    }, OVERLAY_FADE_DELAY);

    safeThemeHooks();
  };

  function mountButton() {
    var oldBtn = document.getElementById('darkmode');
    if (!oldBtn) return;

    // 复制按钮节点以清空主题内置监听器，交由自定义动画控制。
    var btn = oldBtn.cloneNode(false);
    btn.id = 'darkmode';
    btn.type = 'button';
    btn.classList.add('icon-V');
    btn.title = oldBtn.title || '日间和夜间模式切换';
    btn.innerHTML = '<svg width="25" height="25" viewBox="0 0 1024 1024" aria-hidden="true"><use id="modeicon" xlink:href="#icon-moon"></use></svg>';

    oldBtn.parentNode.replaceChild(btn, oldBtn);
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      window.switchNightMode();
    });

    updateModeIcon();
  }

  function init() {
    if (!document.body) return;
    ensureSprite();
    syncDarkClass();
    mountButton();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
})();

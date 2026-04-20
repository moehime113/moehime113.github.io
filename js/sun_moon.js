(function () {
  'use strict';

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function syncDarkClass() {
    if (isDark()) document.body.classList.add('DarkMode');
    else document.body.classList.remove('DarkMode');
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
    var el = document.getElementById('nav-modeicon');
    if (el) el.setAttribute('xlink:href', isDark() ? '#icon-sun' : '#icon-moon');
    
    var el2 = document.getElementById('modeicon');
    if (el2) el2.setAttribute('xlink:href', isDark() ? '#icon-sun' : '#icon-moon');
  }

  function setBtnIcon(buttonId, iconClass) {
    var buttons = document.querySelectorAll('#' + buttonId);
    buttons.forEach(function (btn) {
      var icon = btn.querySelector('i');
      if (!icon) return;
      icon.className = 'iconfont ' + iconClass;
    });
  }

  function setShareIcon(iconClass) {
    var buttons = document.querySelectorAll('#rightside button.share');
    buttons.forEach(function (btn) {
      var icon = btn.querySelector('i');
      if (!icon) return;
      icon.className = 'iconfont ' + iconClass;
    });
  }

  function applyRightsideIcons() {
    setBtnIcon('hide-aside-btn', 'icon-a-rongqi131');
    setBtnIcon('readmode', 'icon-zixun');
    setBtnIcon('go-up', 'icon-dingbu');
    setShareIcon('icon-fenxianglianjie');
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

  window.switchNightMode = function () {
    if (isDark()) applyLight();
    else applyDark();
    updateModeIcon();
  };

  function mountButton() {
    var target = document.querySelector('#nav #menus');
    if (!target) return;

    if (!document.getElementById('nightmode-button')) {
      var wrapper = document.createElement('div');
      wrapper.setAttribute('id', 'nightmode-button');

      var a = document.createElement('a');
      a.className = 'site-page';
      a.href = 'javascript:void(0);';
      a.title = '日间和夜间模式切换';

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '18');
      svg.setAttribute('height', '18');
      svg.setAttribute('viewBox', '0 0 1024 1024');
      svg.style.verticalAlign = 'middle';

      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('id', 'nav-modeicon');
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-moon');

      svg.appendChild(use);
      a.appendChild(svg);
      wrapper.appendChild(a);

      wrapper.addEventListener('click', function () {
        if (typeof window.switchNightMode === 'function') window.switchNightMode();
      });

      target.insertBefore(wrapper, target.querySelector('#toggle-menu') || null);
    }

    var rightsideShow = document.getElementById('rightside-config-show');
    if (rightsideShow && !rightsideShow.querySelector('button.share')) {
      var shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.className = 'share';
      shareBtn.title = '分享链接';
      shareBtn.innerHTML = '<i class="iconfont icon-fenxianglianjie"></i>';
      shareBtn.onclick = function () {
        if (typeof window.share === 'function') window.share();
      };
      
      var goUp = document.getElementById('go-up');
      if (goUp) {
        rightsideShow.insertBefore(shareBtn, goUp);
      } else {
        rightsideShow.appendChild(shareBtn);
      }
    }

    updateModeIcon();
  }

  function init() {
    if (!document.body) return;
    ensureSprite();
    syncDarkClass();
    applyRightsideIcons();
    mountButton();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
})();

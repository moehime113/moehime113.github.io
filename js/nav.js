document.addEventListener('pjax:complete', toNav);
document.addEventListener('DOMContentLoaded', toNav);

function toNav() {
  var nameContainer = document.getElementById('name-container');
  var menusItems = document.getElementsByClassName('menus_items');
  var menuTarget = menusItems.length > 1 ? menusItems[1] : menusItems[0];

  // Keep navbar menu stable: do not swap menu with page title on scroll.
  if (nameContainer) {
    nameContainer.style.display = 'none';
  }
  if (menuTarget) {
    menuTarget.style.display = '';
  }

  bindPostCardClick();
  normalizeCommentsHeader();
  collapseGlobalPlayerSafely();
}

function bindPostCardClick() {
  var cards = document.querySelectorAll('.recent-posts .recent-post-item');
  cards.forEach(function (card) {
    if (card.dataset.cardLinkBound === '1') return;

    var titleLink = card.querySelector('a.article-title');
    if (!titleLink) return;

    card.dataset.cardLinkBound = '1';
    card.style.cursor = 'pointer';

    card.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;

      var interactive = event.target.closest(
        'a, button, input, textarea, select, label, summary, [role="button"]'
      );
      if (interactive) return;

      var href = titleLink.getAttribute('href');
      if (!href) return;

      if (window.pjax && typeof window.pjax.loadUrl === 'function') {
        window.pjax.loadUrl(href);
      } else {
        window.location.href = href;
      }
    });
  });
}

function normalizeCommentsHeader() {
  var path = (window.location && window.location.pathname) || '';
  if (!/^\/comments\/?$/.test(path)) return;

  var header = document.getElementById('page-header');
  var bodyWrap = document.getElementById('body-wrap');
  if (!header || !bodyWrap) return;

  // Force comments page to use normal-page hero style instead of home hero.
  header.classList.remove('full_page');
  header.classList.add('not-home-page');
  header.style.backgroundImage = 'url(/img/cover2.jpg)';

  var siteInfo = header.querySelector('#site-info');
  if (siteInfo) siteInfo.style.display = 'none';

  var pageSiteInfo = header.querySelector('#page-site-info');
  if (pageSiteInfo) pageSiteInfo.style.display = '';
}

function collapseGlobalPlayerSafely(maxRetry, retryDelay) {
  var retries = typeof maxRetry === 'number' ? maxRetry : 50;
  var delay = typeof retryDelay === 'number' ? retryDelay : 150;
  var attempts = 0;

  function tryCollapse() {
    var metingEl = document.querySelector('meting-js[fixed="true"]');
    var player = metingEl && metingEl.aplayer;
    var root = player && player.container;

    if (!root) {
      attempts += 1;
      if (attempts <= retries) setTimeout(tryCollapse, delay);
      return;
    }

    // Wait until player UI is fully ready. Collapsing too early can break layout.
    var hasMiniSwitcher = !!root.querySelector('.aplayer-miniswitcher');
    var hasPlaylist = !!root.querySelector('.aplayer-list ol li');
    if (!hasMiniSwitcher || !hasPlaylist) {
      attempts += 1;
      if (attempts <= retries) setTimeout(tryCollapse, delay);
      return;
    }

    // One-time collapse per page view.
    if (root.dataset.initCollapsed === '1') return;

    if (!root.classList.contains('aplayer-narrow')) {
      var miniSwitcher = root.querySelector('.aplayer-miniswitcher');
      if (miniSwitcher) miniSwitcher.click();
    }

    root.dataset.initCollapsed = '1';
  }

  tryCollapse();
}

function scrollToTop() {
  var menusItems = document.getElementsByClassName('menus_items');
  var menuTarget = menusItems.length > 1 ? menusItems[1] : menusItems[0];
  var nameContainer = document.getElementById('name-container');

  if (menuTarget) {
    menuTarget.style.display = '';
  }

  if (nameContainer) {
    nameContainer.style.display = 'none';
  }

  if (window.btf && typeof window.btf.scrollToDest === 'function') {
    window.btf.scrollToDest(0, 500);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

window.scrollToTop = scrollToTop;

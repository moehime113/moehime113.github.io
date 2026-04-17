document.addEventListener('pjax:complete', toNav);
document.addEventListener('DOMContentLoaded', toNav);

function toNav() {
  var nameContainer = document.getElementById('name-container');
  if (!nameContainer) {
    return;
  }

  // Some setups do not include this function; avoid runtime errors on click.
  if (typeof window.toggleWinbox !== 'function') {
    window.toggleWinbox = function () {};
  }

  var menusItems = document.getElementsByClassName('menus_items');
  var menuTarget = menusItems.length > 1 ? menusItems[1] : menusItems[0];

  // Keep navbar menu stable: do not swap menu with page title on scroll.
  nameContainer.style.display = 'none';
  if (menuTarget) {
    menuTarget.style.display = '';
  }
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

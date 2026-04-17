(function () {
  'use strict';

  if (window.__f12NotifyInstalled) return;
  window.__f12NotifyInstalled = true;

  var DEVTOOLS_GAP = 160;
  var CHECK_INTERVAL = 1200;
  var COOLDOWN_MS = 5000;
  var KEY_DEBOUNCE_MS = 300;
  var lastNotifyTime = 0;
  var keyDebounceTimer = null;

  function debounceKey(fn, wait) {
    if (keyDebounceTimer !== null) {
      clearTimeout(keyDebounceTimer);
    }

    keyDebounceTimer = setTimeout(function () {
      keyDebounceTimer = null;
      fn();
    }, wait || KEY_DEBOUNCE_MS);
  }

  function notifyWarning() {
    var now = Date.now();
    if (now - lastNotifyTime < COOLDOWN_MS) return;
    lastNotifyTime = now;

    var title = '你已被发现😜';
    var message = '小伙子，扒源记住要遵循 GPL 协议！';

    try {
      if (window.Vue && window.ELEMENT) {
        if (!window.__f12NotifyVm) {
          window.__f12NotifyVm = new Vue();
        }

        window.__f12NotifyVm.$notify({
          title: title,
          message: message,
          position: 'top-left',
          offset: 50,
          showClose: true,
          type: 'warning',
          duration: 5000
        });
        return;
      }
    } catch (err) {
      console.error('Element notify failed:', err);
    }

    if (window.btf && typeof window.btf.snackbarShow === 'function') {
      window.btf.snackbarShow(message);
      return;
    }

    alert(message);
  }

  function isDevtoolsShortcut(event) {
    var key = (event.key || '').toUpperCase();
    var isF12 = event.key === 'F12' || event.keyCode === 123;
    var isCtrlShiftOpen = event.ctrlKey && event.shiftKey && (key === 'I' || key === 'J' || key === 'C');
    return isF12 || isCtrlShiftOpen;
  }

  function detectDevtoolsByWindowSize() {
    var widthDiff = window.outerWidth - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > DEVTOOLS_GAP || heightDiff > DEVTOOLS_GAP) {
      notifyWarning();
    }
  }

  document.addEventListener('keydown', function (event) {
    if (event.repeat) return;

    if (isDevtoolsShortcut(event)) {
      debounceKey(notifyWarning, KEY_DEBOUNCE_MS);
    }
  });

  window.addEventListener('resize', detectDevtoolsByWindowSize);
  setInterval(detectDevtoolsByWindowSize, CHECK_INTERVAL);
})();

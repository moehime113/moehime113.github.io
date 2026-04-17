(function () {
  function showPlainToast(message, isError) {
    var old = document.getElementById('share-toast');
    if (old) old.remove();

    var toast = document.createElement('div');
    toast.id = 'share-toast';
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed',
      'top:24px',
      'left:24px',
      'z-index:100000',
      'max-width:320px',
      'padding:10px 14px',
      'border-radius:10px',
      'font-size:14px',
      'line-height:1.45',
      'color:#fff',
      'box-shadow:0 10px 26px rgba(0,0,0,.18)',
      'background:' + (isError ? 'rgba(220,53,69,.95)' : 'rgba(40,167,69,.95)'),
      'opacity:0',
      'transform:translateY(-8px)',
      'transition:all .25s ease'
    ].join(';');

    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      setTimeout(function () {
        if (toast && toast.parentNode) toast.remove();
      }, 260);
    }, 2400);
  }

  function debounce(fn, wait) {
    if (typeof fn !== 'function') return;
    clearTimeout(window.__shareDebounceTimer);
    window.__shareDebounceTimer = setTimeout(fn, wait || 300);
  }

  function notify(options) {
    var title = options.title || '提示';
    var message = options.message || '';
    var type = options.type || 'info';

    try {
      if (window.Vue) {
        new Vue({
          data: function () {
            this.$notify({
              title: title,
              message: message,
              position: 'top-left',
              offset: 50,
              showClose: true,
              type: type,
              duration: 5000
            });
          }
        });
        return;
      }
    } catch (e) {}

    if (window.btf && typeof window.btf.snackbarShow === 'function') {
      window.btf.snackbarShow(message || title);
      return;
    }

    showPlainToast(message || title, type === 'warning' || type === 'error');
  }

  function notifySuccess() {
    notify({
      title: '成功复制分享信息',
      message: '您现在可以通过粘贴直接跟小伙伴分享了！',
      type: 'success'
    });
  }

  function notifyFail() {
    notify({
      title: '复制失败',
      message: '浏览器拒绝访问剪贴板，请手动复制当前页面链接。',
      type: 'warning'
    });
  }

  function copyByNavigator(payload) {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      return Promise.reject(new Error('navigator.clipboard unavailable'));
    }

    return navigator.clipboard.writeText(payload);
  }

  function copyByClipboardJS(payload) {
    if (!window.ClipboardJS) {
      return Promise.reject(new Error('ClipboardJS unavailable'));
    }

    return new Promise(function (resolve, reject) {
      var trigger = document.createElement('button');
      trigger.className = 'share-temp-trigger';
      trigger.style.display = 'none';
      trigger.setAttribute('data-clipboard-text', payload);
      document.body.appendChild(trigger);

      var clipboard = new ClipboardJS(trigger);
      clipboard.on('success', function () {
        clipboard.destroy();
        trigger.remove();
        resolve();
      });
      clipboard.on('error', function (err) {
        clipboard.destroy();
        trigger.remove();
        reject(err);
      });

      trigger.click();
    });
  }

  function copyByExecCommand(payload) {
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = payload;
      textarea.setAttribute('readonly', 'readonly');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      try {
        var ok = document.execCommand('copy');
        textarea.remove();
        if (ok) resolve();
        else reject(new Error('execCommand copy failed'));
      } catch (err) {
        textarea.remove();
        reject(err);
      }
    });
  }

  function copyText(payload) {
    return copyByNavigator(payload)
      .catch(function () {
        return copyByClipboardJS(payload);
      })
      .catch(function () {
        return copyByExecCommand(payload);
      });
  }

  function share_() {
    var url = window.location.origin + window.location.pathname;
    var title = document.title || '';
    var siteSuffix = '| Echo`s home';
    var subTitle = title.endsWith(siteSuffix)
      ? title.substring(0, title.length - siteSuffix.length).trim()
      : title;

    var payload =
      'Echo的站内分享\n' +
      '标题：' + subTitle + '\n' +
      '链接：' + url + '\n' +
      '欢迎来访！';

    copyText(payload)
      .then(function () {
        notifySuccess();
      })
      .catch(function (err) {
        console.error('复制失败！', err);
        notifyFail();
      });
  }

  window.share = function () {
    debounce(share_, 300);
  };
})();

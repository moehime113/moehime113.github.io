(function () {
  function setResult(message, isError) {
    var result = document.getElementById('link-apply-result');
    if (!result) return;

    result.textContent = message;
    result.style.color = isError ? '#e74c3c' : '';
  }

  function getTemplate(mode) {
    if (mode === 'bf') {
      return (
        '```yml\n' +
        '- name: \n' +
        '  link: \n' +
        '  avatar: \n' +
        '  descr: \n' +
        '  siteshot: \n' +
        '```'
      );
    }

    return (
      '站点名称：\n' +
      '站点地址：\n' +
      '头像链接：\n' +
      '站点描述：\n' +
      '站点截图：'
    );
  }

  function toast(message) {
    if (window.btf && typeof window.btf.snackbarShow === 'function') {
      window.btf.snackbarShow(message);
      return;
    }

    alert(message);
  }

  function feedback(message, isError) {
    setResult(message, isError);
    toast(message);
  }

  function showTemplateFallback(template) {
    // 最后兜底：弹出可编辑文本，用户可手动复制。
    window.prompt('未检测到输入框，已为你准备申请模板（Ctrl+C 复制）：', template);
  }

  function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(text);
    }

    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      textarea.remove();
    }
  }

  window.leonus = {
    linkCom: function (mode) {
      var template = getTemplate(mode);
      var textarea = document.querySelector('.el-textarea__inner');

      // 优先自动填入评论输入框
      if (textarea) {
        textarea.value = template;
        if (mode === 'bf') textarea.setSelectionRange(15, 15);
        else textarea.setSelectionRange(5, 5);
        textarea.focus();
        feedback('已填入申请模板，直接补充信息即可。', false);
        return;
      }

      // 没有输入框时兜底复制模板，避免“点了没反应”
      copyText(template)
        .then(function () {
          feedback('未检测到输入框，已自动复制申请模板。', false);
        })
        .catch(function () {
          showTemplateFallback(template);
          feedback('未检测到输入框，已弹出模板供你手动复制。', false);
        });
    }
  };

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('.addBtn button[data-link-mode]');
    if (!btn) return;

    event.preventDefault();
    var mode = btn.getAttribute('data-link-mode') || '';
    window.leonus.linkCom(mode);
  });
})();

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
        '- name: #站点名称\n' +
        '  link: #站点链接\n' +
        '  avatar: #站长头像\n' +
        '  descr: #站点描述\n' +
        '```'
      );
    }

    return (
      '站点名称：#站点名称\n' +
      '站点链接：#站点链接\n' +
      '站长头像：#站长头像\n' +
      '站点描述：#站点描述'
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
      var textarea = document.querySelector('.tk-input textarea, .el-textarea__inner, #twikoo textarea, textarea');
      var commentBox = document.getElementById('post-comment');

      // 恢复原交互：优先跳转并填充评论输入框
      if (commentBox && typeof commentBox.scrollIntoView === 'function') {
        commentBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (textarea) {
        textarea.value = template;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        if (mode === 'bf') textarea.setSelectionRange(19, 23);
        else textarea.setSelectionRange(5, 10);
        textarea.focus();
        feedback('已跳转到评论区并填入申请模板。', false);
        return;
      }

      // 评论框尚未加载时兜底复制模板
      copyText(template)
        .then(function () {
          feedback('评论框暂未就绪，已复制申请模板。', false);
        })
        .catch(function () {
          showTemplateFallback(template);
          feedback('评论框暂未就绪，已弹出模板供你手动复制。', false);
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

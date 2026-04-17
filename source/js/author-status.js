(function () {
  'use strict';

  var STORAGE_KEY = 'authorStatusConfig';
  var DEFAULT_EMOJI = '🐟';
  var DEFAULT_TEXT = '认真摸鱼中';

  function loadStoredConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function saveStoredConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg || {}));
    } catch (err) {}
  }

  function getStatusConfig() {
    var stored = loadStoredConfig();
    var cfg = window.__authorStatus || {};
    return {
      emoji: stored.emoji || cfg.emoji || DEFAULT_EMOJI,
      text: stored.text || cfg.text || DEFAULT_TEXT
    };
  }

  function updateStatusBox(box, cfg) {
    if (!box) return;

    var emoji = box.querySelector('.author-status-emoji');
    var text = box.querySelector('.author-status-text');
    if (emoji) emoji.textContent = cfg.emoji;
    if (text) text.textContent = cfg.text;
  }

  function openStatusEditor() {
    var current = getStatusConfig();
    var emoji = window.prompt('输入状态 Emoji（例如 🐟）', current.emoji);
    if (emoji === null) return;

    var text = window.prompt('输入状态文案（例如 认真摸鱼中）', current.text);
    if (text === null) return;

    var next = {
      emoji: String(emoji || '').trim() || DEFAULT_EMOJI,
      text: String(text || '').trim() || DEFAULT_TEXT
    };

    saveStoredConfig(next);
    mountAuthorStatus();
  }

  window.setAuthorStatus = function (emoji, text) {
    var next = {
      emoji: String(emoji || '').trim() || DEFAULT_EMOJI,
      text: String(text || '').trim() || DEFAULT_TEXT
    };
    saveStoredConfig(next);
    mountAuthorStatus();
  };

  window.resetAuthorStatus = function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {}
    mountAuthorStatus();
  };

  function createStatusBox() {
    var cfg = getStatusConfig();

    var box = document.createElement('div');
    box.className = 'author-status-box';

    var status = document.createElement('div');
    status.className = 'author-status';

    var emoji = document.createElement('span');
    emoji.className = 'author-status-emoji';
    emoji.textContent = cfg.emoji;

    var text = document.createElement('span');
    text.className = 'author-status-text';
    text.textContent = cfg.text;

    status.appendChild(emoji);
    status.appendChild(text);
    box.appendChild(status);

    // 双击状态即可在网页端修改，不必再改源码。
    box.title = '双击修改状态';
    box.addEventListener('dblclick', function (event) {
      event.preventDefault();
      event.stopPropagation();
      openStatusEditor();
    });

    return box;
  }

  function mountAuthorStatus() {
    var cards = document.querySelectorAll('.card-widget.card-info');
    if (!cards || cards.length === 0) return;

    cards.forEach(function (card) {
      card.classList.add('author_top');

      var center = card.querySelector('.is-center');
      if (center) center.classList.add('author_top');

      var avatar = card.querySelector('.avatar-img');
      if (!avatar) return;

      var wrapper = avatar.parentElement;

      if (wrapper && wrapper.classList.contains('card-info-avatar')) {
        var existed = wrapper.querySelector('.author-status-box');
        if (!existed) wrapper.appendChild(createStatusBox());
        else updateStatusBox(existed, getStatusConfig());
        return;
      }

      var cardAvatar = document.createElement('div');
      cardAvatar.className = 'card-info-avatar';

      avatar.parentNode.insertBefore(cardAvatar, avatar);
      cardAvatar.appendChild(avatar);
      cardAvatar.appendChild(createStatusBox());
    });
  }

  document.addEventListener('DOMContentLoaded', mountAuthorStatus);
  document.addEventListener('pjax:complete', mountAuthorStatus);
})();

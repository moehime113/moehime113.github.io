(function () {
  'use strict';

  var timer = null;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function createTime() {
    var now = new Date();

    // 旅行者1号发射时间（用于趣味距离估算）
    var voyagerStart = new Date('09/05/1977 00:00:00');
    var dis = Math.trunc(23400000000 + ((now - voyagerStart) / 1000) * 17);
    var unit = (dis / 149600000).toFixed(6);

    // 站点诞生时间（可按需修改）
    var siteBirth = new Date('04/16/2026 00:00:00');
    var diff = now - siteBirth;
    var dnum = Math.floor(diff / 1000 / 60 / 60 / 24);
    var hnum = Math.floor(diff / 1000 / 60 / 60 - 24 * dnum);
    var mnum = Math.floor(diff / 1000 / 60 - 1440 * dnum - 60 * hnum);
    var snum = Math.round(diff / 1000 - 86400 * dnum - 3600 * hnum - 60 * mnum);

    hnum = pad(hnum);
    mnum = pad(mnum);
    snum = pad(snum);

    var hour = now.getHours();
    var boardHtml =
      hour >= 9 && hour < 18
        ? '<img class="boardsign" src="https://img.shields.io/badge/Echo%20Blog-%E6%AD%A3%E5%9C%A8%E6%9B%B4%E6%96%B0-2ea44f?style=flat" alt="在线状态">'
        : '<img class="boardsign" src="https://img.shields.io/badge/Echo%20Blog-%E4%BC%91%E6%81%AF%E4%B8%AD-8b949e?style=flat" alt="在线状态">';

    boardHtml +=
      '<br><div style="font-size:13px;font-weight:bold">本站已运行 ' +
      dnum +
      ' 天 ' +
      hnum +
      ' 小时 ' +
      mnum +
      ' 分 ' +
      snum +
      ' 秒 <i id="heartbeat" class="fas fa-heartbeat"></i><br>旅行者 1 号距离地球约 ' +
      dis +
      ' 千米，约为 ' +
      unit +
      ' 个天文单位 🚀</div>';

    var board = document.getElementById('workboard');
    if (board) board.innerHTML = boardHtml;
  }

  function startRuntime() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    createTime();
    timer = setInterval(createTime, 1000);
  }

  document.addEventListener('DOMContentLoaded', startRuntime);
  document.addEventListener('pjax:complete', startRuntime);
})();

(() => {
  const updateReadPercent = () => {
    const top = document.documentElement.scrollTop || window.pageYOffset;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    const viewHeight = document.documentElement.clientHeight;
    const total = Math.max(docHeight - viewHeight, 1);
    const result = Math.min(100, Math.max(0, Math.round((top / total) * 100)));

    const up = document.querySelector('#go-up');
    const icon = up?.querySelector('i');
    const percent = up?.querySelector('#percent');
    const percentNum = up?.querySelector('#percent-num');

    if (!up || !icon || !percent || !percentNum) return;

    if (result <= 95) {
      icon.style.display = 'none';
      percent.style.display = 'block';
      percentNum.textContent = String(result);
    } else {
      percent.style.display = 'none';
      icon.style.display = 'block';
    }
  };

  document.addEventListener('scroll', updateReadPercent, { passive: true });
  document.addEventListener('pjax:complete', updateReadPercent);
  document.addEventListener('DOMContentLoaded', updateReadPercent);
})();

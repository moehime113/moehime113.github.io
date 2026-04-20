/**
 * 动态副标题打字机效果 (优化版)
 * 解决 PJAX 重复触发导致的闪烁和重叠问题
 */
(function() {
  let timeoutId = null;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const subtitleTexts = [
    "如果命运是世界上最烂的编剧",
    "那我就做我人生最好的演员",
    "欢迎来到我的小站✨"
  ];
  const typingSpeed = 200;
  const deletingSpeed = 120;
  const pauseTime = 3000;

  function typeEffect() {
    const element = document.getElementById('subtitle');
    if (!element) return;

    const currentText = subtitleTexts[textIndex];
    
    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentText.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % subtitleTexts.length;
      delay = 500;
    }

    // 记录并清除旧的定时器，确保只有一个逻辑在运行
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(typeEffect, delay);
  }

  const initTypewriter = () => {
    // 每次进入页面或 PJAX 完成时，重置状态并重新开始
    if (timeoutId) clearTimeout(timeoutId);
    charIndex = 0;
    textIndex = 0;
    isDeleting = false;
    typeEffect();
  };

  // 绑定事件
  window.addEventListener('load', initTypewriter);
  document.addEventListener('pjax:complete', initTypewriter);
  
  // 兼容某些特殊情况下的初始化
  if (document.readyState !== 'loading') {
    initTypewriter();
  } else {
    document.addEventListener('DOMContentLoaded', initTypewriter);
  }
})();

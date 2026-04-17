(() => {
  const CHART_IDS = ['posts-chart', 'tags-chart', 'categories-chart'];
  const chartInstances = new Map();
  const ECHARTS_CDNS = [
    'https://npm.elemecdn.com/echarts@5.5.1/dist/echarts.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js',
    'https://cdn.bootcdn.net/ajax/libs/echarts/5.5.1/echarts.min.js'
  ];

  const getThemeColor = () =>
    document.documentElement.getAttribute('data-theme') === 'light'
      ? '#4c4948'
      : 'rgba(255,255,255,0.78)';

  const parseLength = (el, key, fallback) => {
    const v = Number(el.getAttribute(key));
    return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
  };

  const toUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('/')) return path;
    return '/' + path;
  };

  const navigateTo = (path) => {
    const url = toUrl(path);
    if (!url) return;

    if (window.pjax && typeof window.pjax.loadUrl === 'function') {
      window.pjax.loadUrl(url);
      return;
    }

    window.location.href = url;
  };

  const setChartMessage = (id, message) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '<div style="padding:14px;border:1px dashed var(--theme-color);border-radius:10px;opacity:.9;">' + message + '</div>';
  };

  const setAllChartMessage = (message) => {
    CHART_IDS.forEach((id) => setChartMessage(id, message));
  };

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

  const ensureEcharts = async () => {
    if (window.echarts) return true;

    for (let i = 0; i < ECHARTS_CDNS.length; i++) {
      try {
        await loadScript(ECHARTS_CDNS[i]);
        if (window.echarts) return true;
      } catch (err) {}
    }

    return false;
  };

  const disposeMissingCharts = () => {
    CHART_IDS.forEach((id) => {
      if (document.getElementById(id)) return;

      const ins = chartInstances.get(id);
      if (ins) {
        ins.dispose();
        chartInstances.delete(id);
      }
    });
  };

  const ensureChart = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;

    const current = chartInstances.get(id);
    if (current) {
      current.dispose();
      chartInstances.delete(id);
    }

    const next = window.echarts.init(el, 'light');
    chartInstances.set(id, next);
    return next;
  };

  const buildPostSeries = (posts, startMonth) => {
    const map = new Map();

    posts.forEach((item) => {
      if (!item || !item.date) return;
      if (startMonth && item.date < startMonth) return;
      map.set(item.date, (map.get(item.date) || 0) + 1);
    });

    const months = Array.from(map.keys()).sort();
    const values = months.map((month) => map.get(month));
    return { months, values };
  };

  const renderPostsChart = (dataset, color) => {
    const el = document.getElementById('posts-chart');
    if (!el) return;

    const startMonth = (el.getAttribute('data-start') || '').trim();
    const series = buildPostSeries(dataset.posts || [], startMonth);

    const chart = ensureChart('posts-chart');
    if (!chart) return;

    chart.setOption({
      title: {
        text: '文章发布统计图',
        left: 'center',
        textStyle: { color }
      },
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 56, bottom: 44 },
      xAxis: {
        name: '日期',
        type: 'category',
        boundaryGap: false,
        nameTextStyle: { color },
        axisLabel: { color },
        axisLine: { lineStyle: { color } },
        data: series.months
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        minInterval: 1,
        nameTextStyle: { color },
        axisLabel: { color },
        splitLine: { show: false },
        axisLine: { show: true, lineStyle: { color } }
      },
      series: [
        {
          name: '文章篇数',
          type: 'line',
          smooth: true,
          data: series.values,
          lineStyle: { width: 3 },
          symbolSize: 8,
          itemStyle: { color: '#49b1f5' },
          areaStyle: { opacity: 0.12 }
        }
      ]
    });

    chart.on('click', function (event) {
      if (!event || !event.name) return;
      navigateTo('/archives/' + String(event.name).replace('-', '/') + '/');
    });
  };

  const renderTagsChart = (dataset, color) => {
    const el = document.getElementById('tags-chart');
    if (!el) return;

    const limit = parseLength(el, 'data-length', 10);
    const source = Array.isArray(dataset.tags) ? dataset.tags.slice(0, limit) : [];
    const chart = ensureChart('tags-chart');
    if (!chart) return;

    chart.setOption({
      title: {
        text: 'Top ' + source.length + ' 标签统计图',
        left: 'center',
        textStyle: { color }
      },
      tooltip: {},
      grid: { left: 40, right: 20, top: 56, bottom: 44 },
      xAxis: {
        name: '标签',
        type: 'category',
        nameTextStyle: { color },
        axisLabel: { color, interval: 0 },
        axisLine: { lineStyle: { color } },
        data: source.map((item) => item.name)
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        minInterval: 1,
        nameTextStyle: { color },
        axisLabel: { color },
        splitLine: { show: false },
        axisLine: { show: true, lineStyle: { color } }
      },
      series: [
        {
          name: '标签',
          type: 'bar',
          data: source,
          barMaxWidth: 36,
          itemStyle: {
            color: '#67c23a',
            borderRadius: [6, 6, 0, 0]
          }
        }
      ]
    });

    chart.on('click', function (event) {
      if (!event || !event.data || !event.data.path) return;
      navigateTo(event.data.path);
    });
  };

  const renderCategoriesChart = (dataset, color) => {
    const el = document.getElementById('categories-chart');
    if (!el) return;

    const source = Array.isArray(dataset.categories) ? dataset.categories : [];
    const useSunburst = (el.getAttribute('data-parent') || '').toLowerCase() === 'true';
    const tree = buildCategoryTree(source);
    const hasChildNode = tree.some((item) => Array.isArray(item.children) && item.children.length > 0);
    const chart = ensureChart('categories-chart');
    if (!chart) return;

    chart.setOption(
      useSunburst && hasChildNode
        ? {
            title: {
              text: '文章分类统计图',
              left: 'center',
              textStyle: { color }
            },
            tooltip: { trigger: 'item' },
            series: [
              {
                name: '分类',
                type: 'sunburst',
                radius: ['16%', '88%'],
                center: ['50%', '52%'],
                sort: 'desc',
                nodeClick: false,
                data: tree,
                label: { color }
              }
            ]
          }
        : {
            title: {
              text: '文章分类统计图',
              left: 'center',
              textStyle: { color }
            },
            tooltip: { trigger: 'item' },
            legend: {
              bottom: 0,
              textStyle: { color }
            },
            series: [
              {
                name: '分类',
                type: 'pie',
                radius: ['24%', '68%'],
                center: ['50%', '48%'],
                data: source,
                label: {
                  color,
                  formatter: '{b}: {c}'
                }
              }
            ]
          }
    );

    chart.on('click', function (event) {
      if (!event || !event.data || !event.data.path) return;
      navigateTo(event.data.path);
    });
  };

  const renderAllCharts = async () => {
    disposeMissingCharts();

    const ok = await ensureEcharts();
    if (!ok) {
      setAllChartMessage('统计图依赖加载失败，请检查网络或稍后刷新重试。');
      return;
    }

    const dataset = window.__BLOG_CHARTS_DATA__;
    if (!dataset) {
      setAllChartMessage('统计数据未生成，请先执行 hexo clean && hexo g。');
      return;
    }

    const color = getThemeColor();
    renderPostsChart(dataset, color);
    renderTagsChart(dataset, color);
    renderCategoriesChart(dataset, color);
  };

  const resizeAllCharts = () => {
    chartInstances.forEach((ins) => ins && ins.resize());
  };

  const buildCategoryTree = (items) => {
    const map = new Map();

    items.forEach((item) => {
      if (!item || !item.id) return;
      map.set(item.id, {
        id: item.id,
        name: item.name,
        value: item.value,
        path: item.path,
        parent: item.parent,
        children: []
      });
    });

    const roots = [];
    map.forEach((node) => {
      if (node.parent && map.has(node.parent)) {
        map.get(node.parent).children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  document.addEventListener('DOMContentLoaded', function () {
    renderAllCharts();
  });
  document.addEventListener('pjax:complete', function () {
    renderAllCharts();
  });
  window.addEventListener('resize', resizeAllCharts);

  new MutationObserver(function (mutations) {
    const changed = mutations.some(function (m) {
      return m.type === 'attributes' && m.attributeName === 'data-theme';
    });
    if (changed) renderAllCharts();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();

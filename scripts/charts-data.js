'use strict';

hexo.extend.generator.register('charts_data', function (locals) {
  var postModels = locals.posts
    .filter(function (post) {
      return post.published !== false;
    })
    .sort('date', 1)
    .toArray();

  var postItems = postModels.map(function (post) {
    return {
      date: post.date ? post.date.format('YYYY-MM') : '',
      path: post.path || '',
      title: post.title || ''
    };
  });

  var tagItems = locals.tags
    .toArray()
    .map(function (tag) {
      return {
        name: tag.name,
        value: tag.length,
        path: tag.path || ''
      };
    })
    .sort(function (a, b) {
      return b.value - a.value;
    });

  var categoryItems = locals.categories
    .toArray()
    .map(function (category) {
      return {
        id: category._id,
        parent: category.parent || null,
        name: category.name,
        value: category.length,
        path: category.path || ''
      };
    })
    .sort(function (a, b) {
      return b.value - a.value;
    });

  var payload = {
    posts: postItems,
    tags: tagItems,
    categories: categoryItems
  };

  return {
    path: 'js/charts-data.js',
    data: 'window.__BLOG_CHARTS_DATA__ = ' + JSON.stringify(payload) + ';'
  };
});

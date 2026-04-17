---
title: 外挂标签及多色图标测试
date: 2026-04-16 14:00:00
tags: [测试]
categories: [测试]
---

# 测试彩色图标
<svg class="icon faa-tada animated-hover" aria-hidden="true"><use xlink:href="#icon-shouye"></use></svg> 首页彩色图标测试

# 测试外挂标签 (Tag Plugins)

## 1. 提示块 (Note)
{% note info 'fas fa-bullhorn' %}
这是一个 Info 提示块，带有个小喇叭。
{% endnote %}

{% note success 'fas fa-check-circle' %}
这是一个 Success 提示块，带有成功的勾号。
{% endnote %}

## 2. 按钮 (Button)
{% btn 'https://github.com/', 'GitHub', 'fab fa-github', 'blue' %}
{% btn 'https://google.com/', 'Google', 'fas fa-search', 'red outline' %}

## 3. 标签 (Label)
这是一个 {% label default, 默认标签 %}
这是一段 {% label primary, 主要内容带标签 %}
{% label success, 成功状态 %}

## 4. 标签页 (Tabs)
{% tabs tab-id %}
<!-- tab 标签页一 -->
Hello，这是第一个标签页里的内容。
<!-- endtab -->
<!-- tab 标签页二 -->
嗨，这儿是第二个标签页的内容。
<!-- endtab -->
{% endtabs %}

## 5. Bilibili 视频适配测试

下面是一个 B 站 iframe 嵌入测试，使用 `.aspect-ratio` 自适应容器。

<div align="center" class="aspect-ratio">
	<iframe src="https://player.bilibili.com/player.html?aid=474023258&page=1&as_wide=1&high_quality=1&danmaku=0"
		scrolling="no"
		border="0"
		frameborder="no"
		framespacing="0"
		high_quality="1"
		danmaku="1"
		allowfullscreen="true">
	</iframe>
</div>

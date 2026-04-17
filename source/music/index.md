---
title: music
date: 2026-04-17 11:01:18
description: Echo的歌单
comments: false
---

<div class="music-player-panel">
	<div class="music-player-title">Echo的歌单</div>
	<div class="music-player-subtitle">默认播放 Echo 的 QQ 音乐歌单，也支持访客输入自己的歌单 ID 立即播放。</div>
	<div class="music-player-actions">
		<button id="play-echo-playlist" type="button">播放 Echo 的歌单</button>
		<input id="custom-playlist-id" type="text" inputmode="numeric" placeholder="输入你的QQ歌单ID（纯数字）">
		<button id="play-custom-playlist" type="button">播放我的歌单</button>
	</div>
	<div id="music-player-status">准备就绪，正在初始化播放器...</div>
</div>

<script>
	window.meting_api = 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r';
</script>

<div id="music-player-main"></div>

<details style="margin-top:14px;opacity:.9;">
	<summary>访客教程：如何播放自己的 QQ 音乐歌单</summary>
	<p>1. 打开 QQ 音乐歌单分享链接，找到其中的 id 参数。</p>
	<p>2. 例如链接中包含 <code>id=9134662144</code>，那你的歌单 ID 就是 <code>9134662144</code>。</p>
	<p>3. 在本页输入框里填入这个数字 ID，点击“播放我的歌单”。</p>
	<p>4. 若加载失败，请确认歌单是公开可访问状态，并重试。</p>
</details>

<style>
	.music-player-panel {
		padding: 14px 16px;
		margin: 0 0 14px;
		border-radius: 12px;
		border: 1px solid #8bb5c2;
		background: linear-gradient(135deg, rgba(227, 242, 245, 0.72), rgba(195, 221, 229, 0.38));
	}

	.music-player-title {
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.4px;
	}

	.music-player-subtitle {
		margin-top: 4px;
		opacity: 0.85;
		font-size: 14px;
	}

	.music-player-actions {
		display: flex;
		gap: 10px;
		margin-top: 12px;
		flex-wrap: wrap;
	}

	.music-player-actions button {
		padding: 7px 12px;
		border: 1px solid #7aa7b7;
		background: #e6f3f7;
		border-radius: 999px;
		cursor: pointer;
		font-weight: 600;
	}

	#custom-playlist-id {
		padding: 7px 12px;
		border: 1px solid #7aa7b7;
		background: rgba(255, 255, 255, 0.88);
		border-radius: 999px;
		min-width: 240px;
		max-width: 100%;
	}

	#music-player-status {
		margin-top: 10px;
		font-size: 13px;
		opacity: 0.9;
	}
</style>

<script>
	(function () {
		var QQ_DEFAULT_PLAYLIST_ID = '9134662144';
		var player = null;

		function setStatus(text) {
			var statusNode = document.getElementById('music-player-status');
			if (statusNode) statusNode.textContent = text;
		}

		function normalizeSong(item) {
			return {
				name: item.name || '未命名歌曲',
				artist: item.artist || '未知歌手',
				url: item.url || '',
				cover: item.cover || '/img/cover2.jpg',
				lrc: item.lrc || ''
			};
		}

		function renderPlayer(songList, sourceName) {
			if (typeof window.APlayer === 'undefined') {
				setStatus('APlayer 未加载成功，请刷新后重试。');
				return;
			}

			if (!Array.isArray(songList) || songList.length === 0) {
				setStatus(sourceName + '为空，请先添加歌曲。');
				return;
			}

			if (player) {
				player.destroy();
			}

			var container = document.getElementById('music-player-main');
			player = new window.APlayer({
				container: container,
				theme: '#8fbccc',
				order: 'list',
				mutex: true,
				listFolded: false,
				listMaxHeight: '420px',
				preload: 'auto',
				volume: 0.5,
				audio: songList.map(normalizeSong)
			});

			setStatus('已加载 ' + sourceName + '，共 ' + songList.length + ' 首。');
		}

		function loadQQPlaylist(playlistId) {
			if (!playlistId) {
				setStatus('未填写 QQ 歌单 ID。');
				return;
			}

			setStatus('正在加载 QQ 歌单 ' + playlistId + ' ...');
			var api = 'https://api.injahow.cn/meting/?server=tencent&type=playlist&id=' + encodeURIComponent(playlistId);
			fetch(api)
				.then(function (res) {
					if (!res.ok) throw new Error('HTTP ' + res.status);
					return res.json();
				})
				.then(function (list) {
					renderPlayer(list, 'QQ 歌单');
				})
				.catch(function (err) {
					setStatus('QQ 歌单加载失败：' + err.message + '，请检查歌单 ID 或歌单公开权限。');
				});
		}

		document.addEventListener('DOMContentLoaded', function () {
			var btnEcho = document.getElementById('play-echo-playlist');
			var btnCustom = document.getElementById('play-custom-playlist');
			var customInput = document.getElementById('custom-playlist-id');

			if (btnEcho) {
				btnEcho.addEventListener('click', function () {
					loadQQPlaylist(QQ_DEFAULT_PLAYLIST_ID);
				});
			}

			if (btnCustom) {
				btnCustom.addEventListener('click', function () {
					var input = customInput ? String(customInput.value || '').trim() : '';
					loadQQPlaylist(input);
				});
			}

			if (customInput) {
				customInput.addEventListener('keydown', function (event) {
					if (event.key === 'Enter') {
						event.preventDefault();
						var input = String(customInput.value || '').trim();
						loadQQPlaylist(input);
					}
				});
			}

			loadQQPlaylist(QQ_DEFAULT_PLAYLIST_ID);
		});
	})();
</script>

<template>
	<view class="page">
		<view class="bg-layer">
			<image class="bg-image" :src="backgroundImage" mode="aspectFill" />
			<view class="bg-gradient"></view>
			<image class="bg-noise" :src="noiseImage" mode="aspectFill" />
		</view>

			<view class="content">
				<view class="header">
					<view class="header-spacer"></view>
					<text class="header-title">夜场游戏</text>
					<view class="header-action" @tap="handleSettings">
						<uni-icons type="settings" size="24" color="rgba(255, 255, 255, 0.9)" />
					</view>
				</view>

			<view class="main">
				<view class="game-list">
					<view class="game-card" v-for="item in games" :key="item.title" @tap="handleGameClick(item)">
						<view class="game-card-glass"></view>
						<view class="game-icon-wrap">
							<image class="game-icon" :src="item.icon" mode="aspectFit" />
						</view>
						<view class="game-text">
							<text class="game-title">{{ item.title }}</text>
							<text class="game-desc">{{ item.desc }}</text>
						</view>
					</view>
				</view>
				<view class="slogan">
					<text class="slogan-text">适度饮酒 • 享受夜晚</text>
				</view>
			</view>
			</view>
			<SettingsModal ref="settingsModal" />
		</view>
	</template>

	<script setup>
		import { ref } from 'vue'
		import SettingsModal from '../../components/SettingsModal.vue'

		const backgroundImage = '/static/assets/party/background.jpg'
		const noiseImage = '/static/assets/party/noise.png'
		const settingsModal = ref(null)
		const games = [{
				title: '霓虹骰子',
				desc: '经典聚会必备，比大小',
				icon: '/static/assets/party/icon-dice.svg'
			},
		{
			title: '真心话大冒险',
			desc: '说出秘密或者接受惩罚',
			icon: '/static/assets/party/icon-truth.svg',
			path: '/pages/truth/index'
		},
		{
			title: '鳄鱼拔牙',
			desc: '赛博版俄罗斯轮盘，谁是倒霉蛋',
			icon: '/static/assets/party/icon-croc.svg'
		},
		{
			title: '石头剪刀布',
			desc: '决战时刻，输了就喝',
			icon: '/static/assets/party/icon-rps.svg'
		}
	]

	const handleGameClick = (item) => {
		console.log('[home] tap game', item)
		if (!item.path) {
			console.log('[home] no path, skip navigate')
			return
		}
		uni.navigateTo({
			url: item.path
		})
	}

	const handleSettings = () => {
		settingsModal.value?.open()
	}
</script>

<style lang="scss">
	page {
		background-color: #0b0f14;
	}

	.page {
		min-height: 100vh;
		position: relative;
		color: #ffffff;
		font-family: Arial, sans-serif;
		overflow: hidden;
	}
「方案选单」
	.bg-layer {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.bg-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.4;
		filter: blur(8px);
		transform: scale(1.05);
	}

	.bg-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(11, 15, 20, 0.8) 0%, rgba(11, 15, 20, 0.6) 50%, #0b0f14 100%);
	}

	.bg-noise {
		position: absolute;
		left: 0;
		top: 0;
		width: 38.14%;
		height: 17.61%;
		opacity: 0.03;
	}

	.content {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		height: 175.4rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 92rpx 46rpx 0;
		box-sizing: border-box;
	}

	.header-spacer {
		width: 76rpx;
		height: 0;
	}

	.header-action {
		width: 76rpx;
		height: 76rpx;
		border-radius: 9999rpx;
		background: rgba(255, 255, 255, 0.05);
		border: 1rpx solid rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.header-title {
		font-size: 38rpx;
		line-height: 53rpx;
		font-weight: 700;
		letter-spacing: 2rpx;
		text-transform: uppercase;
		background-image: linear-gradient(90deg, #c27aff 0%, #51a2ff 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 20rpx rgba(139, 92, 246, 0.3);
	}

	.main {
		padding: 46rpx;
		box-sizing: border-box;
	}

	.game-list {
		display: flex;
		flex-direction: column;
	}

	.game-card {
		position: relative;
		height: 229rpx;
		width: 658rpx;
		border-radius: 30rpx;
		background: rgba(255, 255, 255, 0.03);
		border: 1rpx solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		padding: 0 46rpx;
		box-sizing: border-box;
		overflow: hidden;
		margin-bottom: 30rpx;
	}

	.game-card:last-child {
		margin-bottom: 0;
	}

	.game-card-glass {
		position: absolute;
		inset: 0;
		background: linear-gradient(19deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0) 100%);
		z-index: 0;
	}

	.game-icon-wrap {
		width: 122rpx;
		height: 122rpx;
		border-radius: 30rpx;
		background: rgba(0, 0, 0, 0.4);
		border: 1rpx solid rgba(255, 255, 255, 0.05);
		box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.1), 0 4px 6px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.game-icon {
		width: 61rpx;
		height: 61rpx;
	}

	.game-text {
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		z-index: 1;
	}

	.game-title {
		font-size: 34rpx;
		line-height: 53rpx;
		font-weight: 700;
		color: #ffffff;
	}

	.game-desc {
		font-size: 22rpx;
		line-height: 37rpx;
		color: rgba(255, 255, 255, 0.5);
	}

	.slogan {
		margin-top: 92rpx;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.slogan-text {
		font-size: 19rpx;
		line-height: 29rpx;
		letter-spacing: 6rpx;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.2);
	}
</style>

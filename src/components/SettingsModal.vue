<template>
	<uni-popup ref="popup" type="center" :is-mask-click="true">
		<view class="settings-modal" @tap.stop>
			<view class="settings-header">
				<text class="settings-title">系统设置</text>
				<view class="close-button" @tap="close">
					<view class="close-icon">
						<image class="close-line line-1" :src="icons.close1" mode="aspectFit" />
						<image class="close-line line-2" :src="icons.close2" mode="aspectFit" />
					</view>
				</view>
			</view>

			<view class="settings-body">
				<view class="setting-item">
					<view class="setting-left">
						<view class="setting-icon sound">
							<view class="icon-stack">
								<image class="sound-1" :src="icons.sound1" mode="aspectFit" />
							</view>
						</view>
						<view class="setting-text">
							<text class="setting-title">游戏音效</text>
							<text class="setting-desc">背景音乐与点击音效</text>
						</view>
					</view>
					<view class="toggle toggle-sound" :class="{ 'is-on': soundEnabled }" @tap="toggleSound">
						<view class="toggle-knob"></view>
					</view>
				</view>

				<view class="setting-item">
					<view class="setting-left">
						<view class="setting-icon haptic">
							<view class="icon-stack">
								<image class="haptic-1" :src="icons.haptic1" mode="aspectFit" />
							</view>
						</view>
						<view class="setting-text">
							<text class="setting-title">触感反馈</text>
							<text class="setting-desc">振动与物理反馈</text>
						</view>
					</view>
					<view class="toggle toggle-haptic" :class="{ 'is-on': hapticEnabled }" @tap="toggleHaptic">
						<view class="toggle-knob"></view>
					</view>
				</view>

				<view class="setting-item is-disabled">
					<view class="setting-left">
						<view class="setting-icon dark">
							<view class="icon-stack">
								<image class="dark-1" :src="icons.moon" mode="aspectFit" />
							</view>
						</view>
						<view class="setting-text">
							<text class="setting-title">深色模式</text>
							<text class="setting-desc">跟随系统自动切换</text>
						</view>
					</view>
					<text class="setting-status">始终开启</text>
				</view>

				<view class="settings-divider"></view>

				<view class="clear-button">
					<image class="clear-icon" :src="icons.trash" mode="aspectFit" />
					<text class="clear-text">清除缓存数据</text>
				</view>

				<view class="settings-footer">
					<text class="footer-text">VERSION 1.0.2 BETA</text>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import { ref } from 'vue'

	const popup = ref(null)
	const soundEnabled = ref(true)
	const hapticEnabled = ref(true)

	const icons = {
		close1: '/static/assets/settings/icon-close-1.svg',
		close2: '/static/assets/settings/icon-close-2.svg',
		sound1: '/static/assets/settings/icon-sound-1.png',
		haptic1: '/static/assets/settings/icon-touch.png',
		moon: '/static/assets/settings/icon-dark.png',
		trash: '/static/assets/settings/icon-trash.svg'
	}

	const open = () => {
		popup.value?.open()
	}

	const close = () => {
		popup.value?.close()
	}

	const toggleSound = () => {
		soundEnabled.value = !soundEnabled.value
	}

	const toggleHaptic = () => {
		hapticEnabled.value = !hapticEnabled.value
	}

	defineExpose({
		open,
		close
	})
</script>

<style lang="scss">
	.settings-modal {
		width: 720rpx;
		border-radius: 32rpx;
		border: 1.334rpx solid rgba(255, 255, 255, 0.1);
		background: #1a1a1a;
		box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
		overflow: hidden;
	}

	.settings-header {
		height: 137.334rpx;
		padding: 0 32rpx 0 48rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(255, 255, 255, 0.05);
		border-bottom: 1.334rpx solid rgba(255, 255, 255, 0.05);
		box-sizing: border-box;
	}

	.settings-title {
		font-size: 36rpx;
		line-height: 56rpx;
		font-weight: 700;
		letter-spacing: 0.9rpx;
		color: #ffffff;
	}

	.close-button {
		width: 72rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-icon {
		position: relative;
		width: 40rpx;
		height: 40rpx;
	}

	.close-line {
		position: absolute;
		inset: 25%;
		width: 100%;
		height: 100%;
	}

	.settings-body {
		padding: 48rpx 48rpx 30rpx;
		display: flex;
		flex-direction: column;
		gap: 48rpx;
		box-sizing: border-box;
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 72rpx;
	}

	.setting-left {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}

	.setting-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.setting-icon.sound {
		background: rgba(173, 70, 255, 0.2);
	}

	.setting-icon.haptic {
		background: rgba(43, 127, 255, 0.2);
	}

	.setting-icon.dark {
		background: rgba(255, 255, 255, 0.05);
	}

	.icon-stack {
		position: relative;
		width: 40rpx;
		height: 40rpx;
	}

	.sound-1 {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40rpx;
		height: 40rpx;
		transform: translate(-50%, -50%);
	}

	.sound-2 {
		position: absolute;
		top: 37.5%;
		right: 29.17%;
		bottom: 37.5%;
		left: 66.67%;
	}

	.sound-3 {
		position: absolute;
		top: 23.48%;
		right: 8.33%;
		bottom: 23.48%;
		left: 80.68%;
	}

	.haptic-1 {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40rpx;
		height: 40rpx;
		transform: translate(-50%, -50%);
	}

	.haptic-2 {
		position: absolute;
		width: 4rpx;
		height: 4rpx;
		left: 50%;
		top: 75%;
		transform: translate(-50%, -50%);
	}

	.dark-1 {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 40rpx;
		height: 40rpx;
		transform: translate(-50%, -50%);
	}

	.setting-text {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.setting-title {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #ffffff;
	}

	.setting-desc {
		font-size: 24rpx;
		line-height: 32rpx;
		color: rgba(255, 255, 255, 0.4);
	}

	.toggle {
		position: relative;
		width: 96rpx;
		height: 56rpx;
		border-radius: 9999rpx;
		background: rgba(255, 255, 255, 0.2);
		transition: background 0.2s ease;
	}

	.toggle-knob {
		position: absolute;
		top: 8rpx;
		left: 8rpx;
		width: 40rpx;
		height: 40rpx;
		border-radius: 9999rpx;
		background: #ffffff;
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1), 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease;
	}

	.toggle.is-on .toggle-knob {
		transform: translateX(40rpx);
	}

	.toggle-sound.is-on {
		background: #9810fa;
	}

	.toggle-haptic.is-on {
		background: #155dfc;
	}

	.is-disabled {
		opacity: 0.5;
	}

	.setting-status {
		font-size: 24rpx;
		line-height: 32rpx;
		color: rgba(255, 255, 255, 0.2);
	}

	.settings-divider {
		width: 100%;
		height: 2rpx;
		background: rgba(255, 255, 255, 0.05);
	}

	.clear-button {
		height: 90.666rpx;
		border-radius: 28rpx;
		border: 1.334rpx solid rgba(251, 44, 54, 0.2);
		background: rgba(251, 44, 54, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
	}

	.clear-icon {
		width: 32rpx;
		height: 32rpx;
	}

	.clear-text {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #ff6467;
	}

	.settings-footer {
		width: 624rpx;
		height: 30rpx;
		align-self: center;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.2);
		margin-top: 32rpx;
	}

	.footer-text {
		font-size: 20rpx;
		line-height: 30rpx;
		letter-spacing: 2rpx;
		color: rgba(255, 255, 255, 0.2);
	}
</style>

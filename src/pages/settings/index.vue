<template>
	<view class="page">
		<view class="bg-layer">
			<image class="bg-image" :src="backgroundImage" mode="aspectFill" />
			<view class="bg-gradient"></view>
			<image class="bg-noise" :src="noiseImage" mode="aspectFit" />
		</view>

		<view class="content">
			<view class="nav-title" :style="navTitleStyle">
				<text class="nav-title-text">设置</text>
			</view>
			<view class="nav-action" :style="navActionStyle" @tap="handleBack">
				<image class="nav-back-icon" :src="backIcon" mode="aspectFit" />
			</view>

			<view class="main">
				<view class="section">
					<view class="section-header">
						<text class="section-title">基础设置</text>
						<text class="section-hint">音效 / 触感 / 模式</text>
					</view>
					<view class="section-body">
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
					</view>
				</view>

				<view class="section">
					<view class="section-header">
						<text class="section-title">石头剪刀布模式</text>
						<text class="section-hint">单选</text>
					</view>
					<radio-group class="radio-group" @change="handleRpsModeChange">
						<label v-for="item in rpsModes" :key="item.value" class="radio-item" :class="{ 'is-active': rpsMode === item.value }">
							<view class="radio-text">
								<text class="radio-title">{{ item.label }}</text>
								<text v-if="item.desc" class="radio-desc">{{ item.desc }}</text>
							</view>
							<radio :value="item.value" :checked="rpsMode === item.value" color="#8b5cf6" />
						</label>
					</radio-group>
				</view>

				<view class="section">
					<view class="section-header">
						<text class="section-title">真心话大冒险题目</text>
						<text class="section-hint">单选</text>
					</view>
					<radio-group class="radio-group" @change="handleTruthModeChange">
						<label v-for="item in truthModes" :key="item.value" class="radio-item" :class="{ 'is-active': truthMode === item.value }">
							<view class="radio-text">
								<text class="radio-title">{{ item.label }}</text>
								<text v-if="item.desc" class="radio-desc">{{ item.desc }}</text>
							</view>
							<radio :value="item.value" :checked="truthMode === item.value" color="#2b7fff" />
						</label>
					</radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import uma from 'umtrack-wx'
	import { TrackEvents } from '@/utils/tracker'

	const backgroundImage = '/static/assets/common/background.jpg'
	const noiseImage = '/static/assets/party/noise.png'
	const backIcon = '/static/assets/rps/icon-back.svg'
	const navActionStyle = ref({})
	const navTitleStyle = ref({})

	const storageKeys = {
		soundEnabled: 'settings.soundEnabled',
		hapticEnabled: 'settings.hapticEnabled',
		rpsMode: 'settings.rpsMode',
		truthMode: 'settings.truthMode'
	}

	const soundEnabled = ref(true)
	const hapticEnabled = ref(true)
	const rpsMode = ref('single')
	const truthMode = ref('classic')

	const rpsModes = [
		{
			value: 'single',
			label: '一局定胜负'
		},
		{
			value: 'bo3',
			label: '三局二胜'
		},
		{
			value: 'bo5',
			label: '五局三胜'
		}
	]

	const truthModes = [
		{
			value: 'classic',
			label: '经典模式'
		},
		{
			value: 'campus',
			label: '校园聚会'
		},
		{
			value: 'couple',
			label: '情侣模式'
		},
		{
			value: 'online',
			label: '网聊模式'
		}
	]

	const icons = {
		sound1: '/static/assets/settings/icon-sound-1.png',
		haptic1: '/static/assets/settings/icon-touch.png',
		moon: '/static/assets/settings/icon-dark.png',
		trash: '/static/assets/settings/icon-trash.svg'
	}

	const loadSettings = () => {
		const soundValue = uni.getStorageSync(storageKeys.soundEnabled)
		const hapticValue = uni.getStorageSync(storageKeys.hapticEnabled)
		const storedRpsMode = uni.getStorageSync(storageKeys.rpsMode)
		const storedTruthMode = uni.getStorageSync(storageKeys.truthMode)

		if (typeof soundValue === 'boolean') {
			soundEnabled.value = soundValue
		}
		if (typeof hapticValue === 'boolean') {
			hapticEnabled.value = hapticValue
		}
		if (storedRpsMode && rpsModes.some((item) => item.value === storedRpsMode)) {
			rpsMode.value = storedRpsMode
		}
		if (storedTruthMode && truthModes.some((item) => item.value === storedTruthMode)) {
			truthMode.value = storedTruthMode
		}
	}

	const saveSetting = (key, value) => {
		uni.setStorageSync(key, value)
	}

	const resetSettings = () => {
		soundEnabled.value = true
		hapticEnabled.value = true
		rpsMode.value = 'single'
		truthMode.value = 'classic'
	}

	const handleBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const toggleSound = () => {
		soundEnabled.value = !soundEnabled.value
		saveSetting(storageKeys.soundEnabled, soundEnabled.value)
		uma.trackEvent(TrackEvents.SETTINGS_TOGGLE_SOUND, { enabled: soundEnabled.value })
	}

	const toggleHaptic = () => {
		hapticEnabled.value = !hapticEnabled.value
		saveSetting(storageKeys.hapticEnabled, hapticEnabled.value)
		uma.trackEvent(TrackEvents.SETTINGS_TOGGLE_HAPTIC, { enabled: hapticEnabled.value })
	}

	const handleRpsModeChange = (event) => {
		const value = event.detail.value
		if (rpsModes.some((item) => item.value === value)) {
			rpsMode.value = value
			saveSetting(storageKeys.rpsMode, value)
			uma.trackEvent(TrackEvents.RPS_CHANGE_MODE, { mode: value })
		}
	}

	const handleTruthModeChange = (event) => {
		const value = event.detail.value
		if (truthModes.some((item) => item.value === value)) {
			truthMode.value = value
			saveSetting(storageKeys.truthMode, value)
			uma.trackEvent(TrackEvents.TRUTH_CHANGE_MODE, { mode: value })
		}
	}

	const handleClearCache = () => {
		uma.trackEvent(TrackEvents.SETTINGS_CLEAR_CACHE)
		Object.values(storageKeys).forEach((key) => {
			uni.removeStorageSync(key)
		})
		resetSettings()
		uni.showToast({
			title: '已清除设置缓存',
			icon: 'none'
		})
	}

	const setNavActionStyle = () => {
		const getMenuButton = uni.getMenuButtonBoundingClientRect
		const getSystemInfo = uni.getSystemInfoSync
		if (typeof getMenuButton === 'function' && typeof getSystemInfo === 'function') {
			const menuButton = getMenuButton()
			const systemInfo = getSystemInfo()
			if (menuButton && systemInfo?.screenWidth) {
				const gap = 12
				const top = `${menuButton.top}px`
				const height = `${menuButton.height}px`
				navActionStyle.value = {
					top,
					left: `${gap}px`,
					width: `${menuButton.height}px`,
					height
				}
				navTitleStyle.value = {
					top,
					height
				}
				return
			}
		}
		navActionStyle.value = {
			top: 'calc(var(--status-bar-height) + 12rpx)',
			left: '24rpx',
			width: '64rpx',
			height: '64rpx'
		}
		navTitleStyle.value = {
			top: 'calc(var(--status-bar-height) + 12rpx)',
			height: '64rpx'
		}
	}

	onMounted(() => {
		setNavActionStyle()
	})

	onShow(() => {
		loadSettings()
		uma.trackEvent(TrackEvents.PAGE_VIEW_SETTINGS)
	})
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
		background: linear-gradient(180deg, rgba(11, 15, 20, 0.85) 0%, rgba(11, 15, 20, 0.65) 50%, #0b0f14 100%);
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

	.nav-action {
		position: fixed;
		z-index: 10;
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

	.nav-back-icon {
		width: 26.69rpx;
		height: 26.69rpx;
	}

	.nav-title {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 9;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 140rpx;
		pointer-events: none;
	}

	.nav-title-text {
		font-size: 38.14rpx;
		line-height: 53.39rpx;
		font-weight: 700;
		letter-spacing: 1.91rpx;
		text-transform: uppercase;
		background-image: linear-gradient(90deg, #c27aff 0%, #51a2ff 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 20rpx rgba(139, 92, 246, 0.3);
	}

	.main {
		padding: calc(var(--status-bar-height) + 200rpx) 46rpx calc(40rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 36rpx;
	}

	.section {
		border-radius: 32rpx;
		background: rgba(255, 255, 255, 0.03);
		border: 1rpx solid rgba(255, 255, 255, 0.08);
		padding: 32rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 32rpx;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: 700;
		color: #ffffff;
	}

	.section-hint {
		font-size: 22rpx;
		line-height: 32rpx;
		color: rgba(255, 255, 255, 0.4);
	}

	.section-body {
		display: flex;
		flex-direction: column;
		gap: 28rpx;
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
		min-height: 72rpx;
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

	.sound-1,
	.haptic-1,
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
		white-space: nowrap;
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
		width: 100%;
		height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.2);
		margin-top: 8rpx;
	}

	.footer-text {
		font-size: 20rpx;
		line-height: 30rpx;
		letter-spacing: 2rpx;
		color: rgba(255, 255, 255, 0.2);
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.radio-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24rpx;
		padding: 24rpx 28rpx;
		border-radius: 24rpx;
		background: rgba(0, 0, 0, 0.2);
		border: 1rpx solid rgba(255, 255, 255, 0.06);
		box-sizing: border-box;
	}

	.radio-item.is-active {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.06);
	}

	.radio-text {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.radio-title {
		font-size: 28rpx;
		line-height: 38rpx;
		color: #ffffff;
	}

	.radio-desc {
		font-size: 22rpx;
		line-height: 30rpx;
		color: rgba(255, 255, 255, 0.4);
	}
</style>

<template>
	<view class="page">
		<view class="bg-layer">
			<image class="bg-image" :src="backgroundImage" mode="aspectFill" />
			<view class="bg-gradient"></view>
			<image class="bg-noise" :src="noiseImage" mode="aspectFill" />
		</view>

		<view class="content">
			<view class="nav-title" :style="navTitleStyle">
				<text class="nav-title-text">鳄鱼拔牙</text>
			</view>
			<view class="nav-action" :style="navActionStyle" @tap="handleBack">
				<image class="nav-back-icon" :src="backIcon" mode="aspectFit" />
			</view>

			<view class="main">
				<view class="game-panel">
					<view class="game-panel-bg"></view>
					<view class="game-center">
						<view class="game-title">
							<text class="game-title-text">CROCO BITE</text>
						</view>
						<view class="crocodile" :class="{ 'is-closing': isMouthClosing }">
							<view class="crocodile-glow"></view>
						<view class="crocodile-mouth">
							<view class="mouth-inner">
								<view class="mouth-shadow"></view>
								<view class="tongue"></view>
								<view class="mouth-inner-shadow"></view>
							</view>
							<view class="tooth-column left">
								<view
									v-for="tooth in teethLeft"
									:key="tooth.id"
									class="tooth-wrapper"
									@tap="handleToothTap(tooth)"
								>
									<view class="tooth-under" :class="{ 'is-active': tooth.pulse }"></view>
									<view
										class="tooth-core"
										:class="{ 'is-miss': tooth.state === 'miss', 'is-hit': tooth.state === 'hit', 'is-pressed': tooth.pressed }"
									></view>
								</view>
							</view>
							<view class="tooth-column right">
								<view
									v-for="tooth in teethRight"
									:key="tooth.id"
									class="tooth-wrapper"
									@tap="handleToothTap(tooth)"
								>
									<view class="tooth-under" :class="{ 'is-active': tooth.pulse }"></view>
									<view
										class="tooth-core"
										:class="{ 'is-miss': tooth.state === 'miss', 'is-hit': tooth.state === 'hit', 'is-pressed': tooth.pressed }"
									></view>
								</view>
							</view>
							<view class="mouth-shadow-inner"></view>
						</view>
							<view class="crocodile-head">
								<view class="head-bump bump-left">
									<view class="head-bump-shape"></view>
								</view>
								<view class="head-bump bump-right">
									<view class="head-bump-shape"></view>
								</view>
								<view class="nostrils">
									<view class="nostril"></view>
									<view class="nostril"></view>
								</view>
								<view class="eye eye-left">
									<view class="eye-white" :class="{ 'is-blink': isBlinking }">
										<view class="eye-iris">
											<view class="eye-pupil"></view>
											<view class="eye-highlight"></view>
										</view>
										<view class="eye-lid"></view>
									</view>
								</view>
								<view class="eye eye-right">
									<view class="eye-white" :class="{ 'is-blink': isBlinking }">
										<view class="eye-iris">
											<view class="eye-pupil"></view>
											<view class="eye-highlight"></view>
										</view>
										<view class="eye-lid"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isGameOver" class="game-over-mask">
			<view class="game-over-card">
				<text class="game-over-title">游戏结束</text>
				<text class="game-over-desc">鳄鱼咬到你了</text>
				<view class="game-over-actions">
					<view class="game-over-btn" @tap="resetGame">再来一局</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'

	const backgroundImage = '/static/assets/crocodile/background.jpg'
	const noiseImage = '/static/assets/crocodile/noise.png'
	const backIcon = '/static/assets/crocodile/icon-back.svg'
	const clickSound = '/static/assets/crocodile/croco-click.mp3'
	const biteSound = '/static/assets/crocodile/croco-bite.mp3'

	const navActionStyle = ref({})
	const navTitleStyle = ref({})
	const isBlinking = ref(false)
	const isMouthClosing = ref(false)
	const isGameOver = ref(false)
	const soundEnabled = ref(true)
	const hapticEnabled = ref(true)

	let blinkTimer = null
	let gameOverTimer = null
	let clickAudio = null
	let biteAudio = null

	const storageKeys = {
		soundEnabled: 'settings.soundEnabled',
		hapticEnabled: 'settings.hapticEnabled'
	}

	const teeth = ref(
		Array.from({ length: 10 }, (_, index) => {
			const side = index < 5 ? 'left' : 'right'
			return {
				id: `${side}-${index % 5}`,
				side,
				state: 'idle',
				pulse: false,
				pressed: false
			}
		})
	)
	const badToothId = ref('')

	const loadSettings = () => {
		const soundValue = uni.getStorageSync(storageKeys.soundEnabled)
		const hapticValue = uni.getStorageSync(storageKeys.hapticEnabled)
		if (typeof soundValue === 'boolean') {
			soundEnabled.value = soundValue
		}
		if (typeof hapticValue === 'boolean') {
			hapticEnabled.value = hapticValue
		}
	}

	const initAudio = () => {
		try {
			clickAudio = uni.createInnerAudioContext()
			clickAudio.src = clickSound
			biteAudio = uni.createInnerAudioContext()
			biteAudio.src = biteSound
		} catch (error) {
			console.error('Failed to init audio:', error)
		}
	}

	const destroyAudio = () => {
		if (clickAudio) {
			clickAudio.destroy()
			clickAudio = null
		}
		if (biteAudio) {
			biteAudio.destroy()
			biteAudio = null
		}
	}

	const playClickSound = () => {
		if (soundEnabled.value && clickAudio) {
			clickAudio.seek(0)
			clickAudio.play()
		}
	}

	const playBiteSound = () => {
		if (soundEnabled.value && biteAudio) {
			biteAudio.seek(0)
			biteAudio.play()
		}
	}

	const triggerHaptic = () => {
		if (hapticEnabled.value) {
			uni.vibrateShort({
				type: 'light'
			})
		}
	}

	const handleBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const teethLeft = computed(() => teeth.value.filter((tooth) => tooth.side === 'left'))
	const teethRight = computed(() => teeth.value.filter((tooth) => tooth.side === 'right'))

	const handleToothTap = (tooth) => {
		if (tooth.state !== 'idle') {
			return
		}
		if (isGameOver.value || isMouthClosing.value) {
			return
		}
		tooth.pressed = true
		triggerHaptic()

		if (tooth.id === badToothId.value) {
			tooth.state = 'hit'
			isMouthClosing.value = true
			playBiteSound()
			if (gameOverTimer) {
				clearTimeout(gameOverTimer)
			}
			gameOverTimer = setTimeout(() => {
				isGameOver.value = true
				gameOverTimer = null
			}, 420)
			return
		}

		tooth.state = 'miss'
		tooth.pulse = true
		playClickSound()
		triggerBlink()
		setTimeout(() => {
			tooth.pulse = false
		}, 450)
	}

	const triggerBlink = () => {
		if (blinkTimer) {
			clearTimeout(blinkTimer)
			blinkTimer = null
		}
		isBlinking.value = false
		nextTick(() => {
			isBlinking.value = true
			blinkTimer = setTimeout(() => {
				isBlinking.value = false
				blinkTimer = null
			}, 320)
		})
	}

	const resetGame = () => {
		isGameOver.value = false
		isMouthClosing.value = false
		if (gameOverTimer) {
			clearTimeout(gameOverTimer)
			gameOverTimer = null
		}
		teeth.value.forEach((tooth) => {
			tooth.state = 'idle'
			tooth.pulse = false
			tooth.pressed = false
		})
		const randomIndex = Math.floor(Math.random() * teeth.value.length)
		badToothId.value = teeth.value[randomIndex]?.id || ''
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
		loadSettings()
		initAudio()
		const randomIndex = Math.floor(Math.random() * teeth.value.length)
		badToothId.value = teeth.value[randomIndex]?.id || ''
	})

	onShow(() => {
		loadSettings()
	})

	onUnmounted(() => {
		destroyAudio()
		if (blinkTimer) clearTimeout(blinkTimer)
		if (gameOverTimer) clearTimeout(gameOverTimer)
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
		height: 100vh;
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
		flex: 1;
		padding: 0;
		box-sizing: border-box;
	}

	.game-panel {
		position: relative;
		width: 100%;
		height: 100%;
		background: #1a0b2e;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.game-panel-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 50%, #2d1b4e 0%, #22143b 25%, #170e27 50%, #0b0714 75%, #06030a 87.5%, #000000 100%);
		z-index: 0;
	}

	.game-center {
		position: relative;
		width: 658.47rpx;
		height: 1288.98rpx;
		z-index: 1;
	}

	.game-title {
		position: absolute;
		left: 0;
		right: 0;
		top: 30.51rpx;
		display: flex;
		justify-content: center;
		text-align: center;
	}

	.game-title-text {
		font-size: 57.2rpx;
		line-height: 68.64rpx;
		font-weight: 900;
		letter-spacing: 2.86rpx;
		text-transform: uppercase;
		color: #00d492;
		text-shadow: 0 0 57rpx rgba(52, 211, 153, 0.8);
	}

	.crocodile {
		position: absolute;
		left: 39.22rpx;
		top: 251.7rpx;
		width: 549.15rpx;
		height: 823.73rpx;
	}

	.crocodile-glow {
		position: absolute;
		left: -27.46rpx;
		top: -41.19rpx;
		width: 604.07rpx;
		height: 906.1rpx;
		background: rgba(0, 188, 125, 0.2);
		opacity: 0.66;
		filter: blur(64px);
		border-radius: 9999rpx;
	}

	.crocodile-mouth {
		position: absolute;
		left: 50%;
		top: 220rpx;
		width: 520rpx;
		height: 640rpx;
		background: #8bc34a;
		border: 15.25rpx solid #558b2f;
		border-radius: 38.14rpx 38.14rpx 170rpx 170rpx;
		box-sizing: border-box;
		overflow: hidden;
		transform: translateX(-50%);
		transition: height 0.35s ease, border-radius 0.35s ease;
	}

	.mouth-inner {
		position: absolute;
		left: 36rpx;
		right: 36rpx;
		top: 52rpx;
		bottom: 92rpx;
		background: #5d1a1a;
		border-radius: 76.27rpx 76.27rpx 120rpx 120rpx;
		overflow: hidden;
		transform-origin: top;
		transition: transform 0.35s ease, opacity 0.35s ease;
	}

	.mouth-shadow {
		position: absolute;
		left: 50%;
		top: 52%;
		width: 240rpx;
		height: 240rpx;
		background: #2a0a0a;
		filter: blur(12px);
		border-radius: 9999rpx;
		transform: translateX(-50%);
		transition: transform 0.35s ease, opacity 0.35s ease;
	}

	.tongue {
		position: absolute;
		left: 50%;
		top: 34%;
		width: 240rpx;
		height: 310rpx;
		background: #d65c5c;
		opacity: 0.9;
		border-radius: 9999rpx 9999rpx 0 0;
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
		transform: translateX(-50%);
		transform-origin: top;
		transition: transform 0.35s ease, opacity 0.35s ease;
	}

	.mouth-inner-shadow {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
		pointer-events: none;
	}

	.tooth-column {
		position: absolute;
		top: 70rpx;
		bottom: 20rpx;
		width: 82.37rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 24rpx;
		z-index: 2;
	}

	.tooth-column.left {
		left: 19.07rpx;
	}

	.tooth-column.right {
		right: 19.07rpx;
	}

	.tooth-wrapper {
		position: relative;
		width: 82.37rpx;
		height: 88rpx;
	}

	.tooth-under {
		position: absolute;
		inset: -10rpx;
		background: rgba(0, 188, 125, 0.35);
		filter: blur(12px);
		opacity: 0;
		border-radius: 9999rpx;
	}

	.tooth-under.is-active {
		animation: toothPulse 0.45s ease-out;
	}

	.tooth-core {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 100%;
		border-radius: 24rpx;
		background: linear-gradient(180deg, #ffffff 0%, #f5f5f4 100%);
		box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.2);
		transition: opacity 0.2s ease, filter 0.2s ease, background 0.2s ease, transform 0.2s ease;
	}

	.tooth-core.is-pressed {
		animation: toothPress 0.22s ease-out forwards;
	}

	.tooth-core.is-miss {
		opacity: 0.35;
		filter: grayscale(0.6);
		background: linear-gradient(180deg, #e5e5e5 0%, #bdbdbd 100%);
	}

	.tooth-core.is-hit {
		background: linear-gradient(180deg, #ffd1d1 0%, #ff6b6b 100%);
		box-shadow: 0 0 24px rgba(255, 107, 107, 0.6);
	}

	.mouth-shadow-inner {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
		pointer-events: none;
	}

	@keyframes toothPulse {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		40% {
			opacity: 0.7;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.4);
		}
	}

	@keyframes toothPress {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(50%);
		}
	}

	.crocodile-head {
		position: absolute;
		left: 0;
		top: 0;
		width: 549.15rpx;
		height: 343.22rpx;
		background: #8bc34a;
		border: 15.25rpx solid #558b2f;
		border-radius: 114.41rpx 114.41rpx 76.27rpx 76.27rpx;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
		box-sizing: border-box;
		overflow: visible;
		transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1.1);
	}

	.crocodile.is-closing .crocodile-head {
		transform: translateY(210rpx);
	}

	.crocodile.is-closing .crocodile-mouth {
		height: 300rpx;
		border-radius: 38.14rpx 38.14rpx 90rpx 90rpx;
	}

	.crocodile.is-closing .mouth-inner {
		transform: scaleY(0.2);
		opacity: 0.2;
	}

	.crocodile.is-closing .tongue {
		opacity: 0;
		transform: translateX(-50%) scaleY(0.1);
	}

	.crocodile.is-closing .mouth-shadow {
		opacity: 0;
		transform: translateX(-50%) scale(0.3);
	}

	.head-bump {
		position: absolute;
		width: 205.93rpx;
		height: 164.75rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.head-bump-shape {
		width: 180.45rpx;
		height: 80.21rpx;
		background: #8bc34a;
		border: 7.63rpx solid #558b2f;
		border-radius: 9999rpx;
		box-sizing: border-box;
	}

	.bump-left {
		left: 0rpx;
		top: -80.33rpx;
	}

	.bump-left .head-bump-shape {
		transform: rotate(-15deg);
	}

	.bump-right {
		left: 338.87rpx;
		top: -80.33rpx;
	}

	.bump-right .head-bump-shape {
		transform: rotate(15deg);
	}

	.nostrils {
		position: absolute;
		left: 204.41rpx;
		top: 231.86rpx;
		width: 109.83rpx;
		height: 41.19rpx;
		display: flex;
		gap: 54.92rpx;
	}

	.nostril {
		width: 27.46rpx;
		height: 41.19rpx;
		background: #33691e;
		opacity: 0.6;
		border-radius: 9999rpx;
	}

	.eye {
		position: absolute;
		width: 137.29rpx;
		height: 164.75rpx;
		background: transparent;
		border: 7.63rpx solid #6db33f;
		border-radius: 9999rpx;
		box-sizing: border-box;
		overflow: hidden;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
	}

	.eye-left {
		left: 39.66rpx;
		top: 25.93rpx;
	}

	.eye-right {
		left: 372.2rpx;
		top: 25.93rpx;
	}

	.eye-white {
		position: absolute;
		inset: 0;
		background: #ffffff;
		border-radius: inherit;
		overflow: hidden;
	}

	.eye-white.is-blink {
		animation: eyeBlink 0.22s cubic-bezier(0.2, 0.8, 0.2, 1.2);
	}

	.eye-iris {
		position: absolute;
		left: 19.83rpx;
		top: 40.42rpx;
		width: 82.37rpx;
		height: 96.1rpx;
		background: #fe9a00;
		border-radius: 9999rpx;
	}

	.eye-pupil {
		position: absolute;
		left: 24.03rpx;
		top: 20.59rpx;
		width: 34.32rpx;
		height: 54.92rpx;
		background: #000000;
		border-radius: 9999rpx;
	}

	.eye-highlight {
		position: absolute;
		left: 48.05rpx;
		top: 13.73rpx;
		width: 20.59rpx;
		height: 20.59rpx;
		background: #ffffff;
		opacity: 0.8;
		border-radius: 9999rpx;
	}

	.eye-lid {
		position: absolute;
		left: -0.76rpx;
		top: -0.76rpx;
		width: 123.56rpx;
		height: 15.09rpx;
		background: #6db33f;
	}

	@keyframes eyeBlink {
		0% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(28rpx);
		}
		70% {
			transform: translateY(-6rpx);
		}
		100% {
			transform: translateY(0);
		}
	}

	.game-over-mask {
		position: fixed;
		inset: 0;
		background: rgba(8, 10, 14, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 30;
	}

	.game-over-card {
		width: 560rpx;
		background: rgba(18, 22, 30, 0.95);
		border: 1rpx solid rgba(255, 255, 255, 0.08);
		border-radius: 28rpx;
		padding: 48rpx 40rpx 40rpx;
		text-align: center;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
	}

	.game-over-title {
		font-size: 40rpx;
		font-weight: 700;
		letter-spacing: 2rpx;
		color: #ffffff;
	}

	.game-over-desc {
		display: block;
		margin-top: 16rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.6);
	}

	.game-over-actions {
		margin-top: 36rpx;
		display: flex;
		justify-content: center;
	}

	.game-over-btn {
		padding: 18rpx 60rpx;
		border-radius: 9999rpx;
		background: linear-gradient(90deg, #00d492 0%, #00b7ff 100%);
		color: #0b0f14;
		font-weight: 700;
		letter-spacing: 2rpx;
	}
</style>

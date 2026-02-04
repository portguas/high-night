<template>
	<view class="dice-page">
		<view class="dice-bg">
			<image class="dice-bg__image" :src="atmosphereImage" mode="aspectFill" />
			<view class="dice-bg__gradient"></view>
		</view>

		<view class="nav-action" :style="navActionStyle" @tap="handleBack">
			<view class="nav-title" :style="navTitleStyle">
				<text class="nav-title-text">摇一摇</text>
			</view>
			<view class="nav-action" :style="navActionStyle" @tap="handleBack">
				<image class="nav-back-icon" :src="backIcon" mode="aspectFit" />
			</view>
		</view>

		<view class="dice-layout">
			<view class="dice-layout__inner" :style="{ transform: `scale(${layoutScale})` }">
				<view class="dice-stage">
					<view class="dice-cluster" :class="{ 'is-revealed': isRevealed }">
					<view class="dice dice--a">
						<view class="dice__face">
							<view class="dice__pip dice__pip--a1">
								<view v-if="isDotVisible(diceValues[0], 0)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a2">
								<view v-if="isDotVisible(diceValues[0], 1)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a3">
								<view v-if="isDotVisible(diceValues[0], 2)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a4">
								<view v-if="isDotVisible(diceValues[0], 3)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a5">
								<view v-if="isDotVisible(diceValues[0], 4)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a6">
								<view v-if="isDotVisible(diceValues[0], 5)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a7">
								<view v-if="isDotVisible(diceValues[0], 6)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a8">
								<view v-if="isDotVisible(diceValues[0], 7)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--a9">
								<view v-if="isDotVisible(diceValues[0], 8)" class="dice__dot"></view>
							</view>
							<view class="dice__shine"></view>
						</view>
					</view>

					<view class="dice dice--b">
						<view class="dice__face">
							<view class="dice__pip dice__pip--b1">
								<view v-if="isDotVisible(diceValues[1], 0)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b2">
								<view v-if="isDotVisible(diceValues[1], 1)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b3">
								<view v-if="isDotVisible(diceValues[1], 2)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b4">
								<view v-if="isDotVisible(diceValues[1], 3)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b5">
								<view v-if="isDotVisible(diceValues[1], 4)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b6">
								<view v-if="isDotVisible(diceValues[1], 5)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b7">
								<view v-if="isDotVisible(diceValues[1], 6)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b8">
								<view v-if="isDotVisible(diceValues[1], 7)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--b9">
								<view v-if="isDotVisible(diceValues[1], 8)" class="dice__dot"></view>
							</view>
							<view class="dice__shine"></view>
						</view>
					</view>

					<view class="dice dice--c">
						<view class="dice__face">
							<view class="dice__pip dice__pip--c1">
								<view v-if="isDotVisible(diceValues[2], 0)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c2">
								<view v-if="isDotVisible(diceValues[2], 1)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c3">
								<view v-if="isDotVisible(diceValues[2], 2)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c4">
								<view v-if="isDotVisible(diceValues[2], 3)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c5">
								<view v-if="isDotVisible(diceValues[2], 4)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c6">
								<view v-if="isDotVisible(diceValues[2], 5)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c7">
								<view v-if="isDotVisible(diceValues[2], 6)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c8">
								<view v-if="isDotVisible(diceValues[2], 7)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--c9">
								<view v-if="isDotVisible(diceValues[2], 8)" class="dice__dot"></view>
							</view>
							<view class="dice__shine"></view>
						</view>
					</view>

					<view class="dice dice--d">
						<view class="dice__face">
							<view class="dice__pip dice__pip--d1">
								<view v-if="isDotVisible(diceValues[3], 0)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d2">
								<view v-if="isDotVisible(diceValues[3], 1)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d3">
								<view v-if="isDotVisible(diceValues[3], 2)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d4">
								<view v-if="isDotVisible(diceValues[3], 3)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d5">
								<view v-if="isDotVisible(diceValues[3], 4)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d6">
								<view v-if="isDotVisible(diceValues[3], 5)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d7">
								<view v-if="isDotVisible(diceValues[3], 6)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d8">
								<view v-if="isDotVisible(diceValues[3], 7)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--d9">
								<view v-if="isDotVisible(diceValues[3], 8)" class="dice__dot"></view>
							</view>
							<view class="dice__shine"></view>
						</view>
					</view>

					<view class="dice dice--e">
						<view class="dice__face">
							<view class="dice__pip dice__pip--e1">
								<view v-if="isDotVisible(diceValues[4], 0)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e2">
								<view v-if="isDotVisible(diceValues[4], 1)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e3">
								<view v-if="isDotVisible(diceValues[4], 2)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e4">
								<view v-if="isDotVisible(diceValues[4], 3)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e5">
								<view v-if="isDotVisible(diceValues[4], 4)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e6">
								<view v-if="isDotVisible(diceValues[4], 5)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e7">
								<view v-if="isDotVisible(diceValues[4], 6)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e8">
								<view v-if="isDotVisible(diceValues[4], 7)" class="dice__dot"></view>
							</view>
							<view class="dice__pip dice__pip--e9">
								<view v-if="isDotVisible(diceValues[4], 8)" class="dice__dot"></view>
							</view>
							<view class="dice__shine"></view>
						</view>
						</view>
					</view>

					<view
						class="dice-cup"
						:style="cupStyle"
						@touchstart="handleCupTouchStart"
						@touchmove.stop="handleCupTouchMove"
						@touchend="handleCupTouchEnd"
						@touchcancel="handleCupTouchEnd"
						@tap="handleCupTap"
					>
						<view class="dice-cup__inner" :class="{ 'is-shaking': isShaking }">
							<view class="cup">
								<view class="cup__highlight"></view>
								<view class="cup__handle">
									<view class="cup__handle-bar"></view>
								</view>
								<view class="cup__base"></view>
								<view class="cup__icon">
									<image class="cup__icon-top" :src="crownTop" mode="aspectFit" />
									<image class="cup__icon-base" :src="crownBase" mode="aspectFit" />
								</view>
							</view>
							<view class="cup__shadow"></view>
						</view>
					</view>

					<text class="dice-stage__tip" :class="{ 'is-hidden': cupOpen || isDragging }">
						{{ isShaking ? 'Rolling...' : 'Slide Up to Reveal' }}
					</text>
				</view>

				<view class="dice-actions">
					<view class="dice-actions__primary" :class="{ 'is-disabled': isShaking }" @tap="handleShake">
						<text class="dice-actions__primary-text">SHAKE</text>
					</view>
					<view class="dice-actions__secondary" @tap="handleSettings">
						<image class="dice-actions__icon" :src="gearIcon" mode="aspectFit" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, onMounted, onUnmounted, ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'

	const atmosphereImage = '/static/assets/dice/atmosphere.png'
	const crownTop = '/static/assets/dice/crown-top.svg'
	const crownBase = '/static/assets/dice/crown-base.svg'
	const gearIcon = '/static/assets/dice/icon-gear.svg'
	const backIcon = '/static/assets/rps/icon-back.svg'
	const diceSound = '/static/assets/party/dice-shake.wav'
	const navActionStyle = ref({})
	const layoutScale = ref(1)
	const isShaking = ref(false)
	const isDragging = ref(false)
	const cupOpen = ref(false)
	const cupOffset = ref(0)
	const touchStartY = ref(0)
	const touchStartOffset = ref(0)
	const soundEnabled = ref(true)
	const hapticEnabled = ref(true)
	const diceValues = ref([1, 1, 1, 1, 1])
	const rpxRatio = ref(750 / 393.333)
	let shakeTimer = null
	let diceAudio = null

	const storageKeys = {
		soundEnabled: 'settings.soundEnabled',
		hapticEnabled: 'settings.hapticEnabled'
	}

	const dotMap = {
		1: [4],
		2: [0, 8],
		3: [0, 4, 8],
		4: [0, 2, 6, 8],
		5: [0, 2, 4, 6, 8],
		6: [0, 2, 3, 5, 6, 8]
	}

	const toRpx = (px) => px * rpxRatio.value
	const cupLiftPx = 250
	const cupThresholdPx = 100

	const isRevealed = computed(() => cupOpen.value || cupOffset.value <= -toRpx(cupThresholdPx))

	const cupStyle = computed(() => {
		return {
			transform: `translateY(${cupOffset.value}rpx)`,
			transition: isDragging.value ? 'none' : 'transform 0.3s ease'
		}
	})

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
				rpxRatio.value = 750 / systemInfo.screenWidth
				navActionStyle.value = {
					top,
					left: `${gap}px`,
					width: `${menuButton.height}px`,
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
	}

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

	const setLayoutScale = () => {
		try {
			const systemInfo = uni.getSystemInfoSync()
			if (systemInfo?.screenWidth) {
				rpxRatio.value = 750 / systemInfo.screenWidth
			}
			if (systemInfo?.screenHeight) {
				const safeBottom = systemInfo?.safeAreaInsets?.bottom || 0
				const availableHeight = systemInfo.screenHeight - safeBottom
				const scale = availableHeight / 852
				layoutScale.value = scale < 1 ? scale : 1
			}
		} catch (error) {
		}
	}

	const initAudio = () => {
		if (diceAudio) {
			return
		}
		try {
			diceAudio = uni.createInnerAudioContext()
			diceAudio.src = diceSound
			diceAudio.volume = 0.6
		} catch (error) {
		}
	}

	const destroyAudio = () => {
		if (!diceAudio) {
			return
		}
		try {
			diceAudio.destroy()
		} catch (error) {
		} finally {
			diceAudio = null
		}
	}

	const rollDice = () => {
		diceValues.value = diceValues.value.map(() => Math.floor(Math.random() * 6) + 1)
	}

	const isDotVisible = (value, index) => {
		return (dotMap[value] || []).includes(index)
	}

	const closeCup = () => {
		cupOpen.value = false
		cupOffset.value = 0
	}

	const openCup = () => {
		cupOpen.value = true
		cupOffset.value = -toRpx(cupLiftPx)
	}

	const triggerHaptic = () => {
		if (!hapticEnabled.value) {
			return
		}
		try {
			uni.vibrateShort({
				type: 'light'
			})
		} catch (error) {
		}
	}

	const playSound = () => {
		if (!soundEnabled.value || !diceAudio) {
			return
		}
		try {
			diceAudio.seek(0)
			diceAudio.play()
		} catch (error) {
		}
	}

	onMounted(() => {
		setNavActionStyle()
		setLayoutScale()
		loadSettings()
		initAudio()
		rollDice()
	})

	onShow(() => {
		loadSettings()
	})

	onUnmounted(() => {
		if (shakeTimer) {
			clearTimeout(shakeTimer)
			shakeTimer = null
		}
		destroyAudio()
	})

	const handleBack = async () => {
		try {
			await uni.navigateBack({
				delta: 1
			})
		} catch (error) {
		}
	}

	const handleShake = async () => {
		if (isShaking.value) {
			return
		}
		isShaking.value = true
		if (cupOpen.value || cupOffset.value < 0) {
			closeCup()
		}
		triggerHaptic()
		playSound()
		if (shakeTimer) {
			clearTimeout(shakeTimer)
		}
		shakeTimer = setTimeout(() => {
			rollDice()
			isShaking.value = false
			shakeTimer = null
		}, 600)
	}

	const handleSettings = async () => {
		try {
			await uni.navigateTo({
				url: '/pages/settings/index'
			})
		} catch (error) {
		}
	}

	const handleCupTouchStart = (event) => {
		if (isShaking.value) {
			return
		}
		const touch = event.touches?.[0]
		if (!touch) {
			return
		}
		isDragging.value = true
		touchStartY.value = touch.clientY
		touchStartOffset.value = cupOffset.value
	}

	const handleCupTouchMove = (event) => {
		if (!isDragging.value) {
			return
		}
		const touch = event.touches?.[0]
		if (!touch) {
			return
		}
		const deltaRpx = (touch.clientY - touchStartY.value) * rpxRatio.value
		const minOffset = -toRpx(cupLiftPx)
		const nextOffset = Math.min(0, Math.max(minOffset, touchStartOffset.value + deltaRpx))
		cupOffset.value = nextOffset
	}

	const handleCupTouchEnd = () => {
		if (!isDragging.value) {
			return
		}
		isDragging.value = false
		if (cupOffset.value <= -toRpx(cupThresholdPx)) {
			openCup()
		} else {
			closeCup()
		}
	}

	const handleCupTap = () => {
		if (cupOpen.value) {
			closeCup()
		}
	}
</script>

<style lang="scss" scoped>
	$scale: 750 / 393.333;

	@function r($px) {
		@return $px * $scale * 1rpx;
	}

	.dice-page {
		background: #0a0a0f;
		box-sizing: border-box;
		display: flex;
		height: 100vh;
		justify-content: center;
		overflow: hidden;
		padding-bottom: env(safe-area-inset-bottom);
		position: relative;
	}

	.dice-bg {
		bottom: 0;
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
	}

	.dice-bg__image {
		height: 100%;
		left: 0;
		opacity: 0.4;
		position: absolute;
		top: 0;
		width: 100%;
		filter: blur(8px);
	}

	.dice-bg__gradient {
		background: linear-gradient(to top, #0a0a0f 0%, rgba(10, 10, 15, 0.8) 50%, rgba(0, 0, 0, 0) 100%);
		bottom: 0;
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
	}

	.dice-layout {
		height: 100%;
		overflow: hidden;
		position: relative;
		width: 100%;
	}

	.dice-layout__inner {
		height: r(852);
		left: 50%;
		margin-left: -375rpx;
		position: absolute;
		top: 0;
		transform-origin: top center;
		width: 750rpx;
	}

	.nav-action {
		position: fixed;
		z-index: 10;
		width: 76rpx;
		height: 76rpx;
		border-radius: 9999rpx;
		background: rgba(255, 255, 255, 0.05);
		border: 1.27rpx solid rgba(255, 255, 255, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.nav-back-icon {
		width: 26.69rpx;
		height: 26.69rpx;
	}

	.dice-header {
		align-items: center;
		display: flex;
		flex-direction: row;
		gap: r(8);
		height: r(100);
		left: 0;
		opacity: 0.7;
		padding-top: r(48);
		position: absolute;
		top: 0;
		width: 100%;
	}

	.dice-header__title {
		color: rgba(255, 255, 255, 0.9);
		font-family: Arial, sans-serif;
		font-size: r(24);
		font-weight: 700;
		letter-spacing: r(-0.6);
		line-height: r(32);
		text-align: center;
	}

	.dice-stage {
		height: r(640);
		left: 0;
		position: absolute;
		top: r(100);
		width: 100%;
	}

	.dice-cluster {
		height: r(176);
		left: 50%;
		opacity: 0;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%) scale(0.98);
		transition: opacity 0.3s ease, transform 0.3s ease;
		width: r(240);
		z-index: 1;
	}

	.dice-cluster.is-revealed {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.dice {
		align-items: center;
		display: flex;
		justify-content: center;
		position: absolute;
	}

	.dice__face {
		background: #ffffff;
		border-radius: r(14);
		box-shadow: 0 0 0 r(1) #d1d5dc, 0 r(10) r(15) r(-3) rgba(0, 0, 0, 0.1), 0 r(4) r(6) r(-4) rgba(0, 0, 0, 0.1);
		overflow: hidden;
		position: relative;
	}

	.dice__pip {
		align-items: center;
		display: flex;
		justify-content: center;
		position: absolute;
	}

	.dice__dot {
		background: #000000;
		border-radius: 9999px;
		box-shadow: 0 r(1) r(3) 0 rgba(0, 0, 0, 0.1), 0 r(1) r(2) 0 rgba(0, 0, 0, 0.1);
		height: 100%;
		width: 100%;
	}

	.dice__shine {
		background: linear-gradient(135deg, #ffffff 0%, rgba(0, 0, 0, 0) 50%, #e5e7eb 100%);
		bottom: 0;
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
	}

	.dice--a {
		height: r(61.823);
		left: r(20.83);
		top: r(28.76);
		transform: rotate(8.37deg);
		width: r(61.823);
	}

	.dice--a .dice__face {
		height: r(54.475);
		width: r(54.475);
	}

	.dice--a .dice__pip {
		height: r(9.079);
		width: r(9.079);
	}

	.dice__pip--a1 {
		left: r(12.57);
		top: r(9.08);
	}

	.dice__pip--a2 {
		left: r(20.49);
		top: r(10.24);
	}

	.dice__pip--a3 {
		left: r(28.4);
		top: r(11.41);
	}

	.dice__pip--a4 {
		left: r(36.32);
		top: r(12.57);
	}

	.dice__pip--a5 {
		left: r(10.83);
		top: r(20.95);
	}

	.dice__pip--a6 {
		left: r(18.74);
		top: r(22.12);
	}

	.dice__pip--a7 {
		left: r(26.66);
		top: r(23.28);
	}

	.dice__pip--a8 {
		left: r(34.57);
		top: r(24.44);
	}

	.dice__pip--a9 {
		left: r(9.08);
		top: r(32.82);
	}

	.dice--b {
		height: r(58.038);
		left: r(88.06);
		top: r(29.61);
		transform: rotate(6.04deg);
		width: r(58.038);
	}

	.dice--b .dice__face {
		height: r(52.781);
		width: r(52.781);
	}

	.dice--b .dice__pip {
		height: r(8.797);
		width: r(8.797);
	}

	.dice__pip--b1 {
		left: r(11.32);
		top: r(8.8);
	}

	.dice__pip--b2 {
		left: r(19.28);
		top: r(9.64);
	}

	.dice__pip--b3 {
		left: r(27.23);
		top: r(10.48);
	}

	.dice__pip--b4 {
		left: r(35.19);
		top: r(11.32);
	}

	.dice__pip--b5 {
		left: r(10.06);
		top: r(20.73);
	}

	.dice__pip--b6 {
		left: r(18.01);
		top: r(21.57);
	}

	.dice__pip--b7 {
		left: r(25.97);
		top: r(22.41);
	}

	.dice__pip--b8 {
		left: r(33.93);
		top: r(23.25);
	}

	.dice__pip--b9 {
		left: r(8.8);
		top: r(32.66);
	}

	.dice--c {
		height: r(52.826);
		left: r(156.29);
		top: r(30.82);
		transform: rotate(2.89deg);
		width: r(52.826);
	}

	.dice--c .dice__face {
		height: r(50.355);
		width: r(50.355);
	}

	.dice--c .dice__pip {
		height: r(8.393);
		width: r(8.393);
	}

	.dice__pip--c1 {
		left: r(9.6);
		top: r(8.39);
	}

	.dice__pip--c2 {
		left: r(17.59);
		top: r(8.8);
	}

	.dice__pip--c3 {
		left: r(25.58);
		top: r(9.2);
	}

	.dice__pip--c4 {
		left: r(33.57);
		top: r(9.6);
	}

	.dice__pip--c5 {
		left: r(9);
		top: r(20.38);
	}

	.dice__pip--c6 {
		left: r(16.99);
		top: r(20.78);
	}

	.dice__pip--c7 {
		left: r(24.98);
		top: r(21.18);
	}

	.dice__pip--c8 {
		left: r(32.97);
		top: r(21.59);
	}

	.dice__pip--c9 {
		left: r(8.39);
		top: r(32.36);
	}

	.dice--d {
		height: r(51.053);
		left: r(31.25);
		top: r(93.67);
		transform: rotate(-1.82deg);
		width: r(51.053);
	}

	.dice--d .dice__face {
		height: r(49.503);
		width: r(49.503);
	}

	.dice--d .dice__pip {
		height: r(8.25);
		width: r(8.25);
	}

	.dice__pip--d1 {
		left: r(8.25);
		top: r(9.01);
	}

	.dice__pip--d2 {
		left: r(16.25);
		top: r(8.76);
	}

	.dice__pip--d3 {
		left: r(24.24);
		top: r(8.51);
	}

	.dice__pip--d4 {
		left: r(32.24);
		top: r(8.25);
	}

	.dice__pip--d5 {
		left: r(8.63);
		top: r(21.01);
	}

	.dice__pip--d6 {
		left: r(16.63);
		top: r(20.75);
	}

	.dice__pip--d7 {
		left: r(24.62);
		top: r(20.5);
	}

	.dice__pip--d8 {
		left: r(32.62);
		top: r(20.24);
	}

	.dice__pip--d9 {
		left: r(9.01);
		top: r(33);
	}

	.dice--e {
		height: r(71.905);
		left: r(90.63);
		top: r(75.49);
		transform: rotate(-14.93deg);
		width: r(71.905);
	}

	.dice--e .dice__face {
		height: r(58.749);
		width: r(58.749);
	}

	.dice--e .dice__pip {
		height: r(9.791);
		width: r(9.791);
	}

	.dice__pip--e1 {
		left: r(9.79);
		top: r(15.98);
	}

	.dice__pip--e2 {
		left: r(17.52);
		top: r(13.91);
	}

	.dice__pip--e3 {
		left: r(25.25);
		top: r(11.85);
	}

	.dice__pip--e4 {
		left: r(32.98);
		top: r(9.79);
	}

	.dice__pip--e5 {
		left: r(12.88);
		top: r(27.57);
	}

	.dice__pip--e6 {
		left: r(20.61);
		top: r(25.51);
	}

	.dice__pip--e7 {
		left: r(28.34);
		top: r(23.45);
	}

	.dice__pip--e8 {
		left: r(36.07);
		top: r(21.39);
	}

	.dice__pip--e9 {
		left: r(15.98);
		top: r(39.17);
	}

	.dice-cup {
		height: r(288);
		left: r(68.67);
		position: absolute;
		top: r(176);
		width: r(256);
		z-index: 2;
	}

	.dice-cup__inner {
		height: 100%;
		position: relative;
		width: 100%;
	}

	.dice-cup__inner.is-shaking {
		animation: cup-shake 0.6s ease-in-out;
	}

	@keyframes cup-shake {
		0% {
			transform: translateX(0) rotate(0deg);
		}
		12.5% {
			transform: translateX(r(-15)) rotate(-5deg);
		}
		25% {
			transform: translateX(r(15)) rotate(5deg);
		}
		37.5% {
			transform: translateX(r(-10)) rotate(-3deg);
		}
		50% {
			transform: translateX(r(10)) rotate(3deg);
		}
		62.5% {
			transform: translateX(r(-5)) rotate(-1deg);
		}
		75% {
			transform: translateX(r(5)) rotate(1deg);
		}
		100% {
			transform: translateX(0) rotate(0deg);
		}
	}

	.cup {
		background: linear-gradient(to bottom, #314158 0%, #0f172b 100%);
		border-radius: r(64) r(64) r(32) r(32);
		border-top: r(0.667) solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 r(25) r(50) r(-12) rgba(0, 0, 0, 0.25);
		height: 100%;
		overflow: hidden;
		position: relative;
		width: 100%;
	}

	.cup__highlight {
		background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0) 100%);
		height: 100%;
		left: r(33.46);
		position: absolute;
		top: 0;
		width: r(189.075);
		filter: blur(24px);
	}

	.cup__handle {
		align-items: center;
		display: flex;
		height: r(4);
		justify-content: center;
		left: 0;
		opacity: 0.3;
		position: absolute;
		top: r(260);
		width: 100%;
	}

	.cup__handle-bar {
		background: rgba(255, 255, 255, 0.5);
		border-radius: 9999px;
		height: r(4);
		width: r(48);
	}

	.cup__base {
		background: #1a1a20;
		border-top: r(0.667) solid rgba(255, 255, 255, 0.05);
		height: r(16);
		left: 0;
		position: absolute;
		top: r(271.33);
		width: 100%;
	}

	.cup__icon {
		height: r(80);
		left: r(88);
		position: absolute;
		top: r(104);
		width: r(80);
	}

	.cup__icon-top {
		height: 58.3%;
		left: 8.34%;
		position: absolute;
		top: 12.53%;
		width: 83.32%;
	}

	.cup__icon-base {
		height: 12.5%;
		left: 20.83%;
		position: absolute;
		top: 87.5%;
		width: 58.34%;
	}

	.cup__shadow {
		background: rgba(0, 0, 0, 0.6);
		height: r(16);
		left: r(12.8);
		position: absolute;
		top: r(288);
		width: r(230.396);
		filter: blur(16px);
	}

	.dice-stage__tip {
		color: rgba(255, 255, 255, 0.3);
		font-family: Arial, sans-serif;
		font-size: r(14);
		left: 50%;
		line-height: r(20);
		opacity: 1;
		position: absolute;
		text-align: center;
		top: r(540);
		transform: translate(-50%, 0);
		transition: opacity 0.2s ease, transform 0.2s ease;
		width: r(115.156);
	}

	.dice-stage__tip.is-hidden {
		opacity: 0;
		transform: translate(-50%, r(6));
	}

	.dice-actions {
		align-items: center;
		box-sizing: border-box;
		display: flex;
		gap: r(16);
		height: r(112);
		left: 0;
		padding: 0 r(24);
		position: absolute;
		top: r(740);
		width: 100%;
	}

	.dice-actions__primary {
		align-items: center;
		background: linear-gradient(to bottom, #155dfc 0%, #193cb8 100%);
		border: r(0.667) solid rgba(255, 255, 255, 0.1);
		border-radius: r(16);
		box-shadow: 0 r(10) r(15) 0 rgba(28, 57, 142, 0.4), 0 r(4) r(6) 0 rgba(28, 57, 142, 0.4);
		display: flex;
		flex: 1;
		height: r(64);
		justify-content: center;
	}

	.dice-actions__primary-text {
		color: #ffffff;
		font-family: Arial, sans-serif;
		font-size: r(20);
		font-weight: 700;
		letter-spacing: r(1);
		line-height: r(28);
		text-align: center;
		text-transform: uppercase;
	}

	.dice-actions__secondary {
		align-items: center;
		background: rgba(255, 255, 255, 0.05);
		border: r(0.667) solid rgba(255, 255, 255, 0.1);
		border-radius: r(16);
		display: flex;
		height: r(64);
		justify-content: center;
		width: r(64);
	}

	.dice-actions__icon {
		height: r(24);
		width: r(24);
	}

	.dice-actions__primary.is-disabled {
		opacity: 0.7;
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

	.nav-back-icon {
		width: 26.69rpx;
		height: 26.69rpx;
	}
</style>

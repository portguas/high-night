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
						<view v-for="(value, index) in diceValues" :key="index" class="dice" :class="`dice--${getChar(index)}`">
							<view class="dice__face">
								<view v-for="pip in 9" :key="pip" class="dice__pip" :class="`pip-${pip - 1}`">
									<view v-if="isDotVisible(value, pip - 1)" class="dice__dot" :class="{ 'is-big': value === 1 && pip === 5 }"></view>
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
						<template v-if="isShaking">
							<image class="dice-actions__loading-icon spin" src="/static/assets/party/icon-dice.svg" mode="aspectFit" />
							<text class="dice-actions__primary-text">Shaking</text>
						</template>
						<text v-else class="dice-actions__primary-text">SHAKE</text>
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
	const diceSound = '/static/assets/party/dice-shake.mp3'
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
		hapticEnabled: 'settings.hapticEnabled',
		diceCount: 'settings.diceCount'
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
	const cupThresholdPx = 60
	
	const getChar = (index) => ['a', 'b', 'c', 'd', 'e'][index]

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
		const diceCountValue = uni.getStorageSync(storageKeys.diceCount)
		
		if (typeof soundValue === 'boolean') {
			soundEnabled.value = soundValue
		}
		if (typeof hapticValue === 'boolean') {
			hapticEnabled.value = hapticValue
		}
		
		const count = (diceCountValue && diceCountValue >= 1 && diceCountValue <= 5) ? diceCountValue : 5
		if (diceValues.value.length !== count) {
			diceValues.value = Array(count).fill(1).map(() => Math.floor(Math.random() * 6) + 1)
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

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.spin {
		animation: spin 1s linear infinite;
	}

	.dice-actions__loading-icon {
		width: r(40);
		height: r(40);
		margin-right: r(16);
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
		top: r(460);
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

	.dice__pip {
		align-items: center;
		display: flex;
		justify-content: center;
		position: absolute;
		width: 20%;
		height: 20%;
	}

	.pip-0 { left: 10%; top: 10%; }
	.pip-1 { left: 40%; top: 10%; }
	.pip-2 { left: 70%; top: 10%; }
	.pip-3 { left: 10%; top: 40%; }
	.pip-4 { left: 40%; top: 40%; }
	.pip-5 { left: 70%; top: 40%; }
	.pip-6 { left: 10%; top: 70%; }
	.pip-7 { left: 40%; top: 70%; }
	.pip-8 { left: 70%; top: 70%; }

	.dice__dot.is-big {
		background: #ff3333;
		transform: scale(1.6);
		box-shadow: inset 0 0 r(4) rgba(0,0,0,0.1);
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

	.dice-cup {
		height: r(288);
		left: r(68.67);
		position: absolute;
		top: r(220);
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

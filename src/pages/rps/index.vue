<template>
	<view class="page">
		<view class="bg-layer">
			<image class="bg-image" :src="backgroundImage" mode="aspectFill" />
			<view class="bg-gradient"></view>
			<image class="bg-noise" :src="noiseImage" mode="aspectFill" />
		</view>

		<view class="content">
			<view class="nav-title" :style="navTitleStyle">
				<text class="nav-title-text">石头剪刀布</text>
			</view>
			<view class="nav-action" :style="navActionStyle" @tap="handleBack">
				<image class="nav-back-icon" :src="backIcon" mode="aspectFit" />
			</view>

			<view class="main">
				<view class="rps-game">
					<view class="rps-grid"></view>
					<view v-if="showScoreboard" class="rps-score">
						<text class="rps-score-top">{{ scoreRed }}</text>
						<text class="rps-score-vs">VS</text>
						<text class="rps-score-bottom">{{ scoreBlue }}</text>
					</view>
					<view class="player-wrap player-wrap-top">
						<view class="player-rotate">
							<view class="player-section">
								<view class="gesture-wrap gesture-top">
									<view class="gesture-display" :class="{ 'is-pulsing': isPulsing }" @tap="handlePunch('opponent')">
										<text class="gesture-emoji">{{ topGesture }}</text>
										<view v-if="showPunchHintTop" class="punch-hint">
											<text class="punch-hint-text">点击出拳</text>
										</view>
									</view>
								</view>
								<view class="player-info player-info-top">
									<view class="player-avatar avatar-red">
										<text class="player-emoji">👿</text>
									</view>
									<view class="player-tag tag-red">
										<text class="player-tag-text">RED</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="player-section player-section-bottom">
						<view class="gesture-wrap gesture-bottom">
							<view class="gesture-display" :class="{ 'is-pulsing': isPulsing }" @tap="handlePunch('user')">
								<text class="gesture-emoji">{{ bottomGesture }}</text>
								<view v-if="showPunchHint" class="punch-hint">
									<text class="punch-hint-text">点击出拳</text>
								</view>
							</view>
						</view>
						<view class="player-info player-info-bottom">
							<view class="player-tag tag-blue">
								<text class="player-tag-text">BLUE</text>
							</view>
							<view class="player-avatar avatar-blue">
								<text class="player-emoji">😈</text>
							</view>
						</view>
					</view>
					<view v-if="showStart" class="start-btn" @tap="handleStart">
						<text class="start-btn-text">开始游戏</text>
					</view>
					<view v-else-if="gameState === GameState.COUNTING" class="countdown">
						<text class="countdown-text">{{ countdown }}</text>
					</view>
					<view v-if="showResultPanel" class="result-panel">
						<view class="result-banner" :class="resultClass">
							<view class="result-banner-inner">
								<image class="result-icon" :src="resultIcon" mode="aspectFit" />
								<text class="result-text" :class="resultTextClass">{{ resultText }}</text>
							</view>
						</view>
						<view class="next-btn" @tap="handleNextRound">
							<text class="next-btn-text">{{ nextRoundText }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, onMounted, onUnmounted, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'

	const backgroundImage = '/static/assets/rps/background.jpg'
	const noiseImage = '/static/assets/rps/noise.png'
	const backIcon = '/static/assets/rps/icon-back.svg'
	const resultIcon = '/static/assets/rps/icon-trophy.svg'
	const navActionStyle = ref({})
	const navTitleStyle = ref({})
	const countdown = ref(0)
	const GameState = Object.freeze({
		READY: 'ready',
		COUNTING: 'counting',
		ROLLING: 'rolling',
		RESULT: 'result',
		ROUND_OVER: 'round-over'
	})
	const gameState = ref(GameState.READY)
	const matchMode = ref('single')
	const winTarget = ref(1)
	const scoreRed = ref(0)
	const scoreBlue = ref(0)
	const userPunched = ref(false)
	const opponentPunched = ref(false)
	const gestureIndexTop = ref(0)
	const gestureIndexBottom = ref(1)
	const winner = ref('draw')
	const gestures = ['✊', '✌️', '🖐️']
	let countdownTimer = null
	let rollingTimer = null
	let resultTimer = null

	const handleBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const applyMatchMode = (mode) => {
		if (mode === 'bo3') {
			matchMode.value = 'bo3'
			winTarget.value = 2
		} else if (mode === 'bo5') {
			matchMode.value = 'bo5'
			winTarget.value = 3
		} else {
			matchMode.value = 'single'
			winTarget.value = 1
		}
		resetMatchState()
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

	onLoad((query) => {
		if (query?.mode) {
			applyMatchMode(query.mode)
		}
	})

	onUnmounted(() => {
		if (countdownTimer) {
			clearInterval(countdownTimer)
			countdownTimer = null
		}
		if (rollingTimer) {
			clearInterval(rollingTimer)
			rollingTimer = null
		}
		if (resultTimer) {
			clearTimeout(resultTimer)
			resultTimer = null
		}
	})

	const isPulsing = computed(() => [GameState.COUNTING, GameState.ROLLING].includes(gameState.value))
	const showScoreboard = computed(() => matchMode.value !== 'single')
	const showStart = computed(() => gameState.value === GameState.READY)
	const showPunchHint = computed(
		() => [GameState.COUNTING, GameState.ROLLING].includes(gameState.value) && !userPunched.value
	)
	const showPunchHintTop = computed(
		() => [GameState.COUNTING, GameState.ROLLING].includes(gameState.value) && !opponentPunched.value
	)
	const showResultPanel = computed(() => [GameState.RESULT, GameState.ROUND_OVER].includes(gameState.value))
	const topGesture = computed(() => gestures[gestureIndexTop.value])
	const bottomGesture = computed(() => gestures[gestureIndexBottom.value])
	const nextRoundText = computed(() => {
		if (gameState.value === GameState.ROUND_OVER) {
			return '开始下一轮'
		}
		return '下一局'
	})
	const resultText = computed(() => {
		if (winner.value === 'blue') return '蓝方胜'
		if (winner.value === 'red') return '红方胜'
		return '平局'
	})
	const resultClass = computed(() => {
		if (winner.value === 'blue') return 'is-blue'
		if (winner.value === 'red') return 'is-red'
		return 'is-draw'
	})
	const resultTextClass = computed(() => {
		if (winner.value === 'blue') return 'text-blue'
		if (winner.value === 'red') return 'text-red'
		return 'text-draw'
	})
	const isMatchOver = computed(() => {
		if (!showScoreboard.value) {
			return false
		}
		return scoreRed.value >= winTarget.value || scoreBlue.value >= winTarget.value
	})

	const handleStart = () => {
		if (gameState.value === GameState.COUNTING) {
			return
		}
		resetRoundState()
		countdown.value = 3
		gameState.value = GameState.COUNTING
		if (countdownTimer) {
			clearInterval(countdownTimer)
		}
		countdownTimer = setInterval(() => {
			countdown.value -= 1
			if (countdown.value <= 1) {
				clearInterval(countdownTimer)
				countdownTimer = null
				setTimeout(() => {
					gameState.value = GameState.ROLLING
					countdown.value = 0
					if (userPunched.value || opponentPunched.value) {
						startRolling()
						if (userPunched.value && opponentPunched.value) {
							scheduleResult()
						}
					}
				}, 500)
			}
		}, 1000)
	}

	const handleNextRound = () => {
		if (gameState.value === GameState.ROUND_OVER) {
			resetMatchState()
			handleStart()
			return
		}
		handleStart()
	}

	const advanceGesture = (role) => {
		if (role === 'user') {
			gestureIndexBottom.value = (gestureIndexBottom.value + 1) % gestures.length
			return
		}
		gestureIndexTop.value = (gestureIndexTop.value + 1) % gestures.length
	}

	const handlePunch = (role) => {
		if (![GameState.COUNTING, GameState.ROLLING].includes(gameState.value)) {
			return
		}
		if (role === 'user') {
			if (userPunched.value) {
				return
			}
			userPunched.value = true
			advanceGesture(role)
		} else {
			if (opponentPunched.value) {
				return
			}
			opponentPunched.value = true
			advanceGesture(role)
		}
		startRolling()
		if (gameState.value === GameState.ROLLING && userPunched.value && opponentPunched.value) {
			scheduleResult()
		}
	}

	const startRolling = () => {
		if (rollingTimer) {
			return
		}
		rollingTimer = setInterval(() => {
			if (opponentPunched.value) {
				gestureIndexTop.value = (gestureIndexTop.value + 1) % gestures.length
			}
			if (userPunched.value) {
				gestureIndexBottom.value = (gestureIndexBottom.value + 1) % gestures.length
			}
		}, 100)
	}

	const scheduleResult = () => {
		if (resultTimer) {
			clearTimeout(resultTimer)
		}
		resultTimer = setTimeout(() => {
			stopRolling()
		}, 2000)
	}

	const stopRolling = () => {
		if (rollingTimer) {
			clearInterval(rollingTimer)
			rollingTimer = null
		}
		winner.value = evaluateWinner(gestureIndexTop.value, gestureIndexBottom.value)
		if (winner.value === 'red') {
			scoreRed.value += 1
		}
		if (winner.value === 'blue') {
			scoreBlue.value += 1
		}
		gameState.value = isMatchOver.value ? GameState.ROUND_OVER : GameState.RESULT
	}

	const evaluateWinner = (top, bottom) => {
		if (top === bottom) {
			return 'draw'
		}
		const topWin =
			(top === 0 && bottom === 1) ||
			(top === 1 && bottom === 2) ||
			(top === 2 && bottom === 0)
		return topWin ? 'red' : 'blue'
	}

	const resetRoundState = () => {
		countdown.value = 0
		userPunched.value = false
		opponentPunched.value = false
		gestureIndexTop.value = 0
		gestureIndexBottom.value = 0
		winner.value = 'draw'
		gameState.value = GameState.READY
		if (rollingTimer) {
			clearInterval(rollingTimer)
			rollingTimer = null
		}
		if (resultTimer) {
			clearTimeout(resultTimer)
			resultTimer = null
		}
	}

	const resetMatchState = () => {
		scoreRed.value = 0
		scoreBlue.value = 0
		resetRoundState()
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
		padding: calc(var(--status-bar-height) + 200.85rpx) 45.76rpx 45.76rpx;
		box-sizing: border-box;
	}

	.rps-game {
		position: relative;
		width: 100%;
		height: 1277.54rpx;
		overflow: hidden;
	}

	.rps-grid {
		position: absolute;
		inset: 0;
		opacity: 0.1;
		background-image: linear-gradient(180deg, #333333 0.14925%, rgba(0, 0, 0, 0) 0.14925%),
			linear-gradient(90deg, #333333 0.28958%, rgba(0, 0, 0, 0) 0.28958%);
	}

	.rps-score {
		position: absolute;
		top: 638.77rpx;
		right: 23rpx;
		width: 96rpx;
		height: 192.66rpx;
		padding: 17.33rpx 1.33rpx;
		border-radius: 9999rpx;
		background: rgba(255, 255, 255, 0.05);
		border: 1.33rpx solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx;
		transform: translateY(-50%);
		box-sizing: border-box;
	}

	.rps-score-top,
	.rps-score-bottom {
		font-size: 40rpx;
		line-height: 56rpx;
		font-weight: 900;
		text-align: center;
		font-family: 'Arial Black', Arial, sans-serif;
	}

	.rps-score-top {
		color: #fb2c36;
	}

	.rps-score-vs {
		font-size: 20rpx;
		line-height: 30rpx;
		letter-spacing: 0;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.2);
		text-align: center;
		text-transform: uppercase;
		font-family: 'Arial Bold', Arial, sans-serif;
	}

	.rps-score-bottom {
		color: #2b7fff;
	}

	.player-wrap {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 658.47rpx;
		height: 638.77rpx;
	}

	.player-wrap-top {
		left: 0;
		top: 0;
		z-index: 1;
	}

	.player-rotate {
		transform: rotate(180deg);
	}

	.player-wrap-top .player-rotate {
		transform: none;
	}

	.player-section {
		position: relative;
		width: 658.47rpx;
		height: 638.77rpx;
	}

	.player-section-bottom {
		position: absolute;
		left: 0;
		top: 638.77rpx;
		width: 658.47rpx;
		height: 638.77rpx;
	}

	.gesture-wrap {
		position: absolute;
		width: 244.07rpx;
		height: 244.07rpx;
	}

	.gesture-display {
		position: absolute;
		left: -12.2rpx;
		top: -12.2rpx;
		width: 268.47rpx;
		height: 268.47rpx;
		background: rgba(0, 0, 0, 0.2);
		border: 7.63rpx solid #f6339a;
		border-radius: 9999rpx;
		box-shadow: 0 0 57rpx rgba(236, 72, 153, 0.6);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.gesture-display.is-pulsing {
		animation: gesturePulse 1.2s ease-in-out infinite;
	}

	.player-wrap-top .gesture-display.is-pulsing {
		animation-delay: 0.15s;
	}

	.gesture-emoji {
		font-size: 88rpx;
		line-height: 96rpx;
		filter: drop-shadow(0 8rpx 16rpx rgba(0, 0, 0, 0.25));
	}

	.gesture-top {
		left: 207.21rpx;
		top: 91.53rpx;
	}

	.gesture-bottom {
		left: 207.21rpx;
		top: 303.18rpx;
	}

	.player-info {
		position: absolute;
		left: 252.97rpx;
		width: 152.54rpx;
		height: 211.65rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15.25rpx;
	}

	.player-info-top {
		top: 335.59rpx;
	}

	.player-info-bottom {
		top: 91.53rpx;
	}

	.player-avatar {
		width: 152.54rpx;
		height: 152.54rpx;
		border-radius: 9999rpx;
		background: #1a1a2e;
		border: 7.63rpx solid rgba(251, 44, 54, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.avatar-blue {
		border-color: rgba(43, 127, 255, 0.3);
	}

	.player-emoji {
		font-size: 57.2rpx;
		line-height: 68.64rpx;
	}

	.player-tag {
		height: 43.86rpx;
		border-radius: 9999rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.tag-red {
		background: #e7000b;
		width: 89.48rpx;
	}

	.tag-blue {
		background: #155dfc;
		width: 101.52rpx;
	}

	.player-tag-text {
		font-size: 19.07rpx;
		line-height: 28.6rpx;
		letter-spacing: 1.91rpx;
		font-weight: 800;
		text-transform: uppercase;
	}

	.start-btn {
		position: absolute;
		left: 50%;
		top: 580.29rpx;
		width: 322.88rpx;
		height: 116.95rpx;
		border-radius: 9999rpx;
		background: linear-gradient(90deg, #155dfc 0%, #9810fa 100%);
		border: 1.27rpx solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 0 57rpx rgba(79, 70, 229, 0.5);
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		z-index: 3;
	}

	.start-btn-text {
		font-size: 38.14rpx;
		line-height: 53.39rpx;
		letter-spacing: 3.81rpx;
		font-weight: 700;
		color: #ffffff;
		text-transform: uppercase;
	}

	.countdown {
		position: absolute;
		left: 50%;
		top: 580.29rpx;
		width: 322.88rpx;
		height: 116.95rpx;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 4;
	}

	.countdown-text {
		font-size: 88rpx;
		line-height: 96rpx;
		font-weight: 800;
		letter-spacing: 6rpx;
		color: #ffffff;
		text-shadow: 0 0 24rpx rgba(129, 140, 248, 0.6);
	}

	.result-panel {
		position: absolute;
		left: 50%;
		top: 580.29rpx;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		gap: 45.76rpx;
		align-items: center;
		z-index: 4;
	}

	.result-banner {
		width: 523.99rpx;
		height: 175.42rpx;
		border-radius: 9999rpx;
		border: 3.81rpx solid #2b7fff;
		background: rgba(22, 36, 86, 0.9);
		box-shadow: 0 25px 50px rgba(43, 127, 255, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.result-banner-inner {
		display: flex;
		align-items: center;
		gap: 30.51rpx;
		padding: 3.81rpx 95.34rpx;
		box-sizing: border-box;
	}

	.result-icon {
		width: 76.27rpx;
		height: 76.27rpx;
	}

	.result-text {
		font-size: 68.64rpx;
		line-height: 76.27rpx;
		letter-spacing: 6.86rpx;
		font-weight: 800;
	}

	.result-banner.is-red {
		border-color: #f6339a;
		background: rgba(86, 22, 39, 0.9);
		box-shadow: 0 25px 50px rgba(246, 51, 154, 0.35);
	}

	.result-banner.is-draw {
		border-color: rgba(255, 255, 255, 0.3);
		background: rgba(39, 39, 42, 0.9);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35);
	}

	.result-text.text-blue {
		color: #51a2ff;
	}

	.result-text.text-red {
		color: #f6339a;
	}

	.result-text.text-draw {
		color: rgba(255, 255, 255, 0.8);
	}

	.next-btn {
		width: 227.54rpx;
		height: 101.69rpx;
		border-radius: 30.51rpx;
		background: rgba(39, 39, 42, 0.8);
		border: 1.27rpx solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.next-btn-text {
		font-size: 34.32rpx;
		line-height: 53.39rpx;
		color: #ffffff;
		font-weight: 700;
	}

	.punch-hint {
		position: absolute;
		left: 40.42rpx;
		top: 95.34rpx;
		width: 163.3rpx;
		height: 53.39rpx;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0.86;
		border-radius: 9999rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.punch-hint-text {
		font-size: 26.7rpx;
		line-height: 38.14rpx;
		letter-spacing: 2.67rpx;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 700;
		text-transform: uppercase;
	}

	@keyframes gesturePulse {
		0% {
			transform: scale(1);
			box-shadow: 0 0 40rpx rgba(236, 72, 153, 0.4);
		}
		50% {
			transform: scale(1.06);
			box-shadow: 0 0 70rpx rgba(236, 72, 153, 0.75);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 40rpx rgba(236, 72, 153, 0.4);
		}
	}
</style>

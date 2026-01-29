<template>
	<view class="page">
		<view class="bg-layer">
			<image class="bg-image" :src="backgroundImage" mode="aspectFill" />
			<view class="bg-gradient"></view>
			<image class="bg-noise" :src="noiseImage" mode="aspectFill" />
		</view>

			<view class="content">
				<view class="header">
					<view class="back-button" @tap="handleBack">
						<image class="back-icon" :src="icons.back" mode="aspectFit" />
					</view>
					<text class="header-title">真心话大冒险</text>
				</view>

			<view class="main">
				<view class="game">
					<view class="game-title-block">
						<view class="game-heading">
							<image class="game-heading-icon" :src="icons.spark" mode="aspectFit" />
							<text class="game-heading-text">真心话大冒险</text>
						</view>
						<view class="game-subtitle-wrap">
							<text class="game-subtitle">选择你的命运</text>
						</view>
					</view>
					<view class="choice-list" :class="{ 'is-hidden': !isChoiceVisible }">
						<view class="choice-card truth" @tap="handleTruth">
							<view class="choice-bg"></view>
							<view class="choice-content">
								<image class="choice-icon" :src="icons.heart" mode="aspectFit" />
								<text class="choice-text">真心话</text>
							</view>
						</view>
						<view class="choice-card dare" @tap="handleDare">
							<view class="choice-bg"></view>
							<view class="choice-content">
								<image class="choice-icon" :src="icons.flame" mode="aspectFit" />
								<text class="choice-text">大冒险</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			</view>
			<TruthPromptModal ref="truthModal" @closed="handlePromptClosed" />
			<DarePromptModal ref="dareModal" @closed="handlePromptClosed" />
		</view>
	</template>

	<script setup>
		import { ref } from 'vue'
		import TruthPromptModal from '../../components/TruthPromptModal.vue'
		import DarePromptModal from '../../components/DarePromptModal.vue'

		const backgroundImage = '/static/assets/truth/background.jpg'
		const noiseImage = '/static/assets/truth/noise.png'
		const truthModal = ref(null)
		const dareModal = ref(null)
		const isChoiceVisible = ref(true)
		const icons = {
			back: '/static/assets/truth/icon-back.svg',
			spark: '/static/assets/truth/icon-spark.svg',
			heart: '/static/assets/truth/icon-heart.svg',
			flame: '/static/assets/truth/icon-flame.svg'
	}

	const handleBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const handleTruth = () => {
		isChoiceVisible.value = false
		setTimeout(() => {
			truthModal.value?.open()
		}, 150)
	}

	const handleDare = () => {
		isChoiceVisible.value = false
		setTimeout(() => {
			dareModal.value?.open()
		}, 150)
	}

	const handlePromptClosed = () => {
		isChoiceVisible.value = true
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

	.header {
		position: relative;
		height: 200.85rpx;
		width: 100%;
	}

	.back-button {
		position: absolute;
		left: 30.51rpx;
		top: 91.53rpx;
		width: 78.81rpx;
		height: 78.81rpx;
		border-radius: 9999rpx;
		background: rgba(255, 255, 255, 0.05);
		border: 1.27rpx solid rgba(255, 255, 255, 0.05);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		width: 26.69rpx;
		height: 26.69rpx;
	}

	.header-title {
		position: absolute;
		left: 161.29rpx;
		top: 104.24rpx;
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
		padding: 45.76rpx;
		box-sizing: border-box;
	}

	.game {
		height: 892.37rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 30.51rpx 0;
		box-sizing: border-box;
	}

	.game-title-block {
		width: 335.59rpx;
		height: 114.41rpx;
		display: flex;
		flex-direction: column;
		gap: 15.25rpx;
	}

	.game-heading {
		height: 61.02rpx;
		position: relative;
	}

	.game-heading-icon {
		position: absolute;
		left: 0;
		top: 7.63rpx;
		width: 45.76rpx;
		height: 45.76rpx;
	}

	.game-heading-text {
		position: absolute;
		left: 198.31rpx;
		top: -3.81rpx;
		transform: translateX(-50%);
		font-size: 45.76rpx;
		line-height: 61.02rpx;
		font-weight: 700;
		white-space: nowrap;
		text-align: center;
		color: #ffffff;
	}

	.game-subtitle-wrap {
		height: 38.14rpx;
		position: relative;
	}

	.game-subtitle {
		position: absolute;
		left: 50%;
		top: -2.53rpx;
		transform: translateX(-50%);
		width: 100%;
		text-align: center;
		font-size: 26.69rpx;
		line-height: 38.14rpx;
		color: rgba(255, 255, 255, 0.4);
	}

	.choice-list {
		width: 658.47rpx;
		display: flex;
		flex-direction: column;
		margin-top: auto;
		transition: opacity 0.25s ease, transform 0.25s ease;
	}

	.choice-list.is-hidden {
		opacity: 0;
		transform: translateY(20rpx);
		pointer-events: none;
	}

	.choice-card {
		position: relative;
		height: 305.09rpx;
		border-radius: 30.51rpx;
		overflow: hidden;
		border: 1.27rpx solid transparent;
		margin-bottom: 45.76rpx;
	}

	.choice-card:last-child {
		margin-bottom: 0;
	}

	.choice-card.truth {
		border-color: rgba(43, 127, 255, 0.3);
	}

	.choice-card.dare {
		border-color: rgba(251, 44, 54, 0.3);
	}

	.choice-bg {
		position: absolute;
		inset: 0;
		opacity: 0.6;
	}

	.choice-card.truth .choice-bg {
		background: linear-gradient(155.24deg, #155dfc 0%, #1c398e 100%);
	}

	.choice-card.dare .choice-bg {
		background: linear-gradient(155.24deg, #e7000b 0%, #82181a 100%);
	}

	.choice-content {
		position: relative;
		z-index: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.choice-icon {
		width: 91.53rpx;
		height: 91.53rpx;
		margin-bottom: 15.25rpx;
	}

	.choice-text {
		font-size: 45.76rpx;
		line-height: 61.02rpx;
		font-weight: 900;
		letter-spacing: 4.58rpx;
		text-align: center;
		color: #ffffff;
		text-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
	}
</style>

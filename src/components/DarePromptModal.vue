<template>
	<uni-popup ref="popup" type="center" :is-mask-click="true" @maskClick="close">
		<view :key="animationKey" :class="['dare-modal', isFlipping ? 'prompt-flip' : (isEntering ? 'prompt-enter' : '')]" @tap.stop>
			<view class="dare-glass"></view>
			<view class="dare-icon">
				<image class="dare-icon-image" :src="icons.flame" mode="aspectFit" />
			</view>
			<text class="dare-title">大冒险</text>
			<text class="dare-question">{{ displayQuestion }}</text>
			<text class="dare-back" @tap="handleRefresh">换一个</text>
		</view>
	</uni-popup>
</template>

<script setup>
	import { computed, ref } from 'vue'

	const emit = defineEmits(['closed', 'refresh'])
	const props = defineProps({
		question: {
			type: String,
			default: ''
		}
	})
	const popup = ref(null)
	const animationKey = ref(0)
	const isFlipping = ref(false)
	const isEntering = ref(false)
	let flipTimer = null
	let enterTimer = null
	const icons = {
		flame: '/static/assets/truth/dare-modal-flame.svg'
	}

	const open = () => {
		if (enterTimer) {
			clearTimeout(enterTimer)
		}
		isFlipping.value = false
		isEntering.value = true
		animationKey.value += 1
		popup.value?.open()
		enterTimer = setTimeout(() => {
			isEntering.value = false
			enterTimer = null
		}, 460)
	}

	const close = () => {
		popup.value?.close()
		emit('closed')
	}

	const handleRefresh = () => {
		emit('refresh')
		isEntering.value = false
		isFlipping.value = true
		animationKey.value += 1
		if (flipTimer) {
			clearTimeout(flipTimer)
		}
		flipTimer = setTimeout(() => {
			isFlipping.value = false
			flipTimer = null
		}, 420)
	}

	const displayQuestion = computed(() => {
		return props.question || '做一个你最擅长的动作。'
	})

	defineExpose({
		open,
		close
	})
</script>

<style lang="scss">
	.dare-modal {
		position: relative;
		width: 682.67rpx;
		height: 626rpx;
		border-radius: 32rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		box-shadow: 0 20rpx 30rpx -6rpx rgba(0, 0, 0, 0.1), 0 8rpx 12rpx -8rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.dare-glass {
		position: absolute;
		inset: 0;
		background: linear-gradient(42.52deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0) 100%);
		pointer-events: none;
	}

	.dare-icon {
		position: absolute;
		top: 64rpx;
		left: 50%;
		width: 128rpx;
		height: 128rpx;
		transform: translateX(-50%);
		border-radius: 9999rpx;
		background: #fb2c36;
		box-shadow: 0 0 40rpx 0 rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dare-icon-image {
		width: 64rpx;
		height: 64rpx;
	}

	.dare-title {
		position: absolute;
		top: 240rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 40rpx;
		line-height: 56rpx;
		font-weight: 700;
		letter-spacing: 4rpx;
		text-transform: uppercase;
		color: #ff6467;
		text-align: center;
	}

	.dare-question {
		position: absolute;
		top: 328rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 554.67rpx;
		font-size: 40rpx;
		line-height: 65rpx;
		text-align: center;
		color: #ffffff;
	}

	.dare-back {
		position: absolute;
		top: 542rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 28rpx;
		line-height: 40rpx;
		color: rgba(255, 255, 255, 0.4);
		text-decoration: underline;
	}

	.prompt-enter {
		animation: prompt-enter 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
		backface-visibility: hidden;
		will-change: transform, opacity;
		transform-origin: center;
	}

	.prompt-flip {
		animation: prompt-flip 0.42s cubic-bezier(0.2, 0.8, 0.2, 1);
		backface-visibility: hidden;
		transform-style: preserve-3d;
		will-change: transform;
		transform-origin: center;
	}

	@keyframes prompt-enter {
		from {
			opacity: 0;
			transform: scaleX(0.1) scaleY(0.98);
		}

		to {
			opacity: 1;
			transform: scaleX(1) scaleY(1);
		}
	}

	@keyframes prompt-flip {
		0% {
			transform: rotateY(0deg);
		}

		50% {
			transform: rotateY(90deg) scale(0.98);
		}

		100% {
			transform: rotateY(0deg);
		}
	}
</style>

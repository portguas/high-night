<template>
	<uni-popup ref="popup" type="center" :is-mask-click="true">
		<view class="mode-modal" @tap.stop>
			<view class="mode-header">
				<text class="mode-title">选择模式</text>
			</view>
			<view class="mode-list">
				<view class="mode-item" v-for="item in modes" :key="item.value" @tap="handleSelect(item.value)">
					<text class="mode-item-title">{{ item.label }}</text>
					<text class="mode-item-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import { ref } from 'vue'

	const emit = defineEmits(['select'])
	const popup = ref(null)
	const modes = [
		{
			value: 'single',
			label: '一局定胜负',
			desc: '一局分胜负'
		},
		{
			value: 'bo3',
			label: '三局两胜',
			desc: '先赢两局获胜'
		},
		{
			value: 'bo5',
			label: '五局三胜',
			desc: '先赢三局获胜'
		}
	]

	const open = () => {
		popup.value?.open()
	}

	const close = () => {
		popup.value?.close()
	}

	const handleSelect = (value) => {
		emit('select', value)
		close()
	}

	defineExpose({
		open,
		close
	})
</script>

<style lang="scss">
	.mode-modal {
		width: 660rpx;
		border-radius: 32rpx;
		border: 1.334rpx solid rgba(255, 255, 255, 0.1);
		background: #171717;
		box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
		overflow: hidden;
	}

	.mode-header {
		height: 120rpx;
		padding: 0 48rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(255, 255, 255, 0.05);
		border-bottom: 1.334rpx solid rgba(255, 255, 255, 0.05);
		box-sizing: border-box;
	}

	.mode-title {
		font-size: 36rpx;
		line-height: 56rpx;
		font-weight: 700;
		letter-spacing: 0.9rpx;
		color: #ffffff;
	}

	.mode-list {
		padding: 32rpx 40rpx 40rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		box-sizing: border-box;
	}

	.mode-item {
		height: 112rpx;
		border-radius: 24rpx;
		border: 1.334rpx solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.02);
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 6rpx;
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.mode-item-title {
		font-size: 30rpx;
		line-height: 44rpx;
		font-weight: 700;
		color: #ffffff;
	}

	.mode-item-desc {
		font-size: 22rpx;
		line-height: 32rpx;
		color: rgba(255, 255, 255, 0.5);
	}
</style>

<template>
	<view class="page">
		<uni-section title="夜场游戏" sub-title="今夜派对清单" type="line" padding>
			<template #right>
				<uni-tag text="High Night" type="primary" size="small" />
			</template>
		</uni-section>

		<view class="notice-wrap">
			<uni-notice-bar text="适度饮酒 · 享受夜晚" :scrollable="false" :single="true" color="#5b4d7a"
				background-color="#efeaff" />
		</view>

		<view class="list-wrap">
			<uni-list>
				<uni-list-item v-for="item in games" :key="item.title" :title="item.title" :note="item.desc"
					:thumb="item.icon" :rightText="item.level" />
			</uni-list>
		</view>

		<uni-section title="今晚任务" type="line" padding />

		<uni-list class="mission-list">
			<uni-list-item v-for="mission in missions" :key="mission.title" :title="mission.title"
				:note="mission.note" :rightText="mission.reward" />
		</uni-list>

		<view class="footer">
			<uni-tag text="聚会提醒" type="warning" size="small" />
			<view class="footer-meta">
				<uni-icons type="fire" size="16" color="#ff6b6b" />
				<text class="footer-text">嗨点已拉满</text>
				<uni-badge text="4" type="error" size="small" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				games: [{
						title: '霓虹骰子',
						desc: '经典聚会必备，比大小',
						icon: '/static/assets/party/icon-dice.svg',
						level: '轻松'
					},
					{
						title: '真心话大冒险',
						desc: '说出秘密或者接受惩罚',
						icon: '/static/assets/party/icon-truth.svg',
						level: '刺激'
					},
					{
						title: '鳄鱼拔牙',
						desc: '赛博版俄罗斯轮盘，谁是倒霉蛋',
						icon: '/static/assets/party/icon-croc.svg',
						level: '紧张'
					},
					{
						title: '石头剪刀布',
						desc: '决战时刻，输了就喝',
						icon: '/static/assets/party/icon-rps.svg',
						level: '速战'
					}
				],
				missions: [{
						title: '热场开局',
						note: '三轮破冰小游戏',
						reward: '+1 轮'
					},
					{
						title: '默契挑战',
						note: '两人一组猜词',
						reward: '加分'
					},
					{
						title: '派对收官',
						note: '胜者制定惩罚',
						reward: '主导权'
					}
				]
			}
		}
	}
</script>

<style>
	page {
		background-color: #f4f5fb;
	}

	.page {
		min-height: 100vh;
		padding: 24rpx 24rpx 80rpx;
		background: linear-gradient(180deg, #f4f5fb 0%, #ffffff 48%, #f1ecff 100%);
		color: #1f2430;
	}

	.notice-wrap {
		margin: 16rpx 0 24rpx;
	}

	.list-wrap {
		margin-bottom: 32rpx;
	}

	.footer {
		margin-top: 32rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		background: rgba(91, 77, 122, 0.08);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.footer-meta {
		display: flex;
		align-items: center;
	}

	.footer-text {
		margin: 0 12rpx;
		font-size: 26rpx;
		color: #5b4d7a;
	}
</style>

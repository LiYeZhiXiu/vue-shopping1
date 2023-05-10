<template>
	<view>
		<view class="goods">
			<view class="faq_cur_inner">
				<image :src="goods.img800s"></image>
				<text class="u-line-1">{{ goods.name ||'测试1111' }}</text>
			</view>
		</view>
		<view class="comment-list">
			<view class="item" v-for="item in askList" :key="item.ask_id">
				<view class="faq_area_head">
					<text>用户{{item.name}}的提问:</text>
					<view class="faq_area_head_time">
						<text style="margin-right:10rpx">{{item.date}}</text>
						<u-icon name="more-dot-fill"></u-icon>
					</view>
				</view>
				<view class="faq_area_tit faq_com">
					<image class="img" src="/static/icon/ask_question.png"></image>
					<text class="txt">{{item.ask}}</text>
				</view>
				<view class="faq_area_desc faq_com">
					<image class="img" src="/static/icon/answer.png"></image>
					<text class="txt">{{item.ask}}</text>
				</view>
				<view class="faq_area_num">
                   <text style="margin-right:10rpx">查看全部{{item.askNums||0}}个答案</text>
				   <u-icon name="arrow-right" color="#2979ff" size="12"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gid: 0,
				goods: {},
				askList: [{
						ask_id: 0,
						ask: "1111...............11111111111111111111111",
						name: "测试1",
						reply_total: 10,
						utime: 1683610094984,
						date: "2023/5/6 14:24:00",
						top_reply: [
							"aaaaa"
						]
					},
					{
						ask_id: 0,
						ask: "1111",
						name: "测试2",
						reply_total: 10,
						date: "2023/5/6 14:24:00",
						utime: 1683610094984,
						top_reply: [
							"aaaaa"
						]
					}
				]
			}
		},
		onLoad(e) {
			this.gid = parseInt(e.gid) || 116724;
			console.log(this.gid, 'dddddddddd')
			this.getQuestionList()
		},
		methods: {
			getQuestionList() {
				this.$u.api.askInfo({
					gid: this.gid
				}).then(res => {
					console.log(res)
					this.goods = res.data.goods
					this.askList = res.data.list || [{
							ask_id: 0,
							ask: "1111...............11111111111111111111111",
							name: "测试1",
							reply_total: 10,
							utime: 1683610094984,
							date: "2023/5/6 14:24:00",
							top_reply: [
								"aaaaa"
							]
						},
						{
							ask_id: 0,
							ask: "1111",
							name: "测试2",
							reply_total: 10,
							date: "2023/5/6 14:24:00",
							utime: 1683610094984,
							top_reply: [
								"aaaaa"
							]
						}
					]
					uni.setNavigationBarTitle({
						title: `问大家(${res.data.total})`
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f9f9f9;
	}

	.goods {
		width: 750rpx;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		align-items: center;

		// background-color: red;
		.faq_cur_inner {
			padding: 0 20rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}

		image {
			width: 72rpx;
			height: 72rpx;
			margin-right: 10rpx;
		}

		z-index: 1;
	}

	.comment-list {
		margin-top: 20rpx;

		.item {
			position: relative;
			margin-bottom: 10px;
			padding: 0 10px 12px;
			background-color: #fff;

			.faq_area_head {
				position: relative;
				margin-bottom: 10rpx;
				height: 68rpx;
				line-height: 68rpx;
				color: #666;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.faq_area_head_time {
					display: flex;
					color: #999;
					font-size: 20rpx;
				}
			}

			.faq_com {
				position: relative;
				color: #333;
				font-size: 32rpx;
				// font-weight: 700;
				height: 50rpx;
				line-height: 50rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;


				image {
					margin-top: 4rpx;
					width: 30rpx;
					height: 30rpx;
					min-width: 30rpx;
					margin-right: 16rpx;
				}

				.txt {
					width: 628rpx;
					max-width: 628rpx;
				}
			}

			.faq_area_tit {
				font-weight: 700;
			}

			.faq_area_desc {
				// color: #333
			}

			.faq_area_num {
				color: #3985ff;
				font-size: 24rpx;
				text-align: right;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}
</style>
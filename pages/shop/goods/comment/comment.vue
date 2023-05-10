<template>
	<view class="comment-page">
		<!-- 评分，标签 -->
		<view class="cmt_header">
			<view class="cmt_cur">
				<view class="rate">
					<text>综合评分：</text>
					<u-rate :count="5" :current="rate.score" size="16" disabled active-color="#f1c158"></u-rate>
				</view>
				<view class="satisfaction">
					<text>好评度</text>
					<text>{{ rate.positive || 0 }}%</text>
				</view>
			</view>
			<view class="tag-box">
				<view class="tags u-flex" :style="{ height: tags.height }">
					<text :class="['item', { active: item.id == queryInfo.cid ? true : false }]"
						v-for="item in tags.list" :key="item.id" @click="activeTag(item.id)">
						{{ item.name }}({{ item.count }})
					</text>
				</view>
				<view class="arrow u-flex" @click="showMoreTags">
					<image src="/static/icon/arrow_down_lightgray.png" v-show="!tags.showAll"></image>
					<image src="/static/icon/arrow_up_lightgray.png" v-show="tags.showAll"></image>
				</view>
			</view>
		</view>
		<!--评价列表  -->
		<view class="comment-list">
			<view class="item" v-for="(item, index) in commentList" :key="index">
				<view class="head u-flex">
					<image
						:src="item.avatar || 'https://m.xiaomiyoupin.com/youpin/static/m/res/images/ucenter/ucenter_icon_userhead.png'"
						mode="aspectFit"></image>
					<view class="userinfo">
						<view style="display:flex">
							<view class="user">{{ item.nick_name }}</view>
							<u-rate :count="5" :current="item.score" size="16" active-color="#FA3534" disabled></u-rate>
						</view>
						<view class="time">{{ item.ctime | date('yyyy.mm.dd') }}</view>
					</view>
				</view>
				<view class="content">
					<view class="txt u-line-5">{{ item.text }}</view>
					<view class="img u-flex">
						<view class="item" v-for="(sitem, sindex) in item.pics" :key="sindex"
							@click="previewImg(item.pics)">
							<image :src="sitem" mode="aspectFit"></image>
						</view>
					</view>
					<view class="reply" v-if="item.reply_list" v-for="(sitem, sindex) in item.reply_list" :key="sindex">
						<view class="title u-flex">
							<text>商家回复</text>
							<text>{{ sitem.ctime | date('yyyy.mm.dd') }}</text>
						</view>
						<view class="detail">{{ sitem.text }}</view>
						<view class="triangle"></view>
					</view>
					<view class="append" v-if="item.append">
						<view class="append-time">
							购买{{ item.append && item.append.ctime, item.order_create_time | timeDif }}天后追评</view>
						<view class="txt u-line-5">{{ item.append.text }}</view>
						<view class="img u-flex">
							<view class="item" v-for="(titem, tindex) in item.append.imgs" :key="tindex">
								<image :src="titem.img" mode="aspectFit" @click="previewImg(titem.img)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="loadingStatus" :margin-top="30" :margin-bottom="40" bg-color="#f4f4f4" :font-size="24"
			color="#999" :load-text="loadingText" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryInfo: {
					gid: 0,
					cid: '__all__',
					pindex: 1,
					psize: 10,
					total: 0
				},
				rate: {},
				tags: {
					list: [],
					showAll: false,
					height: '50rpx'
				},
				checked: false,
				float: false,
				commentList: [],
				loadingStatus: 'loadmore',
				loadingText: {
					loadmore: '上拉加载更多',
					loading: '努力加载中~',
					nomore: '没有更多评论了'
				}
			}
		},
		onLoad(e) {
			this.queryInfo.gid = parseInt(e.gid) || 116724
			this.queryInfo.cid = e.cid
			this.getTags()
			this.getComment()
		},
		onPageScroll(e) {
			console.log(e)
			this.float = e.scrollTop > 100 ? true : false;
		},
		methods: {
			checkStatus() {
				this.checked = !this.checked;
			},
			showMoreTags() {
				if (!this.tags.showAll) {
					this.tags.showAll = true
					this.tags.height = 'auto'
				} else {
					this.tags.showAll = false
					this.tags.height = '50rpx'
				}
			},
			getTags() {
				this.$u.api.commentTag({
					gid: this.queryInfo.gid
				}).then(res => {
					console.log(res, 'ddddddd')
					this.rate.score = res.data.avg_score
					this.rate.positive = res.data.positive_rate
					this.tags.list = res.data.tags
				})
			},
			activeTag(id) {
				this.queryInfo.cid = id
				this.queryInfo.pindex = 1
				this.getComment('new')
			},
			getComment(type = 'new') {
				let data = {
					page: this.queryInfo.pindex,
					pageSize: this.queryInfo.psize,
					gid: this.queryInfo.gid,
					tagId: this.queryInfo.cid
				}
				this.$u.api.commentContent(data).then(res => {
					console.log(res, '1111111_11')
					if (type == 'new') {
						this.commentList = res.data.list
					} else if (type == 'more') {
						res.data.list.forEach(x => {
							this.commentList.push(x)
						})
					}
					// 处理页面下方的加载更多显示状态
					this.queryInfo.total = res.data.page.total
					if (this.queryInfo.total <= this.queryInfo.psize) {
						this.loadingStatus = 'nomore'
					} else {
						this.loadingStatus = 'loadmore'
					}
				})
			},
			// 预览大图
			previewImg(url) {
				if (typeof url == 'string') {
					url = url.split()
				}
				uni.previewImage({
					urls: url,
					fail: () => {
						this.$refs.uToast.show({
							title: `图片预览失败，请稍后再试`,
							type: 'error'
						})
					}
				})
			}
		},
		// 触底加载
		onReachBottom() {
			if (this.queryInfo.total > this.queryInfo.pindex * this.queryInfo.psize) {
				this.queryInfo.pindex++
				this.getComment('more')
				this.loadingStatus = 'loading'
			} else {
				this.loadingStatus = 'nomore'
			}
		},
		computed: {
			chechBg() {
				if (this.checked) {
					return {
						background: `url('/static/checked.png') no-repeat top / 100% 100%`
					}
				}
				return {
					background: `url('/static/unchecked.png') no-repeat top / 100% 100%`
				}
			}
		},
		// 过滤器
		filters: {
			timeDif(endTime, beginTime) {
				return parseInt((endTime - beginTime) / 86400)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f4f4f4;
	}

	.cmt_header {
		background-color: #fff;
		padding: 0rpx;
		margin: 0rpx;

		.cmt_cur {
			width: 100%;
			height: 88rpx;
			background-color: #fff;
			border-bottom: 1px solid #ddd;
			font-size: 30rpx;
			padding: 0rpx 20rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			z-index: 99;
             .rate{
				 display: flex;
			 }
			.checkbox {
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
				// border: 1px solid #ddd;
				margin-right: 20rpx;
			}

			.satisfaction {
				font-size: 24rpx;
				color: #999;
			}
		}

		.tag-box {
			padding: 0rpx 20rpx;
			box-sizing: border-box;
			margin-top: 10rpx;

			.tags {
				flex-wrap: wrap;
				overflow: hidden;

				.item {
					display: inline-block;
					margin: 0 24rpx 16rpx 0;
					padding: 6rpx 16rpx;
					font-size: 22rpx;
					color: #444;
					background-color: #fcedeb;
					border-radius: 30rpx;
				}

				.active {
					background-color: #e2b85c;
					color: #fff;
				}
			}

			.arrow {
				// margin: 16rpx 0;
				height: 46rpx;
				justify-content: center;
				text-align: center;

				image {
					width: 26rpx;
					height: 14rpx;
				}
			}
		}
	}

	.comment-list {
		width: 100vw;
		margin-top: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		border-radius: 12rpx;
		background-color: #fff;

		.item {
			padding: 24rpx;
			font-size: 24rpx;
			border-radius: 12rpx;
			border-bottom: 1px solid #ddd;

			.head {
				display: flex;
				color: #999;
				align-items: center;

				image {
					height: 62rpx;
					width: 62rpx;
					min-width: 62rpx;
					border-radius: 31rpx;
				}

				.userinfo {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-left: 20rpx;

					.user {
						color: #000;
					}
				}

			}

			.content {
				margin-top: 20rpx;
				padding-left: 78rpx;

				.txt {
					color: #555;
					line-height: 36rpx;
				}

				.img {
					flex-wrap: wrap;
					width: 100%;
					margin-bottom: 20rpx;

					.item {
						margin-top: 20rpx;
						margin-right: 15rpx;
						width: 180rpx;
						height: 180rpx;
					}
				}

				.reply {
					position: relative;
					margin-top: 40rpx;
					padding: 20rpx 30rpx 30rpx;
					border-radius: 8rpx;
					background-color: #f8f8f8;

					.title {
						justify-content: space-between;
						color: #999;
					}

					.detail {
						margin-top: 10rpx;
						color: #555;
						line-height: 36rpx;
					}

					.triangle {
						position: absolute;
						top: 0;
						left: 20rpx;
						width: 28rpx;
						height: 28rpx;
						background-color: #f8f8f8;
						transform: rotate(45deg) translateY(-50%);
						z-index: 1;
					}
				}

				.append {
					.append-time {
						color: #d3ac56;
						margin: 30rpx 0 20rpx;
					}
				}
			}
		}
	}
</style>
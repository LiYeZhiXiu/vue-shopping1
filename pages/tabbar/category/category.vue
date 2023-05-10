<template>
	<view class="content">
		<!-- 头部搜索 -->
		<view class="search-content">
			<!-- 上一级 -->
			<view class="left-icon" @click="goback()">
				<u-icon name="arrow-left" size="24"></u-icon>
			</view>
			<!-- 搜索 -->
			<view class="search-box">
				<view class="input" @click="search">
					<view class="icon-search">
						<u-icon name="search" size="20"></u-icon>
					</view>
					<swiper :indicator-dots="false" autoplay :interval="3000" :duration="200" vertical circular>
						<swiper-item v-for="(item, index) in hotWords" :key="index">
							<text>{{ item.queryName }}</text>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 分类 -->
		<view style="width: 100%;
		             height: 100%;
					 position: absolute;
					 top: 100rpx;">
			<view class="category-content">
				<!-- 左边类型 -->
				<scroll-view scroll-y="true" scroll-with-animation :show-scrollbar="false" :scroll-top="scrollTop"
					class="left-aside">
					<view v-for="(item,index) in flist" :key="index" class="f-item-box">
						<view class="f-item" :class="{active:index===curIndex}" @click="changeTag(item.id, index)">
							<text style="font-size: 30rpx;">{{item.name}}</text>
						</view>
					</view>
				</scroll-view>
				<!-- 右边内容 -->
				<scroll-view scroll-y="true" :show-scrollbar="false" :scroll-top="rightTop" scroll-with-animation="true"
					class="right-nav">
					<view v-for="(item,index) in zlist" :key="index" class="z-list">
						<view class="z-item">
							<text class="z-item-text">{{item.name}}</text>
							<view class="t-list">
								<view v-for="(item1,index1) in item.children" :key="index1" class="t-item"
									@click="goToGoodsList(item1)">
									<image :src="item1.smallImgCard.img" mode="aspectFit" lazy-load></image>
									<image class="label" :src="item1.smallImgCard.badge"></image>
									<text>{{item1.smallImgCard.name}}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 加载 -->
		<view v-show="loadStatus" class="loading">
			<u-loadmore status="loading" bg-color="#f8f8f8" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0, //tab标题的滚动条位置
				rightTop: 0, //右边滚动条位置
				menuHeight: 0, //左边菜单的高度
				menuItemHeight: 100, // 左边菜单item的高度
				flist: [], //父类
				zlist: [], //子类
				hotWords: [],
				bannerUrl: '',
				curIndex: 0,
				loadStatus: true, //是否加载
				keyword: '遥看瀑布挂前川'
			}
		},
		onLoad() {
			// 搜索关键字
			this.getHotWords();
			// 左边菜单数据
			this.getFirstCate();
		},
		methods: {
			goback() {
				history.back()
			},
			// 关键字
			getHotWords() {
				this.$u.api.placeHolder().then(res => {
					// console.log(res)
					if (res.data.length != 0) {
						this.hotWords = res.data;
					} else {
						this.hotWords.push({
							queryName: '搜一搜'
						})
					}
				})
			},
			// 左边菜单数据
			getFirstCate() {
				this.$u.api.firstCategory().then(res => {
					// console.log(res)
					this.flist = res.data.filter(x => x.type != 1);
					this.getSecondCate(res.data[0].id);
				})
			},
			// 右边子类数据
			getSecondCate(catId) {
				this.$u.api.categoryDetail({
					catId
				}).then(res => {
					this.zlist = res.data.children.filter(x => x.displayType == 0);
					this.loadStatus = false;
				})
			},
			// 改变标签
			async changeTag(catId, index) {
				if (index == this.curIndex) return;
				this.curIndex = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getDOMAttribute('left-aside', 'menuHeight');
					await this.getDOMAttribute('f-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
				// this.rightTop = 0;
				this.getSecondCate(catId)
			},
			// 获取一个目标元素的高度
			getDOMAttribute(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this)
					query
						.select('.' + elClass)
						.fields({
							size: true
						}, res => {
							// 如果节点尚未生成，res值为null，循环调用执行
							if (!res) {
								setTimeout(() => {
									this.getElRect(elClass)
								}, 10)
								return
							}
							this[dataVal] = res.height
						})
						.exec()
				})
			},
			// 商品详情
			goToGoodsList(item) {
				uni.navigateTo({
					url: `../../shop/goods/lists/lists?cid=${item.queryId}&&name=${item.smallImgCard.name}`
				});
			},
			// 搜索
			search() {
				uni.navigateTo({
					url: '../../shop/search/search'
				});
			}
		}
	}
</script>

<style lang="scss">
	$search-box-height: 60rpx;
	$search-box-bgColor: #F7F7F7;
	$search-box-color: #CCC;

	// 搜索
	.search-content {
		padding: 20rpx;
		box-sizing: content-box;
		display: flex;
		align-items: center;
		width: 750rpx;
		height: $search-box-height;
		background-color: #fff;
		position: fixed;
		z-index: 999;
		border-bottom: 1px solid #ccc;

		.left-icon {
			margin-right: 20rpx;
			display: flex;
			align-items: center;
			cursor: pointer;
		}

		.search-box {
			width: 560rpx;
			height: $search-box-height;
			background-color: $search-box-bgColor;
			box-shadow: 2rpx 2rpx 6rpx #f2f2f2;
			border-radius: $search-box-height;

			.input {
				display: flex;
				width: 100%;
				height: $search-box-height;
				color: $search-box-color;
				font-size: 28rpx;

				.icon-search {
					padding: 10rpx 20rpx 0rpx 20rpx;
				}

				swiper {
					width: 60%;
					height: $search-box-height;

					text {
						line-height: $search-box-height;
					}
				}
			}
		}
	}

	// 分类
	.category-content {
		height: 100%;
		background-color: #fff;
		display: flex;

		.left-aside {
			flex-shrink: 0;
			flex-grow: 0;
			width: 200rpx;
			height: 100%;
			background-color: #fff;

			.f-item {
				width: 100%;
				height: 100rpx;
				background-color: $uni-bg-color-grey;
				color: $uni-text-color;
				display: flex;
				justify-content: center;
				align-items: center;

				&.active {
					background-color: #fff;
					color: #dd1b69;
				}
			}
		}

		.right-nav {
			flex: 1;
			height: 100%;

			.z-list {
				padding: 20rpx 20rpx 0;

				.z-item {
					border-radius: 12rpx;
					background-color: #fff;

					.z-item-text {
						padding-left: 20rpx;
						line-height: 70rpx;
						height: 70rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #111;
					}

					.t-list {
						display: flex;
						flex-wrap: wrap;
						width: 100%;
						padding-top: 12rpx;
						margin-bottom: 20rpx;

						&:after {
							content: '';
							flex: 99;
							height: 0;
						}

						.t-item {
							position: relative;
							flex-shrink: 0;
							display: flex;
							justify-content: center;
							align-items: center;
							flex-direction: column;
							width: 33.33%;
							font-size: 24rpx;
							color: #666;
							padding-bottom: 20rpx;

							.label {
								position: absolute;
								top: 0;
								left: 0;
								width: 50rpx;
								height: 50rpx;
							}

							image {
								width: 128rpx;
								height: 128rpx;
								border-radius: 10rpx;
								margin-bottom: 10rpx;
							}

							text {
								width: 100%;
								text-align: center;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}
					}
				}
			}
		}
	}

	.loading {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translateY(-50%);
		z-index: 10;
	}
</style>
<template>
	<view class="page-search">
		<!-- 搜索 -->
		<view class="search">
			<!-- 上一级 -->
			<view class="left-icon" @click="goback">
				<u-icon name="arrow-left" size="24"></u-icon>
			</view>
			<!-- 搜索 -->
			<view class="search-box">
				<u-search :placeholder="defaultKeyword" v-model="keyword" @blur="searchHot" @change="getKeywords"  actionText=""></u-search>
			</view>
		</view>
		<!-- 历史记录+热搜词汇 -->
		<view class="history-hot" v-if="!keywordList.length">
			<!-- 历史记录 -->
			<view class="history common" v-if="oldKeywordList.length">
				<view class="title">
					<text>历史记录</text>
					<view @click="clearHistory">
						<u-icon name="trash" size="24"></u-icon>
					</view>
				</view>
				<view class="item-hot">
					<view v-for="(item,index) in oldKeywordList" :key="index" class="item" @click="goShopList(item)">
						<text>{{item}}</text>
					</view>
				</view>
			</view>
			<!-- 热搜词汇 -->
			<view class="hot common">
				<view class="title">
					<text>热门搜索</text>
					<text style="color: #7B7D85;" @click="showWords">{{showHot?'隐藏':'显示'}}</text>
				</view>
				<view class="item-hot" v-if="showHot">
					<view v-for="(item,index) in hotWords" :key="index" class="item" v-if="item.queryName"
						@click="goShopList(item.queryName)">
						<text>{{item.queryName}}</text>
					</view>
				</view>
				<view v-if="!showHot" style="text-align: center;margin-top: 30rpx;">
					<text style="font-size: 24rpx;color:#7B7D85 ;">已隐藏搜索发现</text>
				</view>
			</view>
		</view>
		<!-- 查询结果 -->
		<view class="keyword-list-box" v-if="keywordList.length">
			<scroll-view scroll-y="true" scroll-with-animation :show-scrollbar="false" class="aside">
				<view v-for="(item,index) in keywordList" :key="index" class="keyword-list">
					<view class="item-key" @click="goShopList(item.queryName)">
						<u-icon name="search" size="20"></u-icon>
						<text style="font-size: 30rpx;">{{item.queryName}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: "", //查询关键字
				defaultKeyword: "", //搜索热词
				oldKeywordList: [], //历史记录关键字
				keywordList: [], //查询的关键字相关信息
				searchTimer: null,
				showHot: true,
				hotWords: []
			}
		},
		onLoad(e) {
			// 获取历史记录
			this.getHistory()
			// 搜索热词
			this.getHotWords();
			if (e.keyword) {
				this.keyword = e.keyword;
			}
		},
		methods: {
			// 获取最近搜索热词
			getHotWords() {
				this.$u.api.hotWords().then(res => {
					// 热词集合
					this.hotWords = res.data;
					// 随机任意热词
					const random = Math.floor(Math.random() * this.hotWords.length);
					this.defaultKeyword = res.data[random].queryName;
				})
			},
			// 获取输入框中关键字相关数据
			getKeywords() {
				if (!this.keyword) {
					this.keywordList = [];
					return;
				}
				this.$u.api.searchSuggest({
					query: this.keyword
				}).then(res => {
					this.keywordList = res.data;
				});
			},
			// 获取输入框中关键字
			searchHot(key) {
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				this.saveHistory(key);
				// 跳转到商品清单中
				// if (this.keyword) {
				// 	uni.navigateTo({
				// 		url: '../goods/lists/lists?key=' + this.keyword
				// 	});
				// }
			},
			// 跳转到商品清单中
			goShopList(key){
				uni.navigateTo({
					url: '../goods/lists/lists?key=' + key
				});
			},
			// 保存历史记录到本地存储
			saveHistory(key) {
				uni.getStorage({
					key: 'OldKeys',
					success: res => {
						var OldKeys = JSON.parse(res.data);
						// 去重
						if (OldKeys.indexOf(key) == -1) {
							OldKeys.unshift(key)
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop()
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						})
						this.oldKeywordList = OldKeys //更新历史搜索
					},
					fail: e => {
						var OldKeys = [key]
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						})
						this.oldKeywordList = OldKeys //更新历史搜索
					}
				})
			},
			// 获取本地存储历史数据
			getHistory() {
				uni.getStorage({
					key: 'OldKeys',
					success: res => {
						// console.log(res)
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				})
			},
			// 是否显示热门搜索
			showWords() {
				this.showHot = !this.showHot;
			},
			// 清除历史记录
			clearHistory() {
				uni.showModal({
					title: '删除',
					content: '确定删除历史记录吗？',
					confirmColor: '#c30d23',
					success: res => {
						if (res.confirm) {
							this.oldKeywordList = []
							uni.removeStorage({
								key: 'OldKeys'
							})
						} else if (res.cancel) {
							// console.log('用户点击取消')
						}
					}
				})
			},
			// 返回上一级
			goback() {
				history.back()
			}
		}
	}
</script>

<style lang="scss">
	$search-box-height:60rpx;

	.page-search {
		width: 100%;
		height: 100%;

		// 搜索
		.search {
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
				flex: 1;
			}
		}

		// 历史记录+热搜词汇
		.history-hot {
			position: absolute;
			top: 100rpx;
			padding: 20rpx;
			width: 100%;

			.common {
				width: 100%;

				.title {
					display: flex;
					justify-content: space-between;
					font-size: 36rpx;
					height: 60rpx;
					align-items: center;
				}

				.item-hot {
					display: flex;
					flex-wrap: wrap;
					font-size: 24rpx;
					color: #7B7D85;

					.item {
						padding: 10rpx 30rpx;
						border-radius: 10rpx;
						background-color: #F0F2F5;
						margin: 20rpx 20rpx 0rpx 0rpx;
					}
				}
			}

			.hot {
				margin-top: 30rpx;
			}
		}

		// 查询相关数据
		.keyword-list-box {
			position: absolute;
			top: 100rpx;
			width: 100%;

			.aside {
				flex-shrink: 0;
				flex-grow: 0;
				width: 100%;
				height: 100%;

				.item-key {
					width: 100%;
					height: 80rpx;
					border-bottom: 1px solid #fcfcfc;
					padding-left: 30rpx;
					display: flex;
					align-items: center;
					font-size: 30rpx;
					color: #303133;

					text {
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>

<template>
	<view class="shop-list">
		<!-- 头部 -->
		<view class="shop-list-header">
			<!-- 搜索 -->
			<view class="search">
				<!-- 上一级 -->
				<view class="left-icon" @click="goback">
					<u-icon name="arrow-left" size="24"></u-icon>
				</view>
				<!-- 搜索 -->
				<view class="search-box">
					<u-search v-model="keyword" actionText="" @focus="goSearch" @clear="goSearch"></u-search>
				</view>
			</view>
			<!-- 筛选条件 -->
			<view class="screen">
				<!-- 综合 -->
				<view class="screen-multiple">
					<view class="title stitle" @click="showMultiple=true">
						<text
							:style="{color: sortBy == (multiples[multipleIndex]&&multiples[multipleIndex].id)? '#BF1111' : '#333' }">{{(multiples[multipleIndex]&&multiples[multipleIndex].name)||'综合'}}</text>
					</view>
					<u-popup mode="top" :show="showMultiple" @close="showMultiple=false">
						<view v-for="(item,index) in multiples" :key="index">
							<view style="width: 100%;
							             height: 100rpx;
										 border-bottom: 1px solid #ccc;
										 display: flex;
										 align-items: center;
										 padding-left: 20rpx;
										 font-size: 30rpx;" @click="sort(item.id,index),(showMultiple=false)">
								<text>{{item.name}}</text>
							</view>
						</view>
					</u-popup>
				</view>
				<!-- 销量 -->
				<view class="screen-multiple">
					<view class="title stitle" :style="{ color: sortBy == 8 ? '#BF1111' : '#333' }" @click="sort(8,-1)">
						<text>销量</text>
					</view>
				</view>
				<!-- 信用 -->
				<view class="screen-multiple">
					<view class="title stitle" @click="sort(6,-1)" :style="{ color: sortBy == 6 ? '#BF1111' : '#333' }">
						<text>信用</text>
					</view>
				</view>
				<!-- 筛选 -->
				<view class="screen-multiple">
					<view class="title stitle" @click="filterPop = true">
						<text>筛选</text>
						<!-- <u-icon name="filter" size="30"></u-icon> -->
					</view>
					<u-popup mode="right" :show="filterPop" @close="filterPop=false">
						<!-- 内容 -->
						<scroll-view scroll-y="true" class="filter">
							<!-- 折扣与服务 -->
							<view class="params" v-if="screeningInfo.services">
								<view class="head u-flex">
									<view class="title">折扣与服务</view>
								</view>
								<view class="list u-flex">
									<text v-for="(item, index) in screeningInfo.services" :key="index"
										:class="{ active: isActive(item, 'services') }"
										@click="paramsFilter(item, 'services')">
										{{ item.name }}
									</text>
								</view>
							</view>
							<!-- 价格区间 -->
							<view class="params">
								<view class="head u-flex">
									<view class="title">价格区间</view>
								</view>
								<view class="price-box u-flex">
									<input type="text" placeholder="最低价" v-model.number="filter.minPrice" />
									<text>-</text>
									<input type="text" placeholder="最高价" v-model.number="filter.maxPrice" />
								</view>
							</view>
							<!-- 分类 -->
							<view class="params" v-if="screeningInfo.category2">
								<view class="head u-flex">
									<view class="title">分类</view>
								</view>
								<view class="list u-flex">
									<text v-for="(item, index) in screeningInfo.category2" :key="index"
										:class="{ active: isActive(item, 'category2') }"
										@click="paramsFilter(item, 'category2')">{{ item.name }}
									</text>
								</view>
							</view>
							<!-- 品牌 -->
							<view class="params" v-if="screeningInfo.brands">
								<view class="head u-flex">
									<view class="title">品牌</view>
								</view>
								<view class="list u-flex">
									<text :class="{ active: isActive(item, 'brands') }"
										v-for="(item, index) in screeningInfo.brands" :key="index"
										@click="paramsFilter(item, 'brands')">
										{{ item.name }}
									</text>
								</view>
							</view>
							<!-- 其他 -->
							<view class="params" v-for="(item, index) in screeningInfo.attr" :key="index">
								<view class="head u-flex">
									<view class="title">{{ item.name }}</view>
								</view>
								<view class="list u-flex">
									<text :class="{ active: sitem.selected }" v-for="(sitem, sindex) in item.attrValue"
										:key="sindex" @click="attrFilter(item, sitem)">
										{{ sitem.name }}
									</text>
								</view>
							</view>
						</scroll-view>
						<!-- 按钮 -->
						<view class="btns u-flex">
							<view class="btn reset u-flex" @click="resetFilter">重置</view>
							<view class="btn confirm u-flex" @click="filterPop = false">确定</view>
						</view>
					</u-popup>
				</view>
			</view>
		</view>
		<!--商品 卡片视图-->
		<view class="goodslist-card" v-show="display == 'card'">
			<view class="goodslist-content">
				<view v-for="(item,index) in goodsList" :key="index">
					<view class="goodslist-item" @click="goToDetail(item.data.goodsInfo.gid)">
						<!-- 图片 -->
						<view class="item-image">
							<u-image :src="item.data.goodsInfo.img800s || item.data.goodsInfo.imgSquare" mode="widthFix"
								width="100%" height="300" errorIcon="error-circle"></u-image>
						</view>
						<!-- 标签 -->
						<view class="item-label" v-if="false">
							<text v-for="(item1, index1) in item.data.label.normal" :key="index1"
								:style="{ backgroundColor: getLabelColor(item1.attrs) }">{{ item1.text }}</text>
						</view>
						<!-- 标题 -->
						<view class="item-title">{{ item.data.goodsInfo.name }}</view>
						<!-- 介绍 -->
						<view class="item-subtitle">
							<text
								v-if="!item.data.goodsInfo.coreSellingPoint || item.data.goodsInfo.coreSellingPoint.length == 0">{{ item.data.goodsInfo.summary }}</text>
							<view v-else class="selling-point">
								<text v-for="(sitem, sindex) in item.data.goodsInfo.coreSellingPoint"
									:key="sindex">{{ sitem }}</text>
							</view>
						</view>
						<!-- 价格 -->
						<view class="item-price">
							<text>￥</text>
							<text class="priceMin">{{ item.data.goodsInfo.priceMin / 100 }}</text>
							<text class="spec" v-if="item.data.goodsInfo.priceTag">起</text>
							<text class="marketPrice"
								v-if="item.data.goodsInfo.priceMin != item.data.goodsInfo.marketPrice">￥{{ item.data.goodsInfo.marketPrice / 100 }}</text>
						</view>
						<!-- 评价 -->
						<view class="item-comment">
							<text>{{ item.data.comment.count > 100000 ? '10万+' : item.data.comment.count }}条评论</text>
							<text
								v-if="item.data.comment.positiveRate > 0">{{ item.data.comment.positiveRate }}%好评</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 加载中-->
			<view v-show="showLoadmore">
				<u-loadmore :status="loadingStatus" :margin-top="20" :margin-bottom="40" bg-color="#f9f9f9"
					:load-text="loadingText" color="#999" />
			</view>
		</view>
		<!--商品  列表视图-->
		<view class="goodslist-list" v-show="display == 'list'">
			<view v-for="(item,index) in goodsList" :key="index">
				<view class="goodslist-item" @click="goToDetail(item.data.goodsInfo.gid)">
					<!-- 图片 -->
					<view class="goods-img">
						<u-image :src="item.data.goodsInfo.img800s || item.data.goodsInfo.imgSquare" mode="widthFix"
							width="100%" height="300" errorIcon="error-circle"></u-image>
					</view>
					<!-- 文本 -->
					<view class="content u-flex-col">
						<view class="title u-line-1">{{ item.data.goodsInfo.name }}</view>
						<view class="subtitle u-line-1">{{ item.data.goodsInfo.summary }}</view>
						<view class="selling-point" v-if="item.data.goodsInfo.coreSellingPoint">
							<text v-for="(sitem, sindex) in item.data.goodsInfo.coreSellingPoint"
								:key="sindex">{{ sitem }}</text>
						</view>
						<view class="price">
							<text>￥</text>
							<text class="priceMin">{{ item.data.goodsInfo.priceMin / 100 }}</text>
							<text class="spec" v-if="item.data.goodsInfo.priceTag">起</text>
							<text class="marketPrice"
								v-if="item.data.goodsInfo.priceMin != item.data.goodsInfo.marketPrice">￥{{ item.data.goodsInfo.marketPrice / 100 }}</text>
						</view>
						<view class="labelbox">
							<text v-for="(litem, lindex) in item.data.label.normal" :key="lindex"
								:style="{ backgroundColor: getLabelColor(litem.attrs) }">{{ litem.text }}</text>
						</view>
						<view class="comment">
							<text>{{ item.data.comment.count > 100000 ? '10万+' : item.data.comment.count }}条评论</text>
							<text
								v-if="item.data.comment.positiveRate > 0">{{ item.data.comment.positiveRate }}%好评</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 加载中-->
			<view v-show="showLoadmore">
				<u-loadmore :status="loadingStatus" :margin-top="20" :margin-bottom="40" bg-color="#f9f9f9"
					:load-text="loadingText" color="#999" />
			</view>
		</view>
		<!-- 重新获取数据加载 -->
		<view class="sortLoading" v-show="sortLoading">
			<full-loading></full-loading>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
	<!-- </view> -->
</template>

<script>
	import fullLoading from '@/components/full-loading.vue'
	export default {
		components: {
			fullLoading
		},
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
				multiples: [{
					name: '综合',
					id: 0,
				}, {
					name: '最新上市',
					id: 7
				}, {
					name: '价格从低到高',
					id: 1
				}, {
					name: '价格从高到低',
					id: 2
				}],
				display: 'card',
				multipleIndex: 0,
				multValue: '',
				showSale: false,
				distributions: ['有货优先', '付款到家'],
				showDistribution: false,
				queryID: "",
				showMultiple: false,
				sortBy: 0, //排序id
				pageIdx: 0,
				pageType: "",
				total: 0,
				screeningInfo: {},
				screeningInfoCount: 0,
				filter: {
					attr: [],
					brands: [],
					category1: [],
					category2: [],
					category3: [],
					maxPrice: null,
					minPrice: null,
					services: [],
					special: [],
					specialCoupon: [],
					tags: []
				},
				filterPop: false,
				goodsList: [],
				loadingText: {
					loadmore: '上拉加载更多',
					loading: '努力加载中~',
					nomore: '我也是有底线的'
				},
				sortLoading: true,
				loadingStatus: "loadmore"
			}
		},
		computed: {
			showLoadmore() {
				return this.goodsList.length !== 0 ? true : false
			}
		},
		onLoad(e) {
			if (e.key) {
				this.pageType = 'searchPage';
				this.keyword = e.key;
			} else if (e.cid) {
				this.pageType = 'categoryTab'
				this.queryID = e.cid;
				this.keyword = e.name;
			} else {
				this.sortLoading = false;
			}
			this.getGoodsList()
		},
		// 到页面底部触发
		onReachBottom() {
			if (this.pageIdx < this.total) {
				this.getGoodsList('more')
				this.loadingStatus = 'loading';
			} else {
				this.loadingStatus = 'nomore';
			}
		},
		methods: {
			// 获取输入框中关键字相关数据
			goSearch() {
				uni.navigateTo({
					url: '../../search/search?keyword=' + this.keyword
				});
			},
			// 获取商品详情
			getGoodsList(type) {
				// 0 综合排序  8 销量排序  7 新品排序  1 价格低到高  2 价格高到低  6 信用排序
				let data = {
					queryId: this.queryID,
					query: [{
						queryName: this.keyword,
						queryType: 0,
						rule: []
					}],
					sortBy: this.sortBy,
					pageIdx: 0,
					filter: this.filter,
					source: this.pageType
				}
				let api = '';
				if (this.pageType == 'categoryTab') {
					api = 'queryIdSearch';
				} else if (this.pageType == 'searchPage') {
					api = 'doSearch';
				}
				if (!api) {
					this.sortLoading = false;
					return
				};
				console.log(data,'0----------------1')
				this.$u.api[api] && this.$u.api[api](data).then(res => {
					console.log(res.data, 'ddddddd')
					if (type != 'more') {
						if (res.data.data.extraGoods) this.goodsList = res.data.data.extraGoods;
						else if (res.data.data.goods) this.goodsList = res.data.data.goods;
						this.pageIdx = res.data.pageIdx;
						this.total = res.data.total;
						if (res.data.screeningInfo && this.screeningInfoCount == 0) {
							this.screeningInfo = res.data.screeningInfo;
							this.screeningInfoCount++;
						}
						if (this.total == 0) {
							this.showToast('暂无匹配商品，请重新选择', 'warning');
						}
						this.sortLoading = false;
					} else {
						let data = [];
						if (res.data.data.extraGoods) data = res.data.data.extraGoods;
						else if (res.data.data.goods) data = res.data.data.goods;
						res.data.data.goods.forEach(x => {
							this.goodsList.push(x);
						});
						this.loadingStatus = 'loadmore';
						this.pageIdx = res.data.pageIdx;
					}
				}).catch(err => {
					this.sortLoading = false;
					this.showToast('没有获取商品数据，请重新刷新', 'warning');
				})
			},
			// 排序
			sort(id, index) {
				// 当点击筛选ID和目前列表的筛选ID一致时，不请求数据，节省流量
				if (id == this.sortBy) return;
				switch (id) {
					case 3:
						switch (this.sortBy) {
							case 1:
								this.sortBy = 2
								console.log('降序排列')
								break
							case 2:
								this.sortBy = 1
								console.log('升序排列')
								break
							default:
								this.sortBy = 2
								console.log('降序排列')
						}
						break
					default:
						this.sortBy = id
				}
				this.goodsList = [];
				this.pageIdx = 0;
				this.multipleIndex = index;
				this.sortLoading = true;
				this.getGoodsList();
			},
			// 获取标签颜色
			getLabelColor(str) {
				// console.log(str.substr(str.indexOf('#'), 7))
				return str.substr(str.indexOf('#'), 7)
			},
			// 显示提示框
			showToast(msg, type) {
				this.$refs.uToast.show({
					message: msg,
					type: type
				});
			},
			// 过滤条件
			paramsFilter(item, type) {
				if (this.filter[type].indexOf(item.name) == -1) {
					this.filter[type].push(item.name)
				} else {
					this.filter[type].splice(this.filter[type].indexOf(item.name), 1)
				}
				this.filterColor = '#BF1111'
				this.getGoodsList()
			},
			// 其他过滤条件
			attrFilter(item, sitem) {
				let result = []
				item.attrValue.some((x, i) => {
					if (x.name == sitem.name) {
						if (!x.selected) {
							this.$set(x, 'selected', true)
						} else {
							x.selected = false
						}
					}
					if (x.selected) {
						result.push(x)
					} else {
						result.splice(i, 1)
					}
				})
				// console.log(result)
				let str = []
				result.forEach(x => {
					str.push(x.name)
				})
				// console.log(str)
				let obj = {
					name: item.name,
					attrValue: []
				}
				// console.log(obj)
				let flag = true
				this.filter.attr.forEach(item => {
					if (item.name === obj.name) {
						// 对象里的唯一标识name
						flag = false
					}
				})
				if (flag) {
					this.filter.attr.push(obj)
				}
				this.filter.attr.forEach((x, i) => {
					if (x.name == item.name) {
						x.attrValue = str
					}
					if (x.attrValue.length == 0) {
						this.filter.attr.splice(i, 1)
					}
				})

				this.filterColor = '#BF1111'
				this.getGoodsList()
			},
			// 选中过滤条件
			isActive(item, type) {
				if (this.filter[type].indexOf(item.name) == -1) {
					return false
				} else {
					return true
				}
			},
			// 重置条件
			resetFilter() {
				// 初始化filter对象
				Object.assign(this.$data.filter, this.$options.data().filter);
				this.screeningInfo.attr.forEach(x => {
					x.attrValue.forEach(s => {
						s.selected = false;
					});
				});
				this.filterColor = '#333';
				this.getGoodsList();
			},
			// 商品购买界面
			goToDetail(gid) {
				uni.navigateTo({
					url: '../detail/detail?gid=' + gid
				});
			},
			// 返回上一级
			goback() {
				history.back();
			}
		}
	}
</script>

<style lang="scss">
	$search-box-height: 60rpx;
	$shopSpace: 20rpx;
	$shopWidth: (
		750rpx - $shopSpace*2-$shopSpace)/2;
	$appWidth: 750rpx;

	.shop-list {
		width: 100%;
		height: 100%;

		// 搜索
		.shop-list-header {
			position: fixed;
			z-index: 999;
			border-bottom: 1px solid #E5E5E5;
			width: 100%;
			background-color: #fff;

			.search {
				padding: 20rpx;
				box-sizing: content-box;
				display: flex;
				align-items: center;
				width: 100%;
				height: $search-box-height;
				background-color: #fff;

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

			.screen {
				width: 100%;
				height: 100rpx;
				// background-color: #ddd;
				padding: 30rpx;
				display: flex;
				justify-content: space-between;

				.screen-multiple {
					width: 100%;

					.title {
						display: flex;
					}

					.stitle {
						display: flex;
						justify-content: center;
					}

					.filter {
						height: 92%;
						width: 600rpx;
						// width: 100%;
						flex-shrink: 0;
						flex-grow: 0;
						background-color: #F7F7F7;

						.params {
							margin-bottom: 20rpx;
							padding: 0 20rpx;
							background-color: #FFFFFF;

							.head {
								justify-content: space-between;
								height: 60rpx;
								font-size: 28rpx;
								color: #353C43;
								padding: 20rpx 0rpx 20rpx 0rpx;
								border-bottom: 1px solid #ddd;

								.title {
									font-size: 28rpx;
									margin-bottom: 20rpx;
								}

								.all {
									color: #999;
									font-size: 22rpx;
								}
							}

							.list {
								// justify-content: space-between;
								display: flex;
								flex-wrap: wrap;
								margin: 20rpx;
								justify-content: space-between;

								text {
									margin: 0 16rpx 20rpx 0;
									padding: 0 10rpx;
									height: 52rpx;
									width: 176rpx;
									max-width: 176rpx;
									font-size: 24rpx;
									display: flex;
									justify-content: center;
									align-items: center;
									border-radius: 26rpx;
									background-color: #F7F7F7;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
									border: 1rpx solid rgb(244, 244, 244
									);
								color: #DCDCDC;
							}

							text:nth-child(3n) {
								margin-right: 0;
							}

							.active {
								color: #bf1111;
								border: 1rpx solid rgb(191, 17, 17);
								background-color: rgb(246, 237, 237);
							}
						}

						.price-box {
							justify-content: space-between;
							margin-top: 10rpx;
							display: flex;

							input {
								height: 52rpx;
								width: 240rpx;
								margin-bottom: 20rpx;
								text-align: center;
								border-radius: 26rpx;
								background-color: rgb(244, 244, 244);
								font-size: 24rpx;
								// color: #DCDCDC;
							}

							text {
								margin-bottom: 20rpx;
							}
						}
					}
				}

				.btns {
					display: flex;
					justify-content: space-around;
					height: 100rpx;
					position: fixed;
					bottom: 0rpx;
					width: 600rpx;
					background-color: #FFFFFF;

					.btn {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 80%;
						width: 46%;
						border-radius: 60rpx;
					}

					.reset {
						color: rgb(51, 51, 51);
						border: 1rpx solid rgb(204, 204, 204);
					}

					.confirm {
						color: #fff;
						background: linear-gradient(to right, rgb(240, 78, 46), rgb(213, 16, 16));
					}
				}
			}
		}
	}

	// 商品
	.goodslist-card {
		position: absolute;
		top: 200rpx;
		width: 100%;
		background-color: #F7F7F7;

		.goodslist-content {
			padding: $shopSpace;
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.goodslist-item {
				width: $shopWidth;
				background-color: #fff;
				margin-bottom: $shopSpace;

				.item-image {
					width: 100%;
					height: 300rpx;
					background-color: #fff;
				}

				.item-label {
					display: flex;
					flex-wrap: wrap;
					font-size: 26rpx;
					color: #000;

					text {
						display: inline-block;
						border-radius: 2rpx;
						color: #ffffff;
						margin-right: 10rpx;
						text-align: center;
						height: 32rpx;
						padding: 0 10rpx;
						line-height: 32rpx;
						font-size: 24rpx;
					}
				}

				.item-title {
					font-size: 30rpx;
					color: #111;
					font-size: 30prx;
					padding: 0rpx 6rpx 0rpx 16rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				.item-subtitle {
					font-size: 30rpx;
					padding: 0rpx 6rpx 0rpx 16rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					color: rgb(153, 153, 153);
					margin-top: 4rpx;
					line-height: 36rpx;

					.selling-point {
						text {
							font-size: 22rpx;
							display: inline-block;
							margin-right: 8rpx;
							padding: 0 12rpx;
							border-radius: 36rpx;
							background-color: rgb(248, 248, 248);
						}
					}
				}

				.item-price {
					margin-top: 10rpx;
					padding-left: 16rpx;
					color: rgb(227, 13, 13);
					font-size: 26rpx;
					height: 40rpx;
					font-family: 'AllAndNone';

					.priceMin {
						font-size: 34rpx;
						margin-right: 4rpx;
						font-weight: bold;
					}

					.marketPrice {
						margin-left: 6rpx;
						font-size: 24rpx;
						color: #999;
						text-decoration: line-through;
					}

					.spec {
						font-size: 24rpx;
					}
				}

				.item-comment {
					margin-top: 6rpx;
					padding-left: 16rpx;
					font-size: 22rpx;
					color: #999;

					text {
						margin-right: 12rpx;
					}
				}
			}
		}
	}

	.goodslist-list {
		position: absolute;
		top: 200rpx;
		width: 100%;
		background-color: #F7F7F7;
		overflow: hidden;

		.goodslist-item {
			padding: 30rpx 0;
			font-size: 28rpx;
			background-color: #FFFFFF;
			border-bottom: 1px solid #E5E5E5;
			display: flex;
			justify-content: space-between;

			.goods-img {
				width: 252rpx;
				height: 252rpx;

				.u-wrap {
					background-color: rgba(0, 0, 0, 0.02) !important;
				}
			}

			.content {
				height: 252rpx;
				padding: 4rpx 0 2rpx 16rpx;
			}

			.title,
			.subtitle {
				width: 440rpx;
			}

			.title {
				font-size: 28rpx;
				color: #333;
				line-height: 42rpx;
			}

			.subtitle {
				font-size: 24rpx;
				color: rgb(153, 153, 153);
				margin-top: 4rpx;
				line-height: 36rpx;
			}

			.selling-point {
				text {
					display: inline-block;
					margin-right: 8rpx;
					padding: 0 12rpx;
					font-size: 22rpx;
					color: #999;
					border-radius: 36rpx;
					background-color: rgb(248, 248, 248);
				}
			}

			.price {
				margin-top: auto;
				color: rgb(227, 13, 13);
				font-size: 26rpx;
				height: 40rpx;
				font-family: 'AllAndNone';

				.priceMin {
					font-size: 34rpx;
					margin-right: 4rpx;
					font-weight: bold;
				}

				.marketPrice {
					margin-left: 6rpx;
					font-size: 24rpx;
					color: #999;
					text-decoration: line-through;
				}

				.spec {
					font-size: 24rpx;
				}
			}

			.labelbox {
				text {
					display: inline-block;
					border-radius: 4rpx;
					color: #ffffff;
					margin-right: 10rpx;
					text-align: center;
					height: 32rpx;
					padding: 0 10rpx;
					line-height: 32rpx;
					font-size: 24rpx;
				}
			}

			.comment {
				margin-top: 6rpx;
				font-size: 22rpx;
				color: #999;

				text {
					margin-right: 12rpx;
				}
			}
		}
	}

	.sortLoading {
		position: absolute;
	}
	}
</style>
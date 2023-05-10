<template>
	<view class="cart-page">
		<view :style="[top]" class="top">
			<view class="title">购物车</view>
		</view>
		<!-- 顶部组件 -->
		<view class="nav-bar" v-show="showNavBar">
			<u-navbar :is-back="false" :background="{ background: '#fff' }" border-bottom id="nav-bar"
				title="购物车"></u-navbar>
		</view>
		<!-- 未登录 -->
		<view class="no-goods" v-if="!isLogin">
			<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/af4ee070-abaf-11ea-9e8b-05a3242b26f2.png"
				mode=""></image>
			<view>登录之后才可以使用购物车哦~</view>
			<view class="btn" @click="navigateTo('login')">去登录</view>
		</view>
		<!-- 没有商品 -->
		<view class="no-goods" v-if="isLogin && goodsIds.length == 0">
			<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/af4ee070-abaf-11ea-9e8b-05a3242b26f2.png"
				mode=""></image>
			<view>购物车还没有商品哦~</view>
			<view class="btn" @click="navigateTo('home')">去逛逛</view>
		</view>
		<!-- 有商品 -->
		<view class="have-goods" id="have_goods" v-if="isLogin && goodsArr.length != 0">
			<view class="shop-card">
				<view class="shop-title u-flex">
					<image :src="allSelected ? checked_img : unchecked_img" class="checked-img" @click="allChoose">
					</image>
					<view class="title-nav">
						<text class="title">全选</text>
						<view class="delGoods" @click="goodsDel()">
							删除
						</view>
					</view>
				</view>
				<view class="goods-box u-flex" v-for="(item, index) in goodsIds" :key="index">
					<image :src="item.checked ? checked_img : unchecked_img" class="checked-img"
						@click="selectGoods(index)"></image>
					<view class="goods-nav">
						<view class="goods-img">
							<image :src="item.img" mode="aspectFill"></image>
						</view>
						<view class="detail">
							<view class="name u-line-2">
								<text class="label" v-for="litem in (item.labels||[{attrs:{}}])" :key="litem.labelId"
									:style="{color:litem.attrs.bgColor,borderColor:litem.attrs.bgColor}">
									{{litem.text||'测试01'}}
								</text>
								{{ item.name || '111111111'}}
							</view>
							<view class="props-box u-line-1">
								<text class="prop u-line-1" v-for="(pitem, pindex) in (item.props||['测试11111111'])"
									:key="pindex">{{ pitem }}</text>
							</view>
							<view class="price-box u-flex">
								<view class="price">￥{{ item.price||100.00 }}</view>
								<view class="count">
									<u-number-box :min="1" :max="9" button-size="24" :value="item.count" :index="index"
										@change="changeCount(item, $event)"></u-number-box>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>
		<!-- 结算 -->
		<view class="settlement" v-if="goodsIds.length != 0">
			<view @click="allChoose">
				<image :src="allSelected ? checked_img : unchecked_img" class="select_img"></image>
				<view>全选</view>
			</view>
			<view class="confirm">
				<view>
					合计：
					<text>￥{{ totalPrice }}</text>
				</view>
				<view @click="confirm()">
					结算
					<text>({{ totalQuantity||1}})</text>
				</view>
			</view>
		</view>
		<!-- 推荐商品 -->
		<mi-goods-list :dataList="goodsList" :loadMoreBg="loadingBg" :showLoadmore="showLoadmore"
			:loadMoreStatus="loadingStatus"></mi-goods-list>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import miGoodsList from '@/components/mi-goods-list.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			miGoodsList
		},
		data() {
			return {
				options1: [{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c',
					}
				}],
				showNavBar: false,
				navBarBottom: false,
				top: {},
				goodsIds: [],
				idsArrLength: 0,
				goodsArr: [],
				goodsList: [],
				shopList: [],
				dataOffset: 0,
				showLoadmore: false,
				loadingStatus: 'loadmore',
				loadingBg: '#f7f7f7',
				checked_img: '/static/checked.png',
				unchecked_img: '/static/unchecked.png',
			}
		},
		computed: {
			...mapState(['isLogin', 'userInfo'])
		},
		onLoad() {
			this.getRecGoods();
		},
		onShow() {
			if (this.isLogin) {
				uni.showLoading({
					title: '加载中...'
				});
				this.getCartGoods();
			}
		},
		onPageScroll(e) {
			this.showNavBar = e.scrollTop > 30 ? true : false
		},
		updated() {
			// console.log(this.goodsIds, 'dddddddddd')
			// this.$forceUpdate();
		},
		onReachBottom() {
			if (this.dataOffset >= 120) {
				return (this.loadingStatus = 'nomore')
			}
			this.loadingStatus = 'loading'
			this.getRecGoods()
		},
		computed: {
			// 数据
			// goodsId() {
			// 	console.log(this.goodsIds,'12123');
			// 	return this.goodsIds;
			// },
			// 总价格
			totalPrice() {
				let totalFee = 0;
				this.goodsIds.forEach(x => {
					// console.log(x);
					if (x.checked) {
						totalFee += x.price * x.count;
					}
				});
				return totalFee.toFixed(2);
			},
			// 总商品数量
			totalQuantity() {
				let quantity = 0
				this.goodsIds.forEach(x => {
					if (x.checked) {
						quantity += x.count;
					}
				})
				return quantity;
			},
			// 是否全部选中
			allSelected() {
				return this.goodsIds.filter(x => x.checked).length == this.goodsIds.length ? true : false;
			}
		},
		methods: {
			//获取用户购物车商品
			getCartGoods() {
				uniCloud.callFunction({
					name: 'getCartGoodsId',
					data: {
						userName: this.userInfo.userName
					}
				}).then(res => {
					uni.hideLoading();
					let data = res.result.data;
					if (!data.length) return;
					this.goodsIds = res.result.data;
					let idsArr = [];
					data.forEach(x => {
						if (idsArr.indexOf(x.gid) == -1) {
							idsArr.push(x.gid);

						}
					});
					this.goodsArr = [];
					idsArr.map(item => {
						this.getGoodsInfo(item, idsArr.length);
					});
				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: '获取购物车信息失败,请刷新重试',
						icon: 'none'
					});
					uni.hideLoading();
				});
			},
			// 处理商品数据，整理格式
			addGoodsData(goods, idsArrLength) {
				this.goodsArr.push(goods);
				if (this.goodsArr.length == idsArrLength) {
					// 把对应商品数据保存进原数组
					this.goodsIds.forEach((item1, index) => {
						this.goodsArr.forEach(item2 => {
							if (item1.gid == item2.goodsInfo.gid) {
								this.goodsIds[index] = this.addType(item1, 'goods', item2);
							}
						});
					});
					this.goodsIds.forEach(x => {
						x.name = x.goodsInfo.name;
						x.price = x.productInfo[x.pid].price;
						x.img = x.productInfo[x.pid].img;
						if (x.labels && x.labels.length != 0) {
							x.labels = x.labels;
						}
						if (x.propTags.length != 0) {
							x.tids = [];
							const tids = x.propTags.filter(item => item.pid == x.pid);
							for (var i = 0; i < tids.length; i++) {
								x.tids.push(tids[i].tid);
							}
						}
						if (x.shopTags.length != 0) {
							x.props = [];
							for (var i = 0; i < x.tids.length; i++) {
								x.shopTags.forEach(item => {
									let props = item.tags.filter(tag => tag.tid == x.tids[i]);
									if (props.length != 0) {
										x.props.push(props[0].name);
									}
								});
							}
						}
						if (x.brand) {
							x.brand = x.brand;
						}
						// this.$delete(x, 'tids')
						// this.$delete(x, 'goods')
					});
					console.log(this.goodsIds);
				}
			},
			// 商品gid
			getGoodsInfo(gid, idsArrLength) {
				this.$u.api.getGoodsDetail({
					gid
				}).then(res => {
					this.addGoodsData(res.data.goods, idsArrLength);
				});
			},
			/* 结算按钮 */
			confirm: function() {
				if (this.goodsIds.filter(x => x.checked).length !== 0) {
					this.$refs.miToast.show({
						title: '当前结算价格为：' + this.totalPrice,
						type: 'success'
					})
				} else {
					this.$refs.miToast.show({
						title: '暂未选择商品~',
						type: 'warning'
					})
				}
			},
			// 改变商品数量
			changeCount(item, e) {
				// console.log('触发了')
				uni.showLoading({
					title: '加载中'
				})
				// console.log(e.value)
				const newCount = parseInt(e.value)
				uniCloud.callFunction({
					name: 'updateCartCount',
					data: {
						userName: this.userInfo.userName,
						goods: {
							gid: item.gid,
							pid: item.pid,
							newCount
						}
					},
					success: () => {
						// console.log(res.result)
						uni.hideLoading()
						// this.goodsIds[e.index].count = newCount
						// item.count = newCount
					},
					fail: () => {
						uni.hideLoading();
						this.$refs.uToast.show({
							message: '修改数量失败，请重试',
							type: 'error'
						})
					}
				})
			},
			// 删除商品
			goodsDel() {
				let status = this.goodsIds.some(x => x.checked == true);
				let arr = this.goodsIds.filter(x => x.checked == false);
				if (!status) {
					this.$refs.uToast.show({
						message: '请勾选删除商品！',
						type: 'default'
					})
					return;
				}
				// uni.showLoading()
				console.log(arr)
				// uniCloud.callFunction({
				// 	name: 'delCart',
				// 	data: {
				// 		userName: this.userInfo.userName,
				// 		good: arr
				// 	},
				// 	success: (res) => {
				// 		uni.hideLoading();
				// 		this.$refs.uToast.show({
				// 			message: res.msg,
				// 			type: 'default'
				// 		})
				// 	},
				// 	fail: () => {
				// 		uni.hideLoading();
				// 		this.$refs.uToast.show({
				// 			message: '删除商品失败，请重试',
				// 			type: 'error'
				// 		})
				// 	}
				// })
				// console.log(arr)
			},
			// 向数组添加新属性
			addType(item1, nameType, item2) {
				let arr = {};
				arr[name] = item2;
				arr = Object.assign(arr[name], item1);
				return arr;
			},
			// 选中商品
			selectGoods(index) {
				// item.checked = !item.checked;
				this.goodsIds[index].checked = !this.goodsIds[index].checked;
				this.$forceUpdate();
			},
			// 全部选中
			allChoose() {
				// if (this.allSelected) {
				// 	this.goodsIds.forEach((x, i) => {
				// 		this.goodsIds[i].checked = false;
				// 	});
				// } else {
				this.goodsIds.forEach((x, i) => {
					x.checked = !x.checked;
				});
				// }
				this.$forceUpdate();
			},
			// 获取推荐商品
			getRecGoods() {
				let data = {
					type: 7,
					offset: this.dataOffset,
					limit: 20
				}
				this.$u.api.getRecommendGoods(data).then(res => {
					res.data.recommendResponseList.forEach(x => {
						this.goodsList.push(x.data.goods)
					})
					this.dataOffset += data.limit
					this.showLoadmore = true
					this.loadingStatus = 'loadmore'
				});
			},
			// 提示
			tips() {
				uni.showModal({
					title: '邮费说明',
					content: '2020年1月1日起，单笔订单满99元免运费，不满99元收10元运费。',
					showCancel: false,
					confirmText: '我知道了',
					confirmColor: '#845d32'
				})
			},
			// 跳转界面
			navigateTo(url) {
				switch (url) {
					case 'login':
						uni.navigateTo({
							url: '../../user/login/login'
						});
						break
					case 'home':
						uni.switchTab({
							url: '../home/home'
						});
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.top {
		// position: fixed;
		top: 0;
		width: 100%;
		color: #ffffff;
		background: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/2d0ca750-0e3d-11eb-b244-a9f5e5565f30.png') no-repeat center / 100% 100%;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;

		.title {
			font-size: 32rpx;
			letter-spacing: 2rpx;
			font-weight: bold;
		}
	}

	.nav-bar {
		position: fixed;
		width: 750rpx;
		z-index: 1;
	}

	// .have_goods_top {
	// 	height: 86rpx;
	// 	color: #333;
	// 	font-size: 22rpx;
	// 	background: #ffffff;
	// 	opacity: 0;
	// 	transition: 0.5s;
	// 	box-shadow: 0 2px 5px #f1f1f1;
	// 	view:nth-child(1) {
	// 		line-height: 86rpx;
	// 		font-size: 30rpx;
	// 		text-align: center;
	// 	}
	// 	view:nth-child(2) {
	// 		right: 28rpx;
	// 		font-size: 26rpx;
	// 	}
	// }
	.have-goods {
		// margin-top: 100rpx;
		padding: 0 20rpx;
		background: url(http://bd.zhichi921.com/attachment/weitao/cart_goods_bg.png) no-repeat top / 750rpx 212rpx;
		// height: 600rpx;
		overflow: hidden;
		font-size: 32rpx;

		.shop-card {
			// width: 716rpx;
			margin: 20rpx auto 36rpx;
			background-color: #fff;
			border-radius: 12rpx;
			padding: 24rpx 28rpx 30rpx 18rpx;

			.shop-title {
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;

				.title-nav {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.title {
					font-size: 32rpx;
					color: #2d2d2d;
					font-weight: bold;
					margin-left: 14rpx;
					font-family: Pingfang-Regular;
				}

				.tips {
					margin-left: auto;

					image {
						width: 23rpx;
						height: 23rpx;
					}

					text {
						font-size: 28rpx;
						color: #666;
						margin-left: 8rpx;
					}
				}
			}
		}
	}

	.checked-img {
		min-width: 34rpx;
		width: 34rpx;
		height: 34rpx;
	}

	.goods-box {
		position: relative;
		margin-bottom: 72rpx;

		.goods-nav {
			display: flex;

			.goods-img {
				width: 156rpx;
				height: 156rpx;
				min-width: 156rpx;
				margin: 0 20rpx;
				border-radius: 12rpx;
				overflow: hidden;
				background-color: #f8f8f8;

				image {
					width: inherit;
					height: inherit;
				}
			}

			.detail {
				flex: 1;
				// display: flex;
				// flex-direction: column;
				max-width: 440rpx;
				height: 156rpx;
				color: #333;
				font-size: 26rpx;

				.label {
					padding: 0 6rpx;
					margin-right: 6rpx;
					font-size: 22rpx;
					border-radius: 12rpx;
					color: #BF1111;
					border: 1.5rpx solid #bf1111;
				}

				.name {
					line-height: 36rpx;
					height: 78rpx;
				}

				.props-box {
					max-width: 100%;
					display: inline;
					// align-items: center;
					height: 36rpx;
					margin-top: 6rpx;
					border-radius: 8rpx;
					font-size: 22rpx;
					color: #666;
					background-color: #f7f7f7;

					.prop {
						margin: 0 12rpx;
						// margin-right:16rpx;
						// overflow: hidden;
						// text-overflow:ellipsis;
						// white-space: nowrap;
					}
				}

				.price-box {
					margin-top: 10rpx;
					display: flex;
					justify-content: space-between;

					.price {
						color: #bf1111;
					}
				}
			}
		}

	}

	.goods_count {
		position: absolute;
		bottom: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 120rpx;

		view {
			width: 54rpx;
			height: 40rpx;
			border-radius: 6rpx;
			line-height: 40rpx;
			text-align: center;
			background-color: #f4f4f4;
			color: #222;
		}

		image {
			width: 16rpx;
			height: 16rpx;
		}

		image:nth-child(1) {
			height: 4rpx;
		}
	}

	.no-goods {
		margin-top: 20rpx;
		text-align: center;
		font-size: 26rpx;

		image {
			width: 162rpx;
			height: 162rpx;
			margin-top: 54rpx;
		}

		view {
			color: #777;
			margin: 24rpx auto;
		}

		.btn {
			width: 190rpx;
			height: 60rpx;
			border: 1rpx solid #d3c2a8;
			border-radius: 30rpx;
			color: #b8996a;
			margin: 0 auto 54rpx;
			line-height: 56rpx;
		}
	}

	.settlement {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		bottom: var(--window-bottom);
		left: 0;
		height: 100rpx;
		width: 750rpx;
		border-top: 1rpx solid #efefef;
		border-bottom: 1rpx solid #efefef;
		background-color: #fff;
		z-index: 1;
		font-size: 26rpx;
		color: #333;

		&>view {
			display: flex;
			align-items: center;
		}

		image {
			margin: 0 12rpx 0 21rpx;
		}

		.confirm {
			font-weight: bold;

			view:nth-child(1) text {
				color: #b90000;
			}

			view:nth-child(2) {
				width: 176rpx;
				height: 70rpx;
				margin: 0 16rpx;
				text-align: center;
				line-height: 70rpx;
				font-size: 28rpx;
				font-family: Pingfang-Regular;
				color: #fff;
				border-radius: 35rpx;
				background-image: linear-gradient(135deg, #f2140c, #f2270c 70%, #f24d0c);
			}
		}
	}

	.select_img {
		width: 34rpx;
		height: 34rpx;
	}
</style>
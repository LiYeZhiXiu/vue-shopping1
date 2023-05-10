<template>
	<view class="mine-page">
		<!-- 头部 -->
		<view class="mine-header">
			<!-- 头像 -->
			<view class="user_info">
				<!-- 头像 -->
				<view class="avatar_wrap">
					<u--image :showLoading="true" :src="avatar_img" shape="circle" :lazy-load="true" mode="widthFix"
						width="60"></u--image>
				</view>
				<!-- 登录 -->
				<view class="personal_wrap" v-if="!isLogin">
					<view class="name">
						请登录/注册您的账号
					</view>
					<view class="get_login" @click="navigateTo('login')">
						点击登录
					</view>
				</view>
				<!-- 用户名 -->
				<view class="userName" v-if="isLogin">
					<view>{{userInfo.userName}}</view>
					<view class="iconfont icon-shezhi account-icon" @click="navigateTo('setting')">

					</view>
				</view>
			</view>
			<!-- 商品收藏 -->
			<view class="xlist_group">
				<view class="assets_item" v-for="(item,index) in shopList" :key="index">
					<view class="store_val">{{item.num}}</view>
					<view class="assets_item_key">
						{{item.text}}
					</view>
				</view>
			</view>
		</view>
		<!-- 订单 -->
		<view class="my_order xlist_group">
			<view class="assets_item" v-for="(item,index) in orderList" :key="index">
				<view :class="item.className" :style="{color:index==orderIndex?'red':'#000'}"></view>
				<view class="type_unpay">
					{{item.text}}
				</view>
			</view>
		</view>
		<!-- 功能 -->
		<view class="function xlist_group">
			<view class="assets_item" v-for="(item,index) in functions" :key="index">
				<view :class="item.icon" :style="{color:index==funIndex?'red':'#000'}" v-if="item.icon"></view>
				<view class="store_val" style="color: #000000;">
					{{item.num}}
				</view>
				<view class="type_unpay">
					{{item.name}}
				</view>
			</view>
		</view>
		<!-- 工具与服务 -->
		<view class="activity-wrap">
			<view class="activity-title">
				工具与服务
			</view>
			<view class="tools_container">
				<view class="tools_item" v-for="(item,index) in activitys" :key="index">
					<view class="tools_icon">
						<image :src="item.img" style="width: 80rpx;height: 80rpx;background-size: contain;"></image>
					</view>
					<text class="tools_item_key">{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<mi-goods-list :dataList="goodsList" :loadMoreBg="loadingBg" :showLoadmore="showLoadmore"
			:loadMoreStatus="loadingStatus"></mi-goods-list>
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
				avatar_img: "https://img11.360buyimg.com/jdphoto/s120x120_jfs/t21160/90/706848746/2813/d1060df5/5b163ef9N4a3d7aa6.png",
				shopList: [{
						text: "商品收藏",
						num: 0
					},
					{
						text: "店铺收藏",
						num: 0
					},
					{
						text: "我的足迹",
						num: 0
					}
				],
				orderIndex: 0,
				orderList: [{
						text: '代付款',
						className: 'iconfont icon-pay',
						way: 'payment'
					},
					{
						text: '代收货',
						className: 'iconfont icon-unreceive',
						way: 'receive'
					},
					{
						text: '退款',
						className: 'iconfont icon-tuikuan',
						way: 'refund'
					},
					{
						text: '订单',
						className: 'iconfont icon-order',
						way: 'order'
					}
				],
				funIndex: 0,
				functions: [{
						name: '优惠卷',
						num: 0
					},
					{
						name: '白条额度',
						num: 0
					},
					{
						name: '京豆',
						num: 0
					},
					{
						name: '红包',
						num: 0
					},
					{
						name: '我的资产',
						icon: 'iconfont icon-zichan'
					}
				],
				dataOffset: 0,
				showLoadmore: false,
				loadingBg: '#f7f7f7',
				goodsList: [],
				loadingStatus: 'loadmore',
				activitys: [{
						name: '客户服务',
						img: 'https://img12.360buyimg.com/img/s70x70_jfs/t1/135809/4/7014/5528/5f35369dE8aff3fab/f4b952a87ea33ae4.png.webp'
					},
					{
						name: '我的预约',
						img: 'https://img12.360buyimg.com/img/s70x70_jfs/t1/143427/38/5400/4413/5f350384Edba4458b/bfcb210d2110a7d8.png.webp'
					},
					{
						name: '我的回答',
						img: 'https://img12.360buyimg.com/img/s70x70_jfs/t1/138657/15/5351/5178/5f3504ceE3707cfd0/bc8ff48c8edcc5b1.png.webp'
					},
					{
						name: '闲置换钱',
						img: 'https://img12.360buyimg.com/img/s70x70_jfs/t1/112188/32/14787/4956/5f3509edE376c2ddb/d716c6822cafa2b6.png.webp'
					},
					{
						name: '高价回收',
						img: 'https://img12.360buyimg.com/img/s70x70_jfs/t1/126073/34/9502/6741/5f350800Ee00c0d35/43485badf62439e9.png.webp'
					}
				]
			}
		},
		computed: {
			...mapState(['isLogin', 'userInfo'])
		},
		onLoad() {
			this.getRecGoods();
		},
		onReachBottom() {
			if (this.dataOffset >= 120) {
				return (this.loadingStatus = 'nomore')
			}
			this.loadingStatus = 'loading';
			this.getRecGoods();
		},
		methods: {
			// 获取推荐商品
			getRecGoods() {
				let data = {
					type: 1,
					offset: this.dataOffset,
					limit: 20
				}
				this.$u.api.getRecommendGoods(data).then(res => {
					res.data.recommendResponseList.forEach(x => {
						this.goodsList.push(x.data.goods);
					});
					this.dataOffset += data.limit
					this.showLoadmore = true
					this.loadingStatus = 'loadmore'
				});
			},
			navigateTo(url) {
				switch (url) {
					case 'login':
						uni.navigateTo({
							url: '../../user/login/login'
						});
						break;
					case 'setting':
						uni.navigateTo({
							url: '../../setting/setting'
						});
						break;
				}
			},
		}
	}
</script>

<style lang="scss">
	.mine-page {
		width: 100%;
		min-height: 1000rpx;
		background-color: #F7F7F7;

		.mine-header {
			width: 100%;
			background: url(https://img12.360buyimg.com/img/s1500x886_jfs/t1/115726/22/13102/240974/5f18fb83Ee40e230b/d4f2a67087fd443a.png) no-repeat scroll 0 0/cover;
			padding: 30rpx;

			.user_info {
				display: flex;
				width: 100%;
				height: 140rpx;

				.userName {
					display: flex;
					width: 100%;
					justify-content: space-between;
					align-items: center;
					color: #FFFFFF;
					margin-left: 30rpx;
					font-size: 30rpx;

					.account-icon {
						cursor: pointer;

					}
				}

				.personal_wrap {
					margin-left: 30rpx;
					font-size: 24rpx;
					color: #FFFFFF;

					.name {
						margin-top: 20rpx;
					}

					.get_login {
						display: inline-block;
						height: 25px;
						line-height: 25px;
						padding: 0 10px 0 30px;
						text-align: left;
						margin: 10rpx 0rpx 0rpx 0rpx;
						font-size: 10px;
						border-radius: 35px;
						position: relative;
						background: rgba(146, 28, 29, .3) url(https://img12.360buyimg.com/img/s30x36_jfs/t1/131297/36/18911/774/5fd031dcE51b1dee7/7c447d78f26d4da4.png) 10px 3px no-repeat;
						background-size: 15px 18px;
					}
				}
			}

		}

		.my_order {
			background-color: #fff;
			border-radius: 20rpx;
			position: relative;
			margin-top: -10px;
			padding: 20rpx 40rpx;

			.rel_container {
				color: #000;
			}
		}

		.function {
			border-radius: 20rpx;
			padding: 20rpx 40rpx;
			margin: 30rpx 0;
			background-color: #FFFFFF;
		}

		.activity-wrap {
			border-radius: 20rpx;
			padding: 20rpx 40rpx;
			margin: 30rpx 0;
			background-color: #FFFFFF;
			width: 100%;
			height: 400rpx;
			overflow: hidden;

			.activity-title {
				height: 60rpx;
				border-bottom: 1px solid #F9F9F9;
				font-weight: bold;
				font-size: 30rpx;
			}

			.tools_container {
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;

				.tools_item {
					width: 25%;
					height: 150rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.tools_item_key {
						font-size: 24rpx;
						color: #262626;
					}
				}
			}
		}

		.xlist_group {
			display: flex;
			justify-content: space-around;

			.assets_item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #FFFFFF;
				font-size: 24rpx;

				.type_unpay {
					color: #000;
				}
			}
		}
	}
</style>
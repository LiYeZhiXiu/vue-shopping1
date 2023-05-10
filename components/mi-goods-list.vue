<template>
	<view>
		<view class="titile u-flex" v-if="isShowTitle">
			<image src="/static/icon/titile_left.png"></image>
			<text>为你推荐</text>
			<image src="/static/icon/titile_right.png"></image>
		</view>
		<view class="goods-list">
			<view class="item" v-for="(item, index) in dataList" :key="index" @click="goToDetail(item.gid)">
				<image class="u-lazy-load" :src="item.imgSquare"></image>
				<view class="labelbox">
					<text v-for="(litem, lindex) in item.labels" :key="lindex" :style="{ backgroundColor: litem.attrs.bgColor }">{{ litem.text }}</text>
				</view>
				<view class="title">{{ item.name }}</view>
				<view class="subtitle">{{ item.summary }}</view>
				<view class="price">
					<text>￥</text>
					<text class="priceMin">{{ item.priceMin / 100 }}</text>
					<text class="spec" v-if="item.priceTag">起</text>
					<text class="marketPrice" v-if="item.priceMin != item.marketPrice">￥{{ item.marketPrice / 100 }}</text>
				</view>
			</view>
		</view>
		<view v-show="showLoadmore" class="load-more"><u-loadmore :status="loadMoreStatus" :bg-color="loadMoreBg"  :load-text="loadingText" /></view>
	</view>
</template>

<script>
export default {
	name: 'mi-goods-list',
	props: {
		dataList: {
			type: Array
		},
		isShowTitle: {
			type: Boolean,
			default: true
		},
		showLoadmore: {
			type: Boolean,
			default: false
		},
		loadMoreStatus: {
			type: String,
			default: 'loadmore'
		},
		loadMoreBg: {
			type: String,
			default: '#f9f9f9'
		}
	},
	data() {
		return {
			loadingText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中~',
				nomore: '没有更多商品了'
			}
		}
	},
	onLoad(){
		// console.log(dataList)
	},
	methods: {
		goToDetail(gid) {
			uni.navigateTo({
				url: '/pages/shop/goods/detail/detail?gid=' + gid
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	$oneWidth:320rpx;
	$oneHeight:506rpx;
.goods-list {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 0 20rpx;
	.item {
		position: relative;
		width: $oneWidth;
		height: $oneHeight;
		border-radius: 8rpx;
		background-color: #ffffff;
		margin-top: 24rpx;
		font-size: 28rpx;
		overflow: hidden;
		& > image:nth-child(1) {
			width: $oneWidth;
			height: $oneWidth;
			border-radius: 8rpx 8rpx 0 0;
		}
		.labelbox {
			position: absolute;
			top: 308rpx;
			left: 0;
			text {
				display: inline-block;
				border-radius: 4rpx;
				// background-color: #d96b6c;
				color: #ffffff;
				margin-right: 10rpx;
				text-align: center;
				height: 32rpx;
				padding: 0 10rpx;
				line-height: 32rpx;
				font-size: 24rpx;
			}
		}
		.title,
		.subtitle {
			width: $oneWidth;
			padding-left: 16rpx;
			padding-right: 6rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			-webkit-box-pack: center;
			overflow: hidden;
		}
		.title {
			font-size: 30rpx;
			color: rgb(51, 51, 51);
			line-height: 42rpx;
			margin-top: 6rpx;
		}
		.subtitle {
			font-size: 26rpx;
			color: rgb(153, 153, 153);
			margin-top: 4rpx;
			line-height: 36rpx;
		}
		.price {
			margin: 10rpx 0 0 16rpx;
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
				font-size: 28rpx;
				color: rgb(153, 153, 153);
				text-decoration: line-through;
			}
			.spec {
				font-size: 24rpx;
			}
		}
	}
}
.load-more {
	margin: 30rpx 0;
}
.titile {
	justify-content: space-between;
	margin: 20rpx 0;
	padding: 0 264rpx;
	color: #333;
	font-size: 28rpx;
	font-weight: bold;
	image {
		width: 36rpx;
		height: 24rpx;
	}
}

</style>


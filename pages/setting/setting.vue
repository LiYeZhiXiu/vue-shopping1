<template>
	<view class="setting-page">
		<!-- 我的账户 -->
		<view class="account_section_v2">
			<text class="account_section_title_left">管理我的账户</text>
			<view class="account_list">
				<view class="account_itemv2 current_account">
					<view class="current_account_tip">当前登录</view>
					<view class="user_info">
						<view class="user_avator-wrapper">
							<u--image :showLoading="true" :src="avatar_img" shape="circle" :lazy-load="true"
								mode="widthFix" width="120rpx"></u--image>
						</view>

						<view class="user_detail">
							<view class="main_detail">
								<text class="user_name">
									{{userInfo.userName}}
								</text>
							</view>
							<view class="append_detail">
								<text class="user_pin">
									账户名:{{userInfo.userName}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 收货地址管理 -->
		<view class="account_manage">
			<view class="item">
				<view>收货地址管理</view>
				<view class="text">
					<view>管理我的地址 </view>
					<view class="arrow-right"></view>
				</view>
			</view>
		</view>
		<!-- 账户和安全 -->
		<view class="account_manage">
			<view class="item">
				<view>账户和安全</view>
				<view class="text">
					<view>密码/实名认证等管理</view>
					<view class="arrow-right"></view>
				</view>
			</view>
			<view class="item">
				<view>支付密码</view>
				<view class="text">
					<view>去设置</view>
					<view class="arrow-right"></view>
				</view>
			</view>
			<view class="item">
				<view>隐私设置</view>
				<view class="text">
					<view class="arrow-right"></view>
				</view>
			</view>
		</view>
		<!-- 联系客服 -->
		<view class="account_manage">
			<view class="item">
				<view>联系客服</view>
				<view class="text">
					<view>即时解答用户疑难 </view>
					<view class="arrow-right"></view>
				</view>
			</view>
			<view class="item">
				<view>切换站点</view>
				<view class="text">
					<view class="arrow-right"></view>
				</view>
			</view>
		</view>
		<!-- 退出登录 -->
		<view class="login-out" @click="loginOut">
			退出登录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar_img: "https://img11.360buyimg.com/jdphoto/s120x120_jfs/t21160/90/706848746/2813/d1060df5/5b163ef9N4a3d7aa6.png",
			}
		},
		methods: {
          loginOut(){
			  uni.clearStorageSync();
		  }
		}
	}
</script>

<style lang="scss">
	.setting-page {
		width: 100%;
		height: 100vh;
		background-color: #e7e5e6;
        position: relative;
		.account_section_v2 {
			background-color: #fff;
			position: relative;
			padding: 12rpx 10rpx 0;
			margin-bottom: 30rpx;
			border-radius: 0 0 10rpx 10rpx;

			.account_section_title_left {
				color: #333;
				font-size: 32rpx;
			}

			.account_list {
				position: relative;
				margin: 0;
				padding: 10px 0 20rpx;

				.account_itemv2 {
					width: 100%;
					background: #fff9f9;
					height: 90px;
					padding: 30rpx 20rpx 20rpx;
					border: 1px solid #ff414e;
					border-radius: 14rpx;

					.current_account_tip {
						position: absolute;
						right: 4rpx;
						top: 22rpx;
						padding: 1px 10px;
						background-color: #ffe4e4;
						color: #e2231a;
						border-top-right-radius: 10px;
						border-bottom-left-radius: 10px;
					}

					.user_info {
						display: flex;
						-webkit-box-align: center;
						-webkit-align-items: center;
						align-items: center;

						.user_avator-wrapper {
							position: relative;
							display: inline-block;
							width: 120rpx;
							height: 120rpx;
							vertical-align: middle;
							border-radius: 100%;
							// overflow: hidden;
							margin-right: 10px;
							-webkit-transform: translateZ(0);
							transform: translateZ(0);


						}

						.user_detail {
							.main_detail {
								.user_name {
									color: #331606;
									margin-right: 5px;
								}
							}

							.append_detail {
								.user_pin {
									color: #103233;
									margin-right: 5px;
								}
							}
						}
					}
				}
			}
		}

		.account_manage {
			position: relative;
			margin-bottom: 30rpx;
			background-color: #fff;
			border-radius: 20rpx;

			.item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				position: relative;
				height: 88rpx;
				font-size: 16px;
				color: #333;
				padding: 0rpx 20rpx;
				box-sizing: border-box;

				.text {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #999;
					cursor: pointer;

					.arrow-right {
						width: 24rpx;
						height: 24rpx;
						background-size: 100% 100%;
						background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAVUExURczMzEdwTM3NzczMzM3NzczMzMzMzDp2jh0AAAAGdFJOU/wAV+NM2CVM3f4AAABXSURBVBjTYxBEAgzoHGcjJI5ZgiISJ40JwXFIg0qBOEJsUCmwaQpQKTAHJgWxByoF4QClWBAuUEhLxs5BUYZsAIrRyJaiOAfFoWHIXghD9pyrCa4AgQMA7gwdk+IuDLcAAAAASUVORK5CYII=);
						margin-left: 10rpx;
					}
				}
			}
		}
		.login-out{
			width: 100%;
			height: 80rpx;
			background-color: #fff;
			display: flex;
			align-items:center;
			justify-content:center;
			font-size: 24rpx;
			color: #000;
			border-radius: 20rpx;
			cursor:pointer;
		}
	}
</style>